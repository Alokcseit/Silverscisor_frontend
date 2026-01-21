// src/components/customer/CustomerHeader.jsx

import React, { useState } from 'react';
import { Scissors, Bell, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';

const CustomerHeader = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    success('सफलतापूर्वक लॉगआउट हो गए!');
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Silverscisor</h1>
              {user && (
                <p className="text-xs md:text-sm opacity-90 hidden md:block">
                  नमस्ते, {user.name}
                </p>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`font-medium px-4 py-2 rounded-lg transition ${
                currentView === 'home' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              होम
            </button>
            <button
              onClick={() => setCurrentView('bookings')}
              className={`font-medium px-4 py-2 rounded-lg transition ${
                currentView === 'bookings' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              मेरी बुकिंग
            </button>
          </div>

          {/* Right Side Icons */}
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
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{user?.phone}</p>
                    </div>

                    {/* Menu Items */}
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 text-gray-700">
                      <User className="w-5 h-5" />
                      <span>प्रोफाइल देखें</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 text-gray-700">
                      <Settings className="w-5 h-5" />
                      <span>सेटिंग्स</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-3 text-red-600 font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>लॉगआउट</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setShowMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                currentView === 'home' 
                  ? 'bg-white/20' 
                  : 'hover:bg-white/10'
              }`}
            >
              होम
            </button>
            <button
              onClick={() => {
                setCurrentView('bookings');
                setShowMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                currentView === 'bookings' 
                  ? 'bg-white/20' 
                  : 'hover:bg-white/10'
              }`}
            >
              मेरी बुकिंग
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition flex items-center gap-3">
              <User className="w-5 h-5" />
              प्रोफाइल
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition flex items-center gap-3">
              <Settings className="w-5 h-5" />
              सेटिंग्स
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition flex items-center gap-3 text-red-100 font-medium"
            >
              <LogOut className="w-5 h-5" />
              लॉगआउट
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;