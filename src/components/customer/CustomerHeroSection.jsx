import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Sparkles, Star, Clock, Phone, ChevronRight, Loader2, Navigation } from 'lucide-react';
import AnimatedClipSVG from '../../util/AnimatedClipSVG';
import TrendingNearYou from './recommendations/TrendingNearYou';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const CustomerHeroSection = ({ onNearbySalons, onViewSalon }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState({ text: 'Detecting location...', lat: null, lng: null });
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ text: 'Reddivaripalle, Andhra Pradesh', lat: null, lng: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        // Reverse geocode via Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`)
          .then(r => r.json())
          .then(data => {
            const addr = data.address;
            const area = addr?.suburb || addr?.neighbourhood || addr?.city_district || addr?.road || addr?.amenity || '';
            const city = addr?.city || addr?.town || addr?.village || addr?.county || '';
            const parts = [area, city, addr?.state].filter(Boolean);
            setLocation(prev => ({ ...prev, text: parts.join(', ') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          })
          .catch(() => {
            setLocation(prev => ({ ...prev, text: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          });
        // Auto-load nearby salons
        fetchSalons({ lat: latitude, lng: longitude });
      },
      () => {
        setLocation({ text: 'Reddivaripalle, Andhra Pradesh', lat: null, lng: null });
        setLocationError('Location access denied');
        fetchSalons({});
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const fetchSalons = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params.lat && params.lng) {
        searchParams.set('lat', params.lat);
        searchParams.set('lng', params.lng);
      }
      if (params.search) searchParams.set('search', params.search);
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.maxDistance) searchParams.set('maxDistance', params.maxDistance);

      const res = await fetch(`${SALON_API}/salon/nearby?${searchParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSalons(json.data);
        if (onNearbySalons) onNearbySalons(json.data);
      } else {
        setError(json.message || 'Failed to fetch salons');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }, [onNearbySalons]);

  const handleSearch = () => {
    setActiveFilter(null);
    const params = {};
    if (location.lat && location.lng) {
      params.lat = location.lat;
      params.lng = location.lng;
    }
    if (query.trim()) params.search = query.trim();
    fetchSalons(params);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleFilterClick = (filter) => {
    const newFilter = activeFilter === filter ? null : filter;
    setActiveFilter(newFilter);
    setQuery('');
    if (!newFilter) {
      // Reload with just location
      const params = {};
      if (location.lat && location.lng) {
        params.lat = location.lat;
        params.lng = location.lng;
      }
      fetchSalons(params);
      return;
    }

    const params = {};
    if (location.lat && location.lng) {
      params.lat = location.lat;
      params.lng = location.lng;
    }

    switch (newFilter) {
      case 'Nearby':
        if (!location.lat) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
              fetchSalons({ lat: latitude, lng: longitude });
            },
            () => setError('Could not get your location')
          );
          return;
        }
        break;
      case 'Top Rated':
        params.sortBy = 'rating';
        break;
      case 'Open Now':
        params.sortBy = 'openNow';
        break;
      default:
        break;
    }
    fetchSalons(params);
  };

  const handleTrendingClick = (term) => {
    setQuery(term);
    setActiveFilter(null);
    const params = { search: term };
    if (location.lat && location.lng) {
      params.lat = location.lat;
      params.lng = location.lng;
    }
    fetchSalons(params);
  };

  const handleLocateMe = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        fetchSalons({ lat: latitude, lng: longitude });
      },
      () => setLocationError('Could not get location')
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-6 md:pb-8 overflow-hidden">

      {/* Layers */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-50 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/src/assets/images/herosvg.png')" }}
      />
      <div className="absolute inset-0 z-10 opacity-50 pointer-events-none flex items-center justify-center">
        <AnimatedClipSVG />
      </div>
      <div className="absolute top-5 left-5 w-16 h-16 md:w-32 md:h-32 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl opacity-20 animate-pulse z-20" />
      <div className="absolute bottom-5 right-5 w-20 h-20 md:w-40 md:h-40 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-20 animate-pulse z-20" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30">

        {/* Header Text */}
        <div className="text-center md:text-left mb-5 md:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/60 dark:bg-gray-800/60 border border-purple-200 dark:border-purple-700 backdrop-blur-md mb-3 mx-auto md:mx-0">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300 uppercase">
              Premium Experience
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 leading-tight tracking-tight">
            BOOK YOUR <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 filter drop-shadow-sm">
              DREAM SALON
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto md:mx-0 md:border-l-4 md:border-purple-500 md:pl-4">
            Please come at a time that <span className="text-purple-600 dark:text-purple-400 font-bold underline decoration-wavy decoration-purple-300"> suits you best.</span>
          </p>
        </div>

        {/* Search Box Container */}
        <div className="max-w-lg mx-auto md:mx-0">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-xl shadow-purple-900/10 p-3 md:p-5 border border-white/40 dark:border-gray-700">

            {/* Location */}
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-1.5 text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0" />
                <span className="truncate">{location.text}</span>
                {locationError && (
                  <span className="text-[10px] text-amber-500 ml-1">{locationError}</span>
                )}
              </div>
              <button
                onClick={handleLocateMe}
                title="Update location"
                className="flex-shrink-0 p-1 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition"
              >
                <Navigation className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-600 dark:text-purple-400" />
              </button>
            </div>

            {/* Search Input Group */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search salon..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-8 md:pl-10 pr-2 py-2 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap text-xs md:text-base disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEARCH'}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2 mt-3 md:mt-4">
              {['Nearby', 'Top Rated', 'Open Now'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs sm:text-sm rounded-md md:rounded-lg transition-colors font-medium border ${
                    activeFilter === filter
                      ? 'bg-purple-600 text-white border-purple-600 dark:bg-purple-500 dark:border-purple-500'
                      : 'bg-white/50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-purple-900/40 text-gray-600 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-300 border-gray-100 dark:border-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-3 md:mt-4 text-center md:text-left">
            <p className="text-gray-500 dark:text-gray-400 mb-1.5 font-medium text-[10px] md:text-sm">Trending Searches:</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
              {['Haircut', 'Beard Styling', 'Facial'].map((item) => (
                <span
                  key={item}
                  onClick={() => handleTrendingClick(item)}
                  className="px-2 py-0.5 md:px-3 md:py-1 bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] md:text-xs hover:bg-white hover:border-purple-300 cursor-pointer transition shadow-sm backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <TrendingNearYou
          onServiceSelect={(service) => console.log('Trending service selected:', service)}
        />

      </div>

      {/* Salon Results */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 mt-6">
        {loading && salons.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Finding salons near you...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {!loading && salons.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {salons.length} salon{salons.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {salons.map((salon) => (
                <div
                  key={salon._id}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="h-28 md:h-36 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative">
                    {salon.images && salon.images.length > 0 ? (
                      <img
                        src={salon.images[0]}
                        alt={salon.salonName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <MapPin className="w-8 h-8 md:w-12 md:h-12 text-purple-300 dark:text-purple-500 mx-auto" />
                        <p className="text-[10px] md:text-xs text-purple-400 mt-1 font-medium">{salon.salonName}</p>
                      </div>
                    )}
                    {salon.stats?.averageRating > 0 && (
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1 text-xs font-bold text-yellow-600">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {salon.stats.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4 space-y-2">
                    <h3 className="font-bold text-sm md:text-base text-gray-800 dark:text-white truncate">
                      {salon.salonName}
                    </h3>

                    <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {[
                        salon.address?.area,
                        salon.address?.city,
                        salon.address?.state,
                      ].filter(Boolean).join(', ')}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span>{salon.contact?.phone || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {salon.stats?.totalBookings > 0 && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {salon.stats.totalBookings} booking{salon.stats.totalBookings !== 1 ? 's' : ''}
                        </span>
                      )}
                      <button
                        onClick={() => onViewSalon?.(salon)}
                        className="ml-auto text-[11px] md:text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-0.5 transition"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && salons.length === 0 && !error && (
          <div className="text-center py-6 text-gray-400 dark:text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No salons found. Try searching or changing your location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHeroSection;
