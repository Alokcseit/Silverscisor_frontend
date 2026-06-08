// src/components/customer/CustomerHomePage.jsx

import React, { useState } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerHeroSection from './CustomerHeroSection';
import ServiceSelection from './ServiceSelection';
import BookingForm from './BookingForm';
import ConfirmationModal from './ConfirmationModal';
import CustomerBottomNav from './CustomerBottomNav';
import CustomerBookingHistory from './CustomerBookingHistory';
import RecommendedServices from './recommendations/RecommendedServices';
import PersonalizedSuggestions from './recommendations/PersonalizedSuggestions';
import AIStyleButton from './recommendations/AIStyleButton';
import FaceAnalysisModal from './recommendations/FaceAnalysisModal';
import AIRecommendationResult from './recommendations/AIRecommendationResult';

const CustomerHomePage = ({ userData, onLogout }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  // AI Analysis states
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiCapturedImage, setAiCapturedImage] = useState(null);

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

  // Service select handler
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  // AI analysis complete
  const handleAnalysisComplete = (result, image) => {
    setAiResult(result);
    setAiCapturedImage(image);
    setShowFaceModal(false);
  };

  // AI result close
  const handleAiResultClose = () => {
    setAiResult(null);
    setAiCapturedImage(null);
  };

  // New booking
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">

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
          {/* Hero Section */}
          <CustomerHeroSection />

          {/* AI Style Recommendation Button */}
          <AIStyleButton onClick={() => setShowFaceModal(true)} />

          {/* AI Result (photo analyze hone ke baad) */}
          {aiResult && (
            <AIRecommendationResult
              result={aiResult}
              capturedImage={aiCapturedImage}
              onServiceSelect={handleServiceSelect}
              onClose={handleAiResultClose}
            />
          )}

          {/* Personalized Suggestions */}
          <PersonalizedSuggestions
            onServiceSelect={handleServiceSelect}
          />

          {/* Recommended Services */}
          <RecommendedServices
            onServiceSelect={handleServiceSelect}
          />

          {/* All Services */}
          <ServiceSelection
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            setShowBookingForm={setShowBookingForm}
          />

          {/* Booking Form */}
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
      <CustomerBottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Face Analysis Modal */}
      <FaceAnalysisModal
        isOpen={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
};

export default CustomerHomePage;