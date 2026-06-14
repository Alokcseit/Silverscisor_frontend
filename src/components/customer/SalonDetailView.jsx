import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, MapPin, Phone, Clock, Scissors, ChevronRight,
  Sparkles, Zap, Palette, User as UserIcon, Loader2, Check, MessageSquare
} from 'lucide-react';
import SalonReviewsList, { SalonReviewsModal } from './SalonReviewsList';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const CATEGORY_META = {
  haircut: { label: 'Haircut', icon: Scissors, gradient: 'from-blue-500 to-cyan-400' },
  beard: { label: 'Beard', icon: UserIcon, gradient: 'from-emerald-500 to-teal-400' },
  facial: { label: 'Facial', icon: Sparkles, gradient: 'from-orange-500 to-amber-400' },
  color: { label: 'Hair Color', icon: Palette, gradient: 'from-pink-500 to-rose-400' },
  massage: { label: 'Massage', icon: Zap, gradient: 'from-indigo-500 to-blue-500' },
  other: { label: 'Other', icon: Clock, gradient: 'from-gray-500 to-slate-400' },
};

const SalonDetailView = ({ salon, userData, onBack, onBookService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!salon?._id) return;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SALON_API}/services/${salon._id}`);
        const json = await res.json();
        if (json.success) setServices(json.data);
        else setError(json.message || 'Failed to load services');
      } catch {
        setError('Network error');
      }
      setLoading(false);
    };
    fetchServices();
  }, [salon?._id]);

  const groupedServices = {};
  services.forEach((svc) => {
    const cat = svc.category || 'other';
    if (!groupedServices[cat]) groupedServices[cat] = [];
    groupedServices[cat].push(svc);
  });

  const categoryOrder = ['haircut', 'beard', 'facial', 'color', 'massage', 'other'];

  const handleBook = (service) => {
    setSelectedService(service);
    onBookService(salon, service);
  };

  const formatDuration = (mins) => {
    if (!mins) return '—';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Salon Info */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/80 hover:text-white mb-4 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to salons
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {salon.images?.[0] && (
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                <img src={salon.images[0]} alt={salon.salonName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm">{salon.salonName}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">
                    {[salon.address?.area, salon.address?.city, salon.address?.state].filter(Boolean).join(', ')}
                  </span>
                </div>
                {salon.contact?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{salon.contact.phone}</span>
                  </div>
                )}
                {salon.stats?.averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                    <span className="font-bold">{salon.stats.averageRating.toFixed(1)}</span>
                    <span className="text-white/60">({salon.stats.totalReviews || 0})</span>
                  </div>
                )}
              </div>

              {salon.description && (
                <p className="mt-3 text-white/70 text-sm max-w-2xl line-clamp-2">{salon.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading services...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Scissors className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No services available yet</p>
            <p className="text-sm mt-1">This salon hasn't added any services.</p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="space-y-10">
            {categoryOrder.map((cat) => {
              const catServices = groupedServices[cat];
              if (!catServices || catServices.length === 0) return null;
              const meta = CATEGORY_META[cat] || CATEGORY_META.other;
              const IconComp = meta.icon;

              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-lg`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{meta.label}</h2>
                    <span className="text-sm text-gray-400 font-medium">({catServices.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catServices.map((svc) => (
                      <div
                        key={svc._id}
                        className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                      >
                        {svc.imageUrl && (
                          <div className="h-32 bg-gray-100 dark:bg-gray-700">
                            <img src={svc.imageUrl} alt={svc.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-gray-800 dark:text-white text-base">{svc.name}</h3>
                            <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                              ₹{svc.price}
                            </span>
                          </div>

                          {svc.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                              {svc.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(svc.estimatedDuration)}
                            </div>
                            <button
                              onClick={() => handleBook(svc)}
                              className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reviews Section */}
        {salon._id && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Reviews
              </h3>
              {salon.stats?.totalReviews > 3 && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  See all
                </button>
              )}
            </div>
            <SalonReviewsList salonId={salon._id} salonName={salon.salonName} />
          </div>
        )}
      </div>

      {/* All Reviews Modal */}
      {showAllReviews && salon._id && (
        <SalonReviewsModal
          salonId={salon._id}
          salonName={salon.salonName}
          onClose={() => setShowAllReviews(false)}
        />
      )}
    </div>
  );
};

export default SalonDetailView;
