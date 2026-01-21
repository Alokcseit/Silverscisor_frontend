// src/pages/CustomerHomePage.jsx

import React, { useState } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerHeroSection from './CustomerHeroSection';
import ServiceSelection from './ServiceSelection';
import BookingForm from './BookingForm';
import ConfirmationModal from './ConfirmationModal';
import CustomerBottomNav from './CustomerBottomNav';
import CustomerBookingHistory from './CustomerBookingHistory';

const CustomerHomePage = ({ userData, onLogout }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'bookings'
  
  // All user bookings
  const [userBookings, setUserBookings] = useState([
    {
      id: 1001,
      customerName: userData?.name || 'राहुल कुमार',
      customerPhone: userData?.phone || '+91 98765 43210',
      service: { name: 'Haircut', duration: '30 मिनट', price: 200 },
      time: '11:00 AM',
      date: '2026-01-20',
      status: 'completed'
    },
    {
      id: 1002,
      customerName: userData?.name || 'राहुल कुमार',
      customerPhone: userData?.phone || '+91 98765 43210',
      service: { name: 'Haircut + Beard', duration: '45 मिनट', price: 250 },
      time: '02:00 PM',
      date: '2026-01-25',
      status: 'confirmed'
    }
  ]);

  // Add new booking
  const handleNewBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      status: 'confirmed',
      customerName: userData?.name,
      customerPhone: userData?.phone
    };
    setUserBookings([...userBookings, newBooking]);
    setBookingDetails(newBooking);
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <CustomerHeader 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userData={userData}
        onLogout={onLogout}
      />
      
      {/* Home View */}
      {currentView === 'home' && (
        <>
          <CustomerHeroSection />
          <ServiceSelection 
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            setShowBookingForm={setShowBookingForm}
          />
          {showBookingForm && (
            <BookingForm 
              selectedService={selectedService}
              setShowConfirmation={setShowConfirmation}
              setBookingDetails={handleNewBooking}
              setShowBookingForm={setShowBookingForm}
            />
          )}
        </>
      )}
      
      {/* Bookings History View */}
      {currentView === 'bookings' && (
        <CustomerBookingHistory bookings={userBookings} />
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal 
          bookingDetails={bookingDetails}
          setShowConfirmation={setShowConfirmation}
        />
      )}
      
      {/* Bottom Navigation */}
      <CustomerBottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default CustomerHomePage;