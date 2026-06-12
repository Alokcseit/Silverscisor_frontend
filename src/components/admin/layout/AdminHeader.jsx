// src/components/admin/layout/AdminHeader.jsx

import React from 'react';
import { RefreshCw, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSystemHealth } from '../../../hooks/useAdmin';

const VIEW_TITLES = {
  dashboard:     'Dashboard',
  salons:        'Salon Management',
  applications:  'Pending Applications',
  users:         'User Management',
  subscriptions: 'Subscriptions',
  health:        'System Health',
  logs:          'System Logs'
};

const AdminHeader = ({ currentView, onRefresh }) => {
  const { admin } = useSelector(state => state.admin);
  const { data: health } = useSystemHealth();

  const overallStatus = health?.overall || 'unknown';

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">{VIEW_TITLES[currentView] || 'Admin'}</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
          overallStatus === 'healthy'
            ? 'bg-green-900/30 text-green-400'
            : overallStatus === 'degraded'
            ? 'bg-yellow-900/30 text-yellow-400'
            : 'bg-gray-700 text-gray-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            overallStatus === 'healthy' ? 'bg-green-400' :
            overallStatus === 'degraded' ? 'bg-yellow-400' : 'bg-gray-400'
          }`} />
          {overallStatus === 'healthy' ? 'All Systems OK' :
           overallStatus === 'degraded' ? 'Degraded' : 'Checking...'}
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;