// src/components/salon/SalonHeader.jsx

import React, { useState } from 'react';
import { Scissors, Bell, LogOut, Settings, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const SalonHeader = () => {
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    success('सफलतापूर्वक लॉगआउट हो गए!');
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Silverscisor Admin</h1>
              {user && (
                <p className="text-xs md:text-sm opacity-90">
                  नमस्ते, {user.name}
                </p>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="hidden md:block font-medium">{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                    {/* Salon Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Silverscisor Salon</p>
                          <p className="text-xs text-gray-500">Salon Owner</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{user?.phone}</p>
                    </div>

                    {/* Stats */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-green-600">156</p>
                          <p className="text-xs text-gray-500">Bookings</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-600">₹45K</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-600">4.8★</p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 text-gray-700">
                      <User className="w-5 h-5" />
                      <span>सैलून प्रोफाइल</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 text-gray-700">
                      <Settings className="w-5 h-5" />
                      <span>सेटिंग्स</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-3 text-red-600 font-semibold"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>लॉगआउट</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonHeader;