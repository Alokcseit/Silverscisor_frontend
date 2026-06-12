// src/components/admin/layout/AdminLayout.jsx

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, currentView, onViewChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const qc = useQueryClient();

  const handleRefresh = () => {
    qc.invalidateQueries(['admin']);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onViewChange={onViewChange}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader currentView={currentView} onRefresh={handleRefresh} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;