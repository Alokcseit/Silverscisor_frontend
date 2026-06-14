import React, { useEffect, useState } from 'react';
import { Clock, Users, AlertCircle, CheckCircle, Bell, MapPin } from 'lucide-react';
import { useQueue } from '../../../context/QueueContext';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const LiveQueueStatus = ({ bookingId, salonId }) => {
  const { queue, currentServing, joinSalon, leaveSalon } = useQueue();
  const [myBooking, setMyBooking] = useState(null);
  const [position, setPosition] = useState(0);
  const [checkingIn, setCheckingIn] = useState(false);

  const token = localStorage.getItem('silverscissor_token');

  useEffect(() => {
    if (salonId) {
      joinSalon(salonId);
      return () => leaveSalon();
    }
  }, [salonId, joinSalon, leaveSalon]);

  useEffect(() => {
    const all = currentServing ? [currentServing, ...queue] : queue;
    const idx = all.findIndex((b) => b._id === bookingId);
    if (idx !== -1) {
      setMyBooking(all[idx]);
      setPosition(idx + 1);
    }
  }, [queue, currentServing, bookingId]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await fetch(`${SALON_API}/api/queue/${bookingId}/checkin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
    } catch {}
    setCheckingIn(false);
  };

  if (!myBooking) return null;

  const hasDelay = myBooking.estimatedDelay > 0;

  const getStatusColor = () => {
    if (!hasDelay) return 'from-green-500 to-emerald-500';
    if (myBooking.estimatedDelay <= 10) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusIcon = () => {
    if (!hasDelay) return <CheckCircle className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  const getStatusMessage = () => {
    if (!hasDelay) return 'समय पर ✅';
    if (myBooking.estimatedDelay <= 10) return `${myBooking.estimatedDelay} मिनट की देरी`;
    return `${myBooking.estimatedDelay} मिनट की देरी — नया समय भेजा गया`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Live Status Card */}
      <div className={`bg-gradient-to-r ${getStatusColor()} text-white rounded-2xl p-6 shadow-xl mb-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm opacity-90">आपकी बुकिंग स्टेटस</p>
              <p className="text-xl md:text-2xl font-bold">{getStatusMessage()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">पोजीशन</p>
            <p className="text-3xl font-bold">#{position}</p>
          </div>
        </div>

        {hasDelay && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm mb-1">नया आने का समय:</p>
            <p className="text-2xl font-bold">
              {formatTime(myBooking.newArrivalTime)}
            </p>
            <p className="text-xs opacity-90 mt-2">
              कृपया इस समय पर आएं — सैलून पर इंतज़ार नहीं करना पड़ेगा
            </p>
          </div>
        )}
      </div>

      {/* Queue Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          क्यू विवरण
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">निर्धारित समय</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.timeSlot || '--'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">सर्विस</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.service?.name || '--'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">अवधि</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.service?.estimatedDuration || '--'} मिनट</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">आपसे पहले ग्राहक</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{position - 1}</span>
          </div>
          {hasDelay && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-400">अनुमानित देरी</span>
              <span className="font-semibold text-red-600 dark:text-red-400">{myBooking.estimatedDelay} मिनट</span>
            </div>
          )}
        </div>

        {/* Check-in Button */}
        {!myBooking.checkedIn && (
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            {checkingIn ? 'Checking in...' : 'I\'m at the Salon — Check In'}
          </button>
        )}

        {myBooking.checkedIn && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-semibold">आपने check-in कर लिया है ✓</p>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">सैलून को आपकी उपस्थिति की सूचना दे दी गई है</p>
          </div>
        )}

        {hasDelay && (
          <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3 text-purple-800 dark:text-purple-200">
              <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold mb-1">नया समय अपडेट</p>
                <p className="text-xs opacity-80">
                  {formatTime(myBooking.newArrivalTime)} तक आ जाएं — आपकी बारी तब तक नहीं आएगी
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">आपकी यात्रा</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">बुकिंग कन्फर्म</p>
              <p className="text-xs text-gray-500">{myBooking.timeSlot} पर निर्धारित</p>
            </div>
          </div>
          {myBooking.checkedIn && (
            <div className="ml-1.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600 pl-5">
              <div className="flex items-center gap-3 py-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">सैलून पहुंच गए</p>
                  <p className="text-xs text-gray-500">Check-in कर लिया गया</p>
                </div>
              </div>
            </div>
          )}
          <div className="ml-1.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600 pl-5">
            {hasDelay ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">समय में बदलाव</p>
                  <p className="text-xs text-gray-500">{formatTime(myBooking.newArrivalTime)} — नया आने का समय</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">इंतज़ार में</p>
                  <p className="text-xs text-gray-500">आपकी बारी का इंतज़ार है</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">सर्विस शुरू</p>
              <p className="text-xs text-gray-500">जब आपकी बारी आएगी</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQueueStatus;
