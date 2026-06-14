import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const QueueContext = createContext(null);

const SALON_API = import.meta.env.VITE_SALON_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const salonIdRef = useRef(null);
  const tokenRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchQueue = useCallback(async (salonId, token) => {
    try {
      const res = await axios.get(`${SALON_API}/api/queue/${salonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookings = res.data.data || [];
      const serving = bookings.find((b) => b.status === 'in_service');
      setQueue(bookings.filter((b) => b.status !== 'in_service'));
      setCurrentServing(serving || null);
    } catch (err) {
      console.error('Queue fetch error:', err.message);
    }
  }, []);

  const joinSalon = useCallback((salonId) => {
    const token = localStorage.getItem('silverscissor_token');
    if (!token || !salonId) return;
    tokenRef.current = token;
    salonIdRef.current = salonId;

    fetchQueue(salonId, token);

    if (socketRef.current?.connected) {
      socketRef.current.emit('queue:join', { salonId, role: 'salon' });
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('queue:join', { salonId, role: 'salon' });
    });

    socket.on('queue:state', () => {
      fetchQueue(salonId, token);
    });

    socket.on('queue:service_started', ({ bookingId }) => {
      setQueue((prev) => {
        const started = prev.find((b) => b._id === bookingId);
        if (started) {
          setCurrentServing({ ...started, status: 'in_service', actualStartTime: new Date() });
          return prev.filter((b) => b._id !== bookingId);
        }
        return prev;
      });
    });

    socket.on('queue:service_completed', ({ bookingId, updatedQueue }) => {
      setCurrentServing(null);
      if (updatedQueue) {
        const serving = updatedQueue.find((b) => b.status === 'in_service');
        setQueue(updatedQueue.filter((b) => b.status !== 'in_service'));
        setCurrentServing(serving || null);
      } else {
        fetchQueue(salonId, token);
      }
    });

    socket.on('queue:delay_alert', (delayData) => {
      setQueue((prev) =>
        prev.map((b) =>
          b._id === delayData.bookingId
            ? { ...b, estimatedDelay: delayData.estimatedDelay, newArrivalTime: delayData.newArrivalTime, hasSignificantDelay: delayData.hasSignificantDelay }
            : b
        )
      );
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;
  }, [fetchQueue]);

  const leaveSalon = useCallback(() => {
    if (socketRef.current?.connected && salonIdRef.current) {
      socketRef.current.emit('queue:leave', { salonId: salonIdRef.current });
    }
    salonIdRef.current = null;
  }, []);

  const startService = useCallback(async (bookingId) => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      await axios.put(
        `${SALON_API}/api/queue/${bookingId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Start service error:', err.message);
    }
  }, []);

  const completeService = useCallback(async (bookingId) => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const res = await axios.put(
        `${SALON_API}/api/queue/${bookingId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.updatedQueue) {
        const updated = res.data.updatedQueue;
        const serving = updated.find((b) => b.status === 'in_service');
        setQueue(updated.filter((b) => b.status !== 'in_service'));
        setCurrentServing(serving || null);
      } else {
        if (salonIdRef.current && tokenRef.current) {
          fetchQueue(salonIdRef.current, tokenRef.current);
        }
      }
    } catch (err) {
      console.error('Complete service error:', err.message);
    }
  }, [fetchQueue]);

  const notifyDelay = useCallback(async (bookingId) => {
    const token = tokenRef.current;
    if (!token || !salonIdRef.current) return;
    if (socketRef.current?.connected) {
      socketRef.current.emit('queue:notify_delay', {
        salonId: salonIdRef.current,
        bookingId,
      });
      return new Promise((resolve) => {
        const handler = (data) => {
          if (data.bookingId === bookingId) {
            socketRef.current?.off('queue:notify_delay_confirmed', handler);
            resolve(data);
          }
        };
        socketRef.current?.on('queue:notify_delay_confirmed', handler);
        setTimeout(() => {
          socketRef.current?.off('queue:notify_delay_confirmed', handler);
          resolve(null);
        }, 8000);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const value = {
    queue,
    currentServing,
    isConnected,
    error,
    joinSalon,
    leaveSalon,
    startService,
    completeService,
    notifyDelay,
    fetchQueue,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};

export { QueueProvider, useQueue };
