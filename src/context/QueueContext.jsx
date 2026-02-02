// src/context/QueueContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const QueueContext = createContext(null);

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [estimatedDelay, setEstimatedDelay] = useState(0);

  // Calculate real-time delays
  const calculateDelays = () => {
    let cumulativeDelay = 0;
    const now = new Date();

    const updatedQueue = queue.map((booking, index) => {
      const scheduledTime = new Date(`${booking.date} ${booking.time}`);
      
      if (index === 0 && currentServing) {
        // Current customer being served
        const elapsedTime = (now - currentServing.startTime) / 60000; // minutes
        const remainingTime = Math.max(0, booking.service.estimatedDuration - elapsedTime);
        cumulativeDelay = Math.max(0, remainingTime - ((scheduledTime - now) / 60000));
      } else if (index > 0) {
        // Future customers
        const previousBooking = queue[index - 1];
        cumulativeDelay += Math.max(0, previousBooking.actualDuration - previousBooking.service.estimatedDuration);
      }

      return {
        ...booking,
        estimatedDelay: Math.round(cumulativeDelay),
        newArrivalTime: new Date(scheduledTime.getTime() + cumulativeDelay * 60000)
      };
    });

    setQueue(updatedQueue);
  };

  // Start serving a customer
  const startService = (bookingId) => {
    const booking = queue.find(b => b.id === bookingId);
    if (booking) {
      setCurrentServing({
        ...booking,
        startTime: new Date()
      });
    }
  };

  // Complete service
  const completeService = (bookingId, actualDuration) => {
    setQueue(queue.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'completed', actualDuration }
        : b
    ));
    setCurrentServing(null);
    calculateDelays();
  };

  // Add booking to queue
  const addToQueue = (booking) => {
    setQueue([...queue, { ...booking, estimatedDelay: 0 }]);
  };

  // Remove from queue
  const removeFromQueue = (bookingId) => {
    setQueue(queue.filter(b => b.id !== bookingId));
    calculateDelays();
  };

  useEffect(() => {
    // Recalculate delays every minute
    const interval = setInterval(calculateDelays, 60000);
    return () => clearInterval(interval);
  }, [queue, currentServing]);

  const value = {
    queue,
    currentServing,
    estimatedDelay,
    startService,
    completeService,
    addToQueue,
    removeFromQueue,
    calculateDelays
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};