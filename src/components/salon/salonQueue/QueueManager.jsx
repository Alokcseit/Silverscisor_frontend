import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Clock, Play, CheckCircle, AlertCircle, Users, Bell, Wifi, WifiOff, Power, XCircle, UserPlus, Timer } from 'lucide-react';
import { useQueue } from '../../../context/QueueContext';

const QueueManager = ({ salonId }) => {
  const { queue, currentServing, isConnected, startService, completeService, startQueue, closeQueue, walkIn, notifyDelay, joinSalon, leaveSalon } = useQueue();
  const [serviceStartTimes, setServiceStartTimes] = useState({});
  const [notifyingId, setNotifyingId] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInData, setWalkInData] = useState({ customerName: '', customerPhone: '', serviceName: '', serviceDuration: 30, servicePrice: 0 });
  const [walkInLoading, setWalkInLoading] = useState(false);

  useEffect(() => {
    if (salonId) {
      joinSalon(salonId);
      return () => leaveSalon();
    }
  }, [salonId, joinSalon, leaveSalon]);

  // Timer for current serving
  useEffect(() => {
    if (!currentServing?.actualStartTime) {
      setElapsed(0);
      return;
    }
    const start = new Date(currentServing.actualStartTime).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentServing?.actualStartTime, currentServing?._id]);

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartService = (bookingId) => {
    setServiceStartTimes((prev) => ({ ...prev, [bookingId]: new Date() }));
    startService(bookingId);
  };

  const handleCompleteService = (bookingId) => {
    completeService(bookingId);
    setServiceStartTimes((prev) => {
      const next = { ...prev };
      delete next[bookingId];
      return next;
    });
  };

  const handleWalkIn = async () => {
    if (!walkInData.serviceName || !walkInData.serviceDuration) return;
    setWalkInLoading(true);
    const result = await walkIn({ ...walkInData, salonId });
    setWalkInLoading(false);
    if (result) {
      setShowWalkInModal(false);
      setWalkInData({ customerName: '', customerPhone: '', serviceName: '', serviceDuration: 30, servicePrice: 0 });
    }
  };

  const getDelayColor = (delay) => {
    if (!delay || delay === 0) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (delay <= 10) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Connection Status */}
      <div className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg text-sm ${isConnected ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        {isConnected ? 'Live — connected' : 'Offline — refreshing...'}
      </div>

      {/* Start Queue (when no bookings are active) */}
      {queue.length === 0 && !currentServing && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 mb-6 shadow-xl text-center">
          <Power className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Start Today's Queue</h2>
          <p className="text-purple-100 mb-6">
            Press the button below to start today's queue. Customers will be notified.
          </p>
          <button
            onClick={startQueue}
            className="bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Today's Queue
          </button>
        </div>
      )}

      {/* Current Serving */}
      {currentServing && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm opacity-90 mb-1">Currently Serving</p>
                {currentServing.isWalkIn && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">WALK-IN</span>
                )}
                {currentServing.checkedIn && (
                  <span className="bg-blue-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">CHECKED IN</span>
                )}
              </div>
              <h3 className="text-2xl font-bold">{currentServing.customerName}</h3>
              <p className="text-sm opacity-90 mt-1">
                {currentServing.service?.name || 'Service'} — {currentServing.service?.estimatedDuration || '--'} min
                {currentServing.actualStartTime && (
                  <span className="ml-3 flex items-center gap-1 inline-flex">
                    <Timer className="w-4 h-4" />
                    {formatElapsed(elapsed)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => handleCompleteService(currentServing._id)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Complete
            </button>
          </div>
        </div>
      )}

      {/* Queue Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Live Queue ({queue.length})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWalkInModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Walk-in
          </button>
          {(queue.length > 0 || currentServing) && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to close the queue? All remaining bookings will be cancelled.')) {
                  closeQueue();
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
            >
              <XCircle className="w-4 h-4" />
              Close Queue
            </button>
          )}
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.map((booking, index) => (
          <div
            key={booking._id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 ${booking.isWalkIn ? 'border-yellow-500' : 'border-purple-500'}`}
          >
            <div className="flex items-start justify-between">
              {/* Customer Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        {booking.customerName}
                      </h3>
                      {booking.isWalkIn && (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded">WALK-IN</span>
                      )}
                      {booking.checkedIn && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded">HERE</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.service?.name || '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Scheduled</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.timeSlot || '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.service?.estimatedDuration || '--'} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delay</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${getDelayColor(booking.estimatedDelay)}`}>
                      <Clock className="w-3 h-3" />
                      {booking.estimatedDelay || 0} min
                    </span>
                  </div>
                </div>

                {/* New Arrival Time */}
                {booking.estimatedDelay > 0 && (
                  <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <span className="font-semibold">New arrival time: </span>
                        {formatTime(booking.newArrivalTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                {!currentServing && index === 0 && (
                  <button
                    onClick={() => handleStartService(booking._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                )}
                {booking.estimatedDelay > 5 && (
                  <button
                    onClick={async () => {
                      setNotifyingId(booking._id);
                      await notifyDelay(booking._id);
                      setNotifyingId((id) => id === booking._id ? null : id);
                    }}
                    disabled={notifyingId === booking._id}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                  >
                    <Bell className={`w-4 h-4 ${notifyingId === booking._id ? 'animate-pulse' : ''}`} />
                    {notifyingId === booking._id ? 'Sending...' : 'Notify'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {queue.length === 0 && !currentServing && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No customers in queue</p>
          </div>
        )}
      </div>

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !walkInLoading && setShowWalkInModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-2 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Add Walk-in Customer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Customer will be added to the end of the queue</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name (optional)</label>
                <input
                  type="text"
                  value={walkInData.customerName}
                  onChange={(e) => setWalkInData((p) => ({ ...p, customerName: e.target.value }))}
                  placeholder="Walk-in Customer"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={walkInData.customerPhone}
                  onChange={(e) => setWalkInData((p) => ({ ...p, customerPhone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={walkInData.serviceName}
                  onChange={(e) => setWalkInData((p) => ({ ...p, serviceName: e.target.value }))}
                  placeholder="Haircut"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    value={walkInData.serviceDuration}
                    onChange={(e) => setWalkInData((p) => ({ ...p, serviceDuration: parseInt(e.target.value) || 30 }))}
                    min={5}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={walkInData.servicePrice}
                    onChange={(e) => setWalkInData((p) => ({ ...p, servicePrice: parseInt(e.target.value) || 0 }))}
                    min={0}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowWalkInModal(false)}
                  disabled={walkInLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWalkIn}
                  disabled={walkInLoading || !walkInData.serviceName}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {walkInLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                  ) : 'Add to Queue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManager;
