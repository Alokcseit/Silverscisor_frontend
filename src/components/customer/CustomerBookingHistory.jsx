import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Scissors, CheckCircle, XCircle, AlertCircle, Loader2, Star, MapPin, ThumbsUp } from 'lucide-react';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const STATUS_CONFIG = {
  pending: { label: 'पेंडिंग', class: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: AlertCircle },
  confirmed: { label: 'कन्फर्म्ड', class: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
  rejected: { label: 'अस्वीकृत', class: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  cancelled: { label: 'रद्द', class: 'bg-gray-100 text-gray-700 border-gray-300', icon: XCircle },
  completed: { label: 'पूर्ण', class: 'bg-blue-100 text-blue-700 border-blue-300', icon: ThumbsUp },
};

const CustomerBookingHistory = ({ onNavigateHome }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const token = localStorage.getItem('silverscissor_token');

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${SALON_API}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`${SALON_API}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: 'Cancelled by customer' }),
      });
      const json = await res.json();
      if (json.success) fetchBookings();
    } catch {}
    setActionLoading(null);
  };

  const openReview = (booking) => {
    setReviewModal(booking);
    setReviewRating(booking.review?.rating || 5);
    setReviewComment(booking.review?.comment || '');
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${SALON_API}/bookings/${reviewModal._id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewModal(null);
        fetchBookings();
      }
    } catch {}
    setSubmittingReview(false);
  };

  const getSalonName = (booking) => {
    if (booking.salonId?.salonName) return booking.salonId.salonName;
    if (booking.salonId?.name) return booking.salonId.name;
    return 'Salon';
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatDuration = (mins) => {
    if (!mins) return '—';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">मेरी बुकिंग</h2>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">कोई बुकिंग नहीं</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">अभी तक कोई अपॉइंटमेंट बुक नहीं की गई है</p>
          <button
            onClick={onNavigateHome}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            अभी बुक करें
          </button>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConf.icon;
            const hasReviewed = booking.review?.rating;

            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-4 md:p-6 border-l-4 border-purple-500 dark:border-purple-400"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Scissors className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white truncate">
                        {booking.service?.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400">ID: {booking._id.slice(-8)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap ${statusConf.class}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      सैलून
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {getSalonName(booking)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      दिनांक
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {formatDate(booking.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      समय
                    </p>
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
                    <p className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400">
                      ₹{booking.service?.price}
                    </p>
                  </div>
                </div>

                {booking.status === 'rejected' && booking.cancellation?.reason && (
                  <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-2.5 text-xs text-red-600 dark:text-red-400">
                    कारण: {booking.cancellation.reason}
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={actionLoading === booking._id}
                      className="w-full flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition disabled:opacity-60"
                    >
                      {actionLoading === booking._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      रिक्वेस्ट कैंसल करें
                    </button>
                  )}

                  {booking.status === 'completed' && !hasReviewed && (
                    <button
                      onClick={() => openReview(booking)}
                      className="w-full flex items-center justify-center gap-1.5 bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      रिव्यू दें
                    </button>
                  )}

                  {booking.status === 'completed' && hasReviewed && (
                    <div className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      आपका रिव्यू: {booking.review.rating}/5
                      {booking.review.comment && (
                        <span className="text-gray-400">— "{booking.review.comment}"</span>
                      )}
                    </div>
                  )}

                  {booking.status === 'cancelled' && (
                    <button
                      onClick={onNavigateHome}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      फिर से बुक करें
                    </button>
                  )}

                  {booking.status === 'rejected' && (
                    <button
                      onClick={onNavigateHome}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      दूसरा सैलून खोजें
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <p className="text-xs opacity-90 mb-1">कुल बुकिंग</p>
            <p className="text-2xl md:text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
            <p className="text-xs opacity-90 mb-1">पूर्ण</p>
            <p className="text-2xl md:text-3xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4">
            <p className="text-xs opacity-90 mb-1">पेंडिंग</p>
            <p className="text-2xl md:text-3xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <p className="text-xs opacity-90 mb-1">कुल खर्च</p>
            <p className="text-lg md:text-2xl font-bold">
              ₹{bookings.reduce((sum, b) => sum + (b.service?.price || 0), 0)}
            </p>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-2 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">अपना रिव्यू दें</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {reviewModal.service?.name} — {getSalonName(reviewModal)}
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="अपना experience लिखें (optional)"
              rows={3}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submittingReview}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                सबमिट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookingHistory;
