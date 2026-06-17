// src/components/admin/layout/AdminSidebar.jsx

import React from 'react';
import {
  LayoutDashboard, Store, Users, CreditCard,
  Activity, LogOut, Shield, ChevronLeft, ChevronRight, Scissors, FileText
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../../../store/adminSlice';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard, color: 'text-indigo-400' },
  { id: 'salons',         label: 'Salons',          icon: Store,           color: 'text-emerald-400' },
  { id: 'applications',   label: 'Applications',    icon: Store,           color: 'text-amber-400',  badge: true },
  { id: 'users',          label: 'Users',           icon: Users,           color: 'text-blue-400' },
  { id: 'subscriptions',  label: 'Subscriptions',   icon: CreditCard,      color: 'text-purple-400' },
  { id: 'services',       label: 'Services',        icon: Scissors,        color: 'text-pink-400' },
  { id: 'content',        label: 'Content',         icon: FileText,        color: 'text-yellow-400' },
  { id: 'health',         label: 'System Health',   icon: Activity,        color: 'text-green-400' },
  { id: 'logs',           label: 'System Logs',     icon: Activity,        color: 'text-gray-400' },
];

const AdminSidebar = ({ currentView, onViewChange, collapsed, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector(state => state.admin);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  return (
    <div className={`relative bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm">Silverscisor</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : item.color}`} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        {!collapsed && admin && (
          <div className="px-3 py-2 bg-gray-700/50 rounded-xl">
            <p className="text-white text-sm font-medium truncate">{admin.username}</p>
            <p className="text-gray-400 text-xs capitalize">{admin.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-900/20 rounded-xl transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;