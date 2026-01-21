// src/pages/SalonDashboardPage.jsx

import React, { useState } from 'react';
import SalonHeader from './SalonHeader';
import SalonStats from './SalonStats';
import SalonBookingsList from './SalonBookingsList';
import SalonSidebar from "./SalonSidebar"

const SalonDashboardPage = ({ userData, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'bookings', 'services', 'settings'
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop Only */}
      <SalonSidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <SalonHeader userData={userData} onLogout={onLogout} />
        
        {/* Stats Dashboard */}
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">सेवाएं प्रबंधन</h2>
            <p className="text-gray-600">यहाँ सेवाएं add/edit करें (Coming Soon)</p>
          </div>
        )}
        
        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">सेटिंग्स</h2>
            <p className="text-gray-600">सैलून की सेटिंग्स (Coming Soon)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonDashboardPage;