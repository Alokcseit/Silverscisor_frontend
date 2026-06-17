import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Palette, Clock, User, ChevronRight, Loader2 } from 'lucide-react';
import DecorativeBackground from '../../util/DecorativeBackground';

const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5003/api/admin';

const CATEGORY_ICONS = {
  haircut: Scissors,
  beard: User,
  color: Palette,
  facial: Sparkles,
  massage: User,
  other: Clock,
};

const CATEGORY_COLORS = {
  haircut: { from: 'from-blue-500', to: 'to-cyan-400', shadow: 'shadow-blue-500/20' },
  beard: { from: 'from-emerald-500', to: 'to-teal-400', shadow: 'shadow-emerald-500/20' },
  color: { from: 'from-pink-500', to: 'to-rose-400', shadow: 'shadow-pink-500/20' },
  facial: { from: 'from-orange-500', to: 'to-amber-400', shadow: 'shadow-orange-500/20' },
  massage: { from: 'from-indigo-500', to: 'to-blue-500', shadow: 'shadow-indigo-500/20' },
  other: { from: 'from-gray-500', to: 'to-slate-400', shadow: 'shadow-gray-500/20' },
};

const ServiceImageWithFallback = ({ service, IconComponent, colors }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`h-28 sm:h-32 bg-gradient-to-br ${colors.from} ${colors.to} flex flex-col items-center justify-center p-3 text-white`}>
        <IconComponent className="w-8 h-8 mb-1 opacity-80" strokeWidth={1.5} />
        <h3 className="text-sm font-bold text-center leading-tight drop-shadow-sm">{service.name}</h3>
        {service.description && (
          <p className="text-[10px] text-white/70 mt-0.5 text-center line-clamp-1">{service.description}</p>
        )}
      </div>
    );
  }
  return (
    <div className="relative h-28 sm:h-32 bg-gray-100 dark:bg-gray-800">
      <img
        src={service.imageUrl}
        alt={service.name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm text-white">
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="absolute bottom-2 left-2 right-2">
        <h3 className="text-sm font-bold text-white drop-shadow-sm leading-tight">{service.name}</h3>
        {service.description && (
          <p className="text-[10px] text-white/70 mt-0.5 line-clamp-1 drop-shadow-sm">{service.description}</p>
        )}
      </div>
    </div>
  );
};

const ServiceSelection = ({ selectedService, setSelectedService, onServiceSelect, setShowBookingForm }) => {
  const [catalogServices, setCatalogServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${ADMIN_API}/services/catalog`);
        const json = await res.json();
        if (json.success) {
          setCatalogServices(json.data || []);
        } else {
          setError('Failed to load services');
        }
      } catch {
        setError('Could not load services');
      }
      setLoading(false);
    };
    fetchCatalog();
  }, []);

  const handleServiceClick = (service) => {
    const serviceData = {
      ...service,
      id: service._id,
      category: service.category,
      categories: undefined,
    };
    // Combo detection: if name contains "+" or "&", derive categories from name
    if (service.name && (service.name.includes('+') || service.name.includes('&'))) {
      const parts = service.name.split(/[+&]/).map(s => s.trim().toLowerCase());
      const matchedCategories = parts.filter(p =>
        ['haircut', 'beard', 'color', 'facial', 'massage'].includes(p)
      );
      if (matchedCategories.length >= 2) {
        serviceData.categories = matchedCategories;
      }
    }
    setSelectedService(serviceData);
    if (onServiceSelect) {
      onServiceSelect(serviceData);
    } else if (setShowBookingForm) {
      setShowBookingForm(true);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 py-16">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading services...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300 overflow-hidden">

      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute inset-0 z-0">
         <DecorativeBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold tracking-wider uppercase border border-purple-200 dark:border-purple-700">
            Services Menu
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Style</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {catalogServices.map((service) => {
            const IconComponent = CATEGORY_ICONS[service.category] || Clock;
            const colors = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other;
            const isSelected = selectedService?._id === service._id || selectedService?.id === service._id;
            const hasImage = service.imageUrl;

            return (
              <div
                key={service._id}
                onClick={() => handleServiceClick(service)}
                className={`
                  group relative rounded-2xl cursor-pointer transition-all duration-200 ease-out
                  ${isSelected ? 'transform -translate-y-1' : 'hover:-translate-y-0.5'}
                `}
              >
                {/* Card */}
                <div className={`
                  relative overflow-hidden rounded-2xl border transition-all duration-200
                  ${isSelected
                    ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20'
                    : 'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
                  }
                `}>
                  {/* Background Image */}
                  {hasImage ? (
                    <ServiceImageWithFallback
                      service={service}
                      IconComponent={IconComponent}
                      colors={colors}
                    />
                  ) : (
                    <div className={`h-28 sm:h-32 bg-gradient-to-br ${colors.from} ${colors.to} flex flex-col items-center justify-center p-3 text-white`}>
                      <IconComponent className="w-8 h-8 mb-1 opacity-80" strokeWidth={1.5} />
                      <h3 className="text-sm font-bold text-center leading-tight drop-shadow-sm">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-[10px] text-white/70 mt-0.5 text-center line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Select indicator */}
                  <div className={`
                    absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                    ${isSelected
                      ? 'bg-purple-600 text-white shadow-md scale-110'
                      : 'bg-white/80 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100'
                    }
                  `}>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {catalogServices.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Scissors className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No services available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;