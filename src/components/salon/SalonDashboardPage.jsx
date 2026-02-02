// src/pages/SalonDashboardPage.jsx

import React, { useState } from 'react';
import SalonHeader from '../salon/SalonHeader';
import SalonStats from '../salon/SalonStats';
import SalonBookingsList from '../salon/SalonBookingsList';
import SalonBottomNav from '../salon/SalonBottomNav';

import { Users, Scissors, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QueueManager from './salonQueue/QueueManager';

const SalonDashboardPage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'राहुल कुमार',
      phone: '+91 98765 43210',
      service: 'Haircut + Beard',
      time: '11:00 AM',
      duration: '45 मिनट',
      price: 250,
      status: 'confirmed',
      date: '2026-01-25'
    },
    {
      id: 2,
      customerName: 'प्रिया शर्मा',
      phone: '+91 98765 43211',
      service: 'Facial',
      time: '02:00 PM',
      duration: '45 मिनट',
      price: 500,
      status: 'pending',
      date: '2026-01-25'
    },
    {
      id: 3,
      customerName: 'अमित वर्मा',
      phone: '+91 98765 43212',
      service: 'Hair Color',
      time: '04:00 PM',
      duration: '60 मिनट',
      price: 800,
      status: 'confirmed',
      date: '2026-01-25'
    }
  ]);

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
            <SalonBookingsList 
              bookings={bookings}
              handleCompleteBooking={handleCompleteBooking}
              handleCancelBooking={handleCancelBooking}
            />
          </>
        )}
        
        {/* Bookings View */}
        {currentView === 'bookings' && (
          <SalonBookingsList 
            bookings={bookings}
            handleCompleteBooking={handleCompleteBooking}
            handleCancelBooking={handleCancelBooking}
          />
        )}
        
        {/* Services View */}
        {currentView === 'services' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <Scissors className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Services Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Add and manage your salon services (Coming Soon)</p>
            </div>
          </div>
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
          <QueueManager />
        )}
      </div>

      {/* Bottom Navigation */}
      <SalonBottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default SalonDashboardPage;