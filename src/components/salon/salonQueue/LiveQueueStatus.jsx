// src/components/customer/LiveQueueStatus.jsx

import React, { useEffect, useState } from 'react';
import { Clock, Users, AlertCircle, CheckCircle, Bell } from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';

const LiveQueueStatus = ({ bookingId }) => {
  const { queue } = useQueue();
  const { user } = useAuth();
  const [myBooking, setMyBooking] = useState(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const booking = queue.find(b => b.id === bookingId);
    if (booking) {
      setMyBooking(booking);
      setPosition(queue.findIndex(b => b.id === bookingId) + 1);
    }
  }, [queue, bookingId]);

  if (!myBooking) return null;

  const getStatusColor = () => {
    if (myBooking.estimatedDelay === 0) return 'from-green-500 to-emerald-500';
    if (myBooking.estimatedDelay <= 10) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusIcon = () => {
    if (myBooking.estimatedDelay === 0) return <CheckCircle className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  const getStatusMessage = () => {
    if (myBooking.estimatedDelay === 0) return 'On Time!';
    if (myBooking.estimatedDelay <= 10) return `${myBooking.estimatedDelay} min delay`;
    return `${myBooking.estimatedDelay} min delay - Adjusted time sent`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      
      {/* Live Status Card */}
      <div className={`bg-gradient-to-r ${getStatusColor()} text-white rounded-2xl p-6 shadow-xl mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm opacity-90">Your Booking Status</p>
              <p className="text-2xl font-bold">{getStatusMessage()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Position</p>
            <p className="text-3xl font-bold">#{position}</p>
          </div>
        </div>

        {myBooking.estimatedDelay > 0 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm mb-1">New Arrival Time:</p>
            <p className="text-2xl font-bold">
              {myBooking.newArrivalTime?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs opacity-90 mt-2">
              💡 Come at this time to avoid waiting at the salon
            </p>
          </div>
        )}
      </div>

      {/* Queue Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Queue Information
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Scheduled Time:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Service:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.service.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{myBooking.service.estimatedDuration} min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Customers Ahead:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{position - 1}</span>
          </div>
        </div>

        {myBooking.estimatedDelay > 5 && (
          <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <Bell className="w-4 h-4" />
              <p className="text-sm">
                We'll send you a WhatsApp notification with the updated time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveQueueStatus;