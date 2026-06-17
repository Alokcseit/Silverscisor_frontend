import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Loader2, Scissors, ChevronLeft, ArrowLeft } from 'lucide-react';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const SalonForServiceSelect = ({ selectedService, onSelectSalon, onBack }) => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedService) return;
    const fetchSalons = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedService.categories) {
          params.set('categories', selectedService.categories.join(','));
        } else if (selectedService.category) {
          params.set('category', selectedService.category);
        } else if (selectedService.name) {
          params.set('name', selectedService.name);
        }

        const token = localStorage.getItem('silverscissor_token');
        const res = await fetch(`${SALON_API}/salon/offering-service?${params.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success) {
          setSalons(json.data || []);
        } else {
          setError(json.message || 'Failed to fetch salons');
        }
      } catch {
        setError('Network error. Please try again.');
      }
      setLoading(false);
    };
    fetchSalons();
  }, [selectedService]);

  const handleSalonSelect = (salon) => {
    if (!salon.services || salon.services.length === 0) return;
    const serviceData = salon.services[0];
    const salonService = {
      _id: serviceData._id,
      name: serviceData.name,
      price: serviceData.price,
      estimatedDuration: serviceData.estimatedDuration,
      description: serviceData.description,
      category: serviceData.category,
      imageUrl: serviceData.imageUrl,
    };
    onSelectSalon(salon, salonService);
  };

  const formatDuration = (mins) => {
    if (!mins) return '—';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  if (!selectedService) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Select a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Salon</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Salons offering <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedService.name}</span>
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Finding salons...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-500 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* No salons found */}
        {!loading && !error && salons.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Scissors className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No salons found</p>
            <p className="text-sm mt-1">
              No salons currently offer "{selectedService.name}" in your area.
            </p>
          </div>
        )}

        {/* Salon list */}
        {!loading && !error && salons.length > 0 && (
          <div className="space-y-4">
            {salons.map((salon) => {
              return (
                <div
                  key={salon._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group"
                  onClick={() => handleSalonSelect(salon)}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Salon image */}
                    <div className="sm:w-48 h-36 sm:h-auto bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
                      {salon.images?.[0] ? (
                        <img
                          src={salon.images[0]}
                          alt={salon.salonName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Scissors className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-none" />
                      <div className="absolute bottom-3 left-3 sm:hidden">
                        <span className="text-white font-bold text-lg drop-shadow-lg">
                          {salon.salonName}
                        </span>
                      </div>
                    </div>

                    {/* Salon info */}
                    <div className="flex-1 p-5 min-w-0">
                      <div className="hidden sm:block">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {salon.salonName}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {[salon.address?.area, salon.address?.city].filter(Boolean).length > 0 && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {[salon.address?.area, salon.address?.city].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {salon.stats?.averageRating > 0 && (
                          <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {salon.stats.averageRating.toFixed(1)} ({salon.stats.totalReviews || 0})
                          </span>
                        )}
                      </div>

                      {/* Matching services */}
                      <div className="mt-3 space-y-1.5">
                        {salon.services.slice(0, 3).map((svc) => (
                          <div key={svc._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate block">
                                {svc.name}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {formatDuration(svc.estimatedDuration)}
                              </span>
                            </div>
                            <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 ml-3">
                              ₹{svc.price}
                            </span>
                          </div>
                        ))}
                        {salon.services.length > 3 && (
                          <p className="text-xs text-gray-400 text-center pt-0.5">
                            +{salon.services.length - 3} more services
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
                          Select Salon
                          <ChevronLeft className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonForServiceSelect;