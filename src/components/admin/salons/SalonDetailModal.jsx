// src/components/admin/salons/SalonDetailModal.jsx

import React from 'react';
import { X, MapPin, Phone, Mail, Star, Calendar } from 'lucide-react';

const SalonDetailModal = ({ salon, onClose }) => {
  if (!salon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{salon.salonName}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Plan</p>
              <p className="text-white font-semibold capitalize">{salon.subscription?.plan || 'free'}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Token Balance</p>
              <p className="text-white font-semibold">{salon.subscription?.tokenBalance || 0}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Total Bookings</p>
              <p className="text-white font-semibold">{salon.stats?.totalBookings || 0}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
              <p className="text-white font-semibold">₹{(salon.stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            {salon.contact?.phone && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                {salon.contact.phone}
              </div>
            )}
            {salon.contact?.email && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                {salon.contact.email}
              </div>
            )}
            {salon.address?.city && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                {salon.address.area}, {salon.address.city}, {salon.address.state}
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              Joined: {new Date(salon.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDetailModal;