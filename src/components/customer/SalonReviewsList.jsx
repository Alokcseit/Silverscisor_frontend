import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002';

const SalonReviewsList = ({ salonId, salonName }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${SALON_API}/api/salon/${salonId}/reviews`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data || []);
        setAverageRating(json.averageRating || 0);
        setTotalReviews(json.totalReviews || 0);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (salonId) fetchReviews();
  }, [salonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading reviews...</span>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="py-6 text-center">
        <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
      </div>
    );
  }

  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Average Rating</p>
            <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            <p className="text-xs opacity-80 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>
          <div className="text-right">
            <div className="flex gap-0.5 mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-xs opacity-80">{salonName}</p>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {displayReviews.map((booking) => (
          <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                  {booking.customerName}
                </p>
                <p className="text-xs text-gray-400">{formatDate(booking.review?.reviewedAt)}</p>
              </div>
              <div className="flex gap-0.5">
                {renderStars(booking.review?.rating || 0)}
              </div>
            </div>
            {booking.review?.comment && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                "{booking.review.comment}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 transition"
        >
          {showAll ? (
            <><ChevronUp className="w-4 h-4" /> Show less</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Show all {reviews.length} reviews</>
          )}
        </button>
      )}
    </div>
  );
};

// Full-screen modal version
export const SalonReviewsModal = ({ salonId, salonName, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-2 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white">All Reviews</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <SalonReviewsList salonId={salonId} salonName={salonName} />
        </div>
      </div>
    </div>
  );
};

export default SalonReviewsList;
