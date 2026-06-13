import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, CheckCircle, XCircle, Loader2, AlertTriangle, Calendar } from 'lucide-react';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const SalonBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const token = localStorage.getItem('silverscissor_token');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);

      const res = await fetch(`${SALON_API}/bookings/salon?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setBookings(json.data);
      else setError(json.message || 'Failed to load bookings');
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }, [filter, token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (bookingId, action, reason) => {
    setActionLoading(bookingId);
    try {
      const body = { action };
      if (action === 'reject') body.rejectReason = reason || 'Not available';

      const res = await fetch(`${SALON_API}/bookings/${bookingId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        setRejectModal(null);
        setRejectReason('');
      } else {
        alert(json.message || 'Action failed');
      }
    } catch {
      alert('Network error');
    }
    setActionLoading(null);
  };

  const handleReject = (booking) => {
    setRejectModal(booking);
    setRejectReason('');
  };

  const submitReject = () => {
    if (rejectModal) handleAction(rejectModal._id, 'reject', rejectReason);
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'पेंडिंग', class: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      case 'confirmed':
        return { label: 'कन्फर्म्ड', class: 'bg-green-100 text-green-700 border-green-300' };
      case 'in_service':
        return { label: 'इन सर्विस', class: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'completed':
        return { label: 'पूर्ण', class: 'bg-gray-100 text-gray-700 border-gray-300' };
      case 'cancelled':
        return { label: 'रद्द', class: 'bg-red-100 text-red-700 border-red-300' };
      case 'rejected':
        return { label: 'अस्वीकृत', class: 'bg-red-100 text-red-700 border-red-300' };
      default:
        return { label: status, class: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return '—';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">बुकिंग रिक्वेस्ट</h2>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'सभी' },
            { key: 'pending', label: 'पेंडिंग' },
            { key: 'confirmed', label: 'कन्फर्म्ड' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading bookings...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No bookings found</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const badge = statusBadge(booking.status);
            return (
              <div
                key={booking._id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 border-l-4 ${
                  booking.status === 'pending'
                    ? 'border-yellow-500'
                    : booking.status === 'confirmed'
                    ? 'border-green-500'
                    : booking.status === 'rejected' || booking.status === 'cancelled'
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 md:gap-4 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      booking.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      <User className={`w-5 h-5 md:w-6 md:h-6 ${
                        booking.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-purple-600 dark:text-purple-400'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white truncate">
                        {booking.customerName}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        {booking.customerPhone}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5">सेवा</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {booking.service?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5">समय</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {booking.timeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5">अवधि</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {formatDuration(booking.service?.estimatedDuration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5">मूल्य</p>
                    <p className="text-xs md:text-sm font-semibold text-purple-600 dark:text-purple-400">
                      ₹{booking.service?.price}
                    </p>
                  </div>
                </div>

                {/* Pending actions */}
                {booking.status === 'pending' && (
                  <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleAction(booking._id, 'confirm')}
                      disabled={actionLoading === booking._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                    >
                      {actionLoading === booking._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      कन्फर्म करें
                    </button>
                    <button
                      onClick={() => handleReject(booking)}
                      disabled={actionLoading === booking._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      रिजेक्ट करें
                    </button>
                  </div>
                )}

                {/* Rejected reason */}
                {booking.status === 'rejected' && booking.cancellation?.reason && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Reason: {booking.cancellation.reason}
                    </p>
                  </div>
                )}

                {/* Confirmed actions */}
                {booking.status === 'confirmed' && (
                  <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                      पूर्ण करें
                    </button>
                    <button className="px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                      रद्द करें
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-2 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">रिजेक्ट करने का कारण</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {rejectModal.customerName} की बुकिंग रिजेक्ट करने का कारण बताएं
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="कारण लिखें (optional)"
              rows={3}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={actionLoading === rejectModal._id}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {actionLoading === rejectModal._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                रिजेक्ट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonBookingsList;
