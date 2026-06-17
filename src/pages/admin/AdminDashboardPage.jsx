// src/pages/admin/AdminDashboardPage.jsx

import React, { useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import OverviewCards from '../../components/admin/dashboard/OverviewCards';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';
import SalonTable from '../../components/admin/salons/SalonTable';
import ApplicationsList from '../../components/admin/salons/ApplicationsList';
import UserTable from '../../components/admin/users/UserTable';
import SubscriptionTable from '../../components/admin/subscriptions/SubscriptionTable';
import CatalogServiceManagement from '../../components/admin/services/CatalogServiceManagement';
import ContentSectionManager from '../../components/admin/services/ContentSectionManager';
import HealthStatus from '../../components/admin/system/HealthStatus';
import SystemLogs from '../../components/admin/system/SystemLogs';

const AdminDashboardPage = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <OverviewCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <RecentActivity />
            </div>
          </div>
        );
      case 'salons':       return <SalonTable />;
      case 'applications': return <ApplicationsList />;
      case 'users':        return <UserTable />;
      case 'subscriptions':return <SubscriptionTable />;
      case 'services':     return <CatalogServiceManagement />;
      case 'content':      return <ContentSectionManager />;
      case 'health':       return <HealthStatus />;
      case 'logs':         return <SystemLogs />;
      default:             return <OverviewCards />;
    }
  };

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AdminLayout>
  );
};

export default AdminDashboardPage;