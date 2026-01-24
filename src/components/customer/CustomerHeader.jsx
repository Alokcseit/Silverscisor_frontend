// src/components/customer/CustomerHeader.jsx

import React, { useState } from 'react';
import { Scissors, Bell, User, LogOut, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import AnimatedScissors from "../../util/AnimatedScissors.jsx";
import AnimatedScissorsIcon from '../../util/AnimatedScissorsIcon.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const CustomerHeader = ({ currentView, setCurrentView }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    success('सफलतापूर्वक लॉगआउट हो गए!');
    setShowMenu(false); // Logout ke baad menu band karein
  };

  return (
<div className="relative bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-white sticky top-0 z-40 shadow-xl shadow-rose-500/20 dark:shadow-slate-900/50">  
      
  <AnimatedScissors />

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <AnimatedScissorsIcon size={32} color="white" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Silverscisor</h1>
              {/* Desktop Only Greeting */}
              {user && (
                <p className="text-xs md:text-sm opacity-90 hidden md:block">
                  Namaste, {user.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-amber-400 hover:bg-white/10 transition"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown - Change 2: Hidden on Mobile (hidden md:block) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-white/30 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium">{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Desktop Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <span>प्रोफाइल देखें</span>
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span>सेटिंग्स</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition flex items-center gap-3 text-red-600 dark:text-red-400 font-medium"
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
              className="md:hidden p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Expanded */}
        {showMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 dark:border-gray-700 space-y-2 animate-fadeIn">
            
            {/* Change 3: Added User Info section inside Mobile Menu */}
            <div className="bg-white/10 dark:bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="font-bold">Namaste, {user?.name}</p>
                        <p className="text-xs opacity-80">{user?.email}</p>
                    </div>
                </div>
            </div>

            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition flex items-center gap-3">
              <User className="w-5 h-5" />
              प्रोफाइल देखें
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition flex items-center gap-3">
              <Settings className="w-5 h-5" />
              सेटिंग्स
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg bg-red-500/20 dark:bg-red-500/10 hover:bg-red-500/30 dark:hover:bg-red-500/20 transition flex items-center gap-3 text-red-100 font-medium"
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