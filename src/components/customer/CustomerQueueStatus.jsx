import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Bell, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import LiveQueueStatus from '../salon/salonQueue/LiveQueueStatus';
import { useQueue } from '../../context/QueueContext';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const CustomerQueueStatus = ({ onNavigateHome }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useQueue();

  const token = localStorage.getItem('silverscissor_token');

  const fetchActiveBookings = useCallback(async () => {
    try {
      const res = await fetch(`${SALON_API}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        const today = new Date();
        const todayStr = today.toDateString();
        const active = (json.data || []).filter(
          (b) =>
            ['confirmed', 'in_service'].includes(b.status) &&
            new Date(b.date).toDateString() === todayStr
        );
        setBookings(active);
      }
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchActiveBookings();
  }, [fetchActiveBookings]);

  const formatTime = (d) => {
    if (!d) return '--';
    return new Date(d).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            लाइव क्यू स्टेटस
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isConnected
              ? '🟢 Live updates connected'
              : '🔴 Connecting to live updates...'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            आज कोई बुकिंग नहीं
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            आज के लिए कोई सक्रिय क्यू नहीं है। नई बुकिंग करने के लिए नीचे क्लिक करें।
          </p>
          <button
            onClick={onNavigateHome}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition"
          >
            अभी बुक करें
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-purple-100 dark:border-purple-900"
            >
              {/* Booking header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {booking.service?.name || 'Booking'}
                  </span>
                </div>
                <span className="text-white/80 text-xs">
                  {booking.timeSlot}
                </span>
              </div>

              {/* Live Queue Status */}
              {booking.salonId?._id && (
                <LiveQueueStatus
                  bookingId={booking._id}
                  salonId={booking.salonId._id}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerQueueStatus;
