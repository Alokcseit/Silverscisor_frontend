// src/components/salon/QueueManager.jsx

import React, { useState } from 'react';
import { Clock, Play, CheckCircle, AlertCircle, Users, Bell } from 'lucide-react';
import { useQueue } from '../../../context/QueueContext';

const QueueManager = () => {
  const { queue, currentServing, startService, completeService } = useQueue();
  const [serviceStartTime, setServiceStartTime] = useState(null);

  const handleStartService = (booking) => {
    setServiceStartTime(new Date());
    startService(booking.id);
  };

  const handleCompleteService = (booking) => {
    if (serviceStartTime) {
      const actualDuration = Math.round((new Date() - serviceStartTime) / 60000);
      completeService(booking.id, actualDuration);
      setServiceStartTime(null);
    }
  };

  const getDelayColor = (delay) => {
    if (delay === 0) return 'text-green-600 bg-green-100';
    if (delay <= 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Current Customer */}
      {currentServing && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Currently Serving</p>
              <h3 className="text-2xl font-bold">{currentServing.customerName}</h3>
              <p className="text-sm opacity-90 mt-1">{currentServing.service.name} - {currentServing.service.estimatedDuration} min</p>
            </div>
            <button
              onClick={() => handleCompleteService(currentServing)}
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
        <button className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition">
          <Bell className="w-4 h-4" />
          Notify All
        </button>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.map((booking, index) => (
          <div
            key={booking.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-start justify-between">
              
              {/* Customer Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                      {booking.customerName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.service.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Scheduled</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {booking.service.estimatedDuration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delay</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${getDelayColor(booking.estimatedDelay || 0)}`}>
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
                        {booking.newArrivalTime?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                {!currentServing && index === 0 && (
                  <button
                    onClick={() => handleStartService(booking)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                )}
                {booking.estimatedDelay > 5 && (
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 whitespace-nowrap">
                    <Bell className="w-4 h-4" />
                    Notify
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No customers in queue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueManager;