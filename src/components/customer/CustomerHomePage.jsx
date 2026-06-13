// src/components/customer/CustomerHomePage.jsx

import React, { useState, useEffect } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerHeroSection from './CustomerHeroSection';
import SalonDetailView from './SalonDetailView';
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
import { X, Sparkles, CheckCircle, MapPin, Clock, Send } from 'lucide-react';

const CustomerHomePage = ({ userData, onLogout }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedSalon, setSelectedSalon] = useState(null);

  // AI Analysis states
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiCapturedImage, setAiCapturedImage] = useState(null);
  const [generatingAIPhotos, setGeneratingAIPhotos] = useState(false);

  // Service Request states
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [selectedAiService, setSelectedAiService] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestResult, setRequestResult] = useState(null);

  // Track active service requests
  const [myRequests, setMyRequests] = useState([]);

  const API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:5004/api';
  const BOOKING_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

  // Poll for request status updates
  useEffect(() => {
    if (myRequests.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/service-requests`);
        const json = await res.json();
        if (json.success) {
          setMyRequests(prev => prev.map(mr => {
            const found = json.data.find(d => d.id === mr.id);
            return found || mr;
          }));
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [myRequests.length]);

  // Service select handler
  const handleServiceSelect = (service) => {
    if (service.aiRecommended) {
      setSelectedAiService(service);
      setShowServiceRequest(true);
    } else {
      setSelectedService(service);
      setShowBookingForm(true);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  // AI analysis complete
  const handleAnalysisComplete = (result, image) => {
    setAiResult(result);
    setAiCapturedImage(image);
    setShowFaceModal(false);
  };

  // Generate AI photos for recommendations
  const handleGenerateAIPhotos = async () => {
    if (!aiResult || !aiCapturedImage) return;
    setGeneratingAIPhotos(true);
    try {
      const allStyles = [
        ...aiResult.recommendations.haircuts.map(s => ({ id: s.id, name: s.name, type: 'haircuts' })),
        ...aiResult.recommendations.beardStyles.map(s => ({ id: s.id, name: s.name, type: 'beardStyles' })),
        ...aiResult.recommendations.hairColors.map(s => ({ id: s.id, name: s.name, type: 'hairColors' })),
      ];

      const res = await fetch(`${API_URL}/generate-style-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: aiCapturedImage, styles: allStyles }),
      });
      const json = await res.json();
      if (json.success && json.images) {
        setAiResult(prev => {
          if (!prev) return prev;
          const next = { ...prev };
          next.recommendations = { ...prev.recommendations };
          for (const img of json.images) {
            if (!img.image_url) continue;
            const list = next.recommendations[img.type];
            if (list) {
              next.recommendations[img.type] = list.map(item =>
                item.id === img.id ? { ...item, image: img.image_url } : item
              );
            }
          }
          return next;
        });
      }
    } catch (err) {
      console.error('AI Photo generation failed:', err);
    }
    setGeneratingAIPhotos(false);
  };

  // AI result close
  const handleAiResultClose = () => {
    setAiResult(null);
    setAiCapturedImage(null);
  };

  const token = localStorage.getItem('silverscissor_token');

  const fetchMyBookings = async () => {
    try {
      await fetch(`${BOOKING_API}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  };

  // New booking
  const handleNewBooking = (booking) => {
    setBookingDetails(booking);
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
  };

  // Send service request to nearby salons
  const handleSendServiceRequest = async () => {
    setSendingRequest(true);
    setRequestResult(null);
    try {
      const res = await fetch(`${API_URL}/service-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: userData?.name || 'Customer',
          customer_phone: userData?.phone || '',
          service_type: selectedAiService.type,
          service_id: selectedAiService.id,
          service_name: selectedAiService.name,
          service_price: selectedAiService.price,
          service_duration: selectedAiService.duration || '30 min',
          face_shape: aiResult?.faceShape || '',
          skin_tone: aiResult?.skinTone || '',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRequestResult({ type: 'success', data: json.data, message: json.message });
        setMyRequests(prev => [json.data, ...prev]);
      } else {
        setRequestResult({ type: 'error', message: 'Failed to create request' });
      }
    } catch (err) {
      setRequestResult({ type: 'error', message: 'Network error. Please try again.' });
    }
    setSendingRequest(false);
  };

  // Salon detail view
  const handleViewSalon = (salon) => {
    setSelectedSalon(salon);
    setSelectedService(null);
    setShowBookingForm(false);
  };

  const handleBookServiceFromSalon = (salon, service) => {
    setSelectedSalon(salon);
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleBackFromSalon = () => {
    setSelectedSalon(null);
    setSelectedService(null);
    setShowBookingForm(false);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'accepted': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'scheduled': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'pending': return '⏳ Looking for Salon';
      case 'accepted': return '✓ Salon Accepted';
      case 'scheduled': return '✅ Appointment Scheduled';
      default: return status;
    }
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

      {/* Salon Detail View */}
      {selectedSalon && (
        <>
          <SalonDetailView
            salon={selectedSalon}
            userData={userData}
            onBack={handleBackFromSalon}
            onBookService={handleBookServiceFromSalon}
          />
          {showBookingForm && (
            <BookingForm
              selectedService={selectedService}
              salon={selectedSalon}
              userData={userData}
              setShowConfirmation={setShowConfirmation}
              setBookingDetails={handleNewBooking}
              setShowBookingForm={setShowBookingForm}
            />
          )}
        </>
      )}

      {/* Home View */}
      {currentView === 'home' && !selectedSalon && (
        <>
          <CustomerHeroSection onViewSalon={handleViewSalon} />

          {/* Active Service Requests Banner */}
          {myRequests.filter(r => r.status !== 'cancelled').length > 0 && (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 space-y-2">
              {myRequests.filter(r => r.status !== 'cancelled').map(req => (
                <div
                  key={req.id}
                  className={`rounded-xl p-3 sm:p-4 border ${
                    req.status === 'scheduled'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : req.status === 'accepted'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                        {req.service_name}
                      </p>
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${statusColor(req.status)}`}>
                        {statusLabel(req.status)}
                      </span>
                      {req.accepted_by && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Accepted by: {req.accepted_by.salon_name}
                        </p>
                      )}
                      {req.scheduled_date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Scheduled: {req.scheduled_date} at {req.scheduled_time}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {req.status === 'pending' && (
                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {req.status === 'scheduled' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {req.status === 'accepted' && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Style Recommendation Button */}
          <AIStyleButton onClick={() => setShowFaceModal(true)} />

          {/* AI Result */}
          {aiResult && (
            <AIRecommendationResult
              result={aiResult}
              capturedImage={aiCapturedImage}
              onServiceSelect={handleServiceSelect}
              onClose={handleAiResultClose}
              generating={generatingAIPhotos}
              onGenerateAIPhotos={handleGenerateAIPhotos}
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
        <CustomerBookingHistory onNavigateHome={handleNavigateHome} />
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

      {/* Service Request Modal */}
      {showServiceRequest && selectedAiService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { if (!sendingRequest) { setShowServiceRequest(false); setRequestResult(null); } }}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-2 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-5 h-5 text-white flex-shrink-0" />
                <h2 className="text-base font-bold text-white truncate">Book via AI Service</h2>
              </div>
              <button
                onClick={() => { setShowServiceRequest(false); setRequestResult(null); }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition text-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {!requestResult ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Service</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{selectedAiService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Price</span>
                      <span className="font-semibold text-rose-500">₹{selectedAiService.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Duration</span>
                      <span className="text-gray-700 dark:text-gray-300">{selectedAiService.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Face Shape</span>
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{aiResult?.faceShape || '—'}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> How it works:
                    </p>
                    <p>1. Request sent to all nearby salons</p>
                    <p>2. First salon to accept gets your request</p>
                    <p>3. Salon will book a time slot for you</p>
                    <p>4. You'll get a WhatsApp confirmation</p>
                  </div>

                  <button
                    onClick={handleSendServiceRequest}
                    disabled={sendingRequest}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition disabled:opacity-60"
                  >
                    {sendingRequest ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Request to Nearby Salons
                      </>
                    )}
                  </button>
                </div>
              ) : requestResult.type === 'success' ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">Request Sent!</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Nearby salons have been notified
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-mono">
                      Request ID: {requestResult.data.id.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-400">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Waiting for a salon to accept your request. You'll be notified when a salon responds.
                  </div>
                  <button
                    onClick={() => { setShowServiceRequest(false); setRequestResult(null); setSelectedAiService(null); }}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-sm">{requestResult.message}</p>
                  <button
                    onClick={() => setRequestResult(null)}
                    className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHomePage;
