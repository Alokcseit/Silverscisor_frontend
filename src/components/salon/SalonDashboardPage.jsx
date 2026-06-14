// src/pages/SalonDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import SalonHeader from '../salon/SalonHeader';
import SalonStats from '../salon/SalonStats';
import SalonBookingsList from '../salon/SalonBookingsList';
import SalonBottomNav from '../salon/SalonBottomNav';
import axios from 'axios';

import { Users, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QueueManager from './salonQueue/QueueManager';
import SalonServiceManagement from './services/SalonServiceManagement';
import PricingPage from '../subscription/PricingPage';
import TokenWallet from '../subscription/TokenWallet';
import TokenRechargeModal from '../subscription/TokenRechargeModal';

const SALON_API = import.meta.env.VITE_SALON_API_URL;

const SalonDashboardPage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [salonId, setSalonId] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('silverscissor_token');
    if (!token) return;
    axios.post(`${SALON_API}/api/salon/profile`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.data?.data?._id) {
        setSalonId(res.data.data._id);
      }
    }).catch(() => {});
  }, []);

  const handleCompleteBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'completed' } : booking
    ));
  };

  const handleCancelBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
      {/* Header */}
      <SalonHeader />
      
      {/* Main Content Area */}
      <div className="w-full">
        
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            <SalonStats bookings={bookings} />
            <SalonBookingsList />
          </>
        )}
        
        {/* Bookings View */}
        {currentView === 'bookings' && (
          <SalonBookingsList />
        )}
        
        {/* Services View */}
        {currentView === 'services' && (
          <SalonServiceManagement />
        )}
        
        {/* Customers View */}
        {currentView === 'customers' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Customer Management</h2>
              <p className="text-gray-600 dark:text-gray-400">View and manage your customers (Coming Soon)</p>
            </div>
          </div>
        )}
        
        {/* Earnings View */}
        {currentView === 'earnings' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <DollarSign className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Earnings & Reports</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your revenue and reports (Coming Soon)</p>
            </div>
          </div>
        )}
        
        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <SettingsIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Salon Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure your salon settings (Coming Soon)</p>
            </div>
          </div>
        )}

        {currentView === 'queue' && (
          <QueueManager salonId={salonId} />
        )}
        {currentView === 'subscription' && (
         <PricingPage />
        )}

        {currentView === 'wallet' && (
       <TokenWallet onRecharge={() => setShowRechargeModal(true)} />
        )}
      </div>

      {/* Bottom Navigation */}
      <SalonBottomNav currentView={currentView} setCurrentView={setCurrentView} />
      <TokenRechargeModal
       isOpen={showRechargeModal}
       onClose={() => setShowRechargeModal(false)}
      />
    </div>
  );
};

export default SalonDashboardPage;