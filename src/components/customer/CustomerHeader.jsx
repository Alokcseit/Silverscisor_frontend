// src/components/customer/CustomerHeader.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Menu, X, Sun, Moon, Check, X as XIcon, Clock, Calendar, Scissors } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import AnimatedScissors from "../../util/AnimatedScissors.jsx";
import AnimatedScissorsIcon from '../../util/AnimatedScissorsIcon.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import CustomerProfileModal from './CustomerProfileModal.jsx';
import axios from 'axios';

const SALON_API = import.meta.env.VITE_SALON_API_URL;

const CustomerHeader = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('silverscissor_token');
      const res = await axios.get(`${SALON_API}/notifications/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('silverscissor_token');
      await axios.put(`${SALON_API}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark read error:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('silverscissor_token');
      await axios.put(`${SALON_API}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read error:', err.message);
    }
  };

  const handleLogout = () => {
    logout();
    success('Successfully logged out!');
    setShowMenu(false);
    navigate('/auth');
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setShowProfileDropdown(false);
    setShowMenu(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking_confirmed': return <Check className="w-4 h-4 text-green-500" />;
      case 'booking_rejected': return <XIcon className="w-4 h-4 text-red-500" />;
      case 'booking_completed': return <Scissors className="w-4 h-4 text-purple-500" />;
      case 'booking_cancelled': return <XIcon className="w-4 h-4 text-orange-500" />;
      case 'booking_reminder': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'अभी';
    if (mins < 60) return `${mins} मिनट पहले`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} घंटे पहले`;
    const days = Math.floor(hours / 24);
    return `${days} दिन पहले`;
  };

  return (
    <>
      <div className="relative bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-white sticky top-0 z-40 shadow-xl shadow-rose-500/20 dark:shadow-slate-900/50">  
        
        <AnimatedScissors />

        <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <AnimatedScissorsIcon size={32} color="white" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Silverscisor</h1>
                {user && (
                  <p className="text-xs md:text-sm opacity-90 hidden md:block">
                    Namaste, {user.username}
                  </p>
                )}
                {user && (
                  <p className="text-xs md:text-sm opacity-90 md:hidden">
                    Namaste, {user.username}
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
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 border-2 border-rose-500 dark:border-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 max-sm:max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white max-h-[70vh] flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          सभी पढ़े हुए मार्क करें
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">कोई नोटिफिकेशन नहीं</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer border-b border-gray-50 dark:border-gray-700/50 ${
                              !notif.isRead ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''
                            }`}
                            onClick={() => {
                              if (!notif.isRead) markAsRead(notif._id);
                            }}
                          >
                            <div className="mt-1 flex-shrink-0">
                              {getNotifIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                {timeAgo(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown - Desktop */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-white/30 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
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
                    <div className="absolute right-0 mt-2 w-64 max-sm:max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      
                      <button 
                        onClick={openProfileModal}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3"
                      >
                        <User className="w-5 h-5" />
                        <span>View Profile</span>
                      </button>

                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition flex items-center gap-3 text-red-600 dark:text-red-400 font-medium"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
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
              
              {/* User Info section */}
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

              <button 
                onClick={openProfileModal}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                Profile
              </button>

              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition flex items-center gap-3">
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg bg-red-500/20 dark:bg-red-500/10 hover:bg-red-500/30 dark:hover:bg-red-500/20 transition flex items-center gap-3 text-red-100 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <CustomerProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default CustomerHeader;