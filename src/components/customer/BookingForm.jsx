import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, X, Mail, Phone, CheckCircle2, Loader2, MapPin } from 'lucide-react';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const BookingForm = ({ selectedService, salon, userData, setShowConfirmation, setBookingDetails, setShowBookingForm }) => {
  const [customerName, setCustomerName] = useState(userData?.username || userData?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userData?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(userData?.email || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [closedMessage, setClosedMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const formatDuration = (mins) => {
    if (!mins) return '—';
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  const fetchSlots = useCallback(async (date) => {
    if (!salon?._id || !date) return;
    setSlotsLoading(true);
    setSelectedTime('');
    try {
      const res = await fetch(`${SALON_API}/slots/${salon._id}?date=${date}`);
      const json = await res.json();
      if (json.success) {
        setIsClosed(json.isClosed);
        if (json.isClosed) {
          setClosedMessage(json.message || 'Salon is closed on this day');
          setSlots([]);
        } else {
          setClosedMessage('');
          setSlots(json.slots || []);
        }
      }
    } catch {
      setIsClosed(true);
      setClosedMessage('Could not load available slots');
      setSlots([]);
    }
    setSlotsLoading(false);
  }, [salon?._id]);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !selectedDate || !selectedTime) {
      alert('कृपया सभी आवश्यक जानकारी भरें!');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem('silverscissor_token');
    if (!token) {
      setSubmitError('You must be logged in to book');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${SALON_API}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          salonId: salon._id,
          serviceId: selectedService._id,
          serviceName: selectedService.name,
          servicePrice: selectedService.price,
          serviceDuration: selectedService.estimatedDuration,
          date: selectedDate,
          timeSlot: selectedTime,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setBookingDetails({
          id: json.data?._id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          date: selectedDate,
          time: selectedTime,
          service: selectedService,
          salon: salon,
          status: 'pending',
        });
        setShowBookingForm(false);
        setShowConfirmation(true);
      } else {
        setSubmitError(json.message || 'Booking failed');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const availableSlots = slots.filter((s) => s.isAvailable && !s.isBooked);
  const bookedSlots = slots.filter((s) => !s.isAvailable || s.isBooked);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mb-20 animate-fadeIn">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 relative border border-gray-100 dark:border-gray-700 transition-colors duration-300">

        {/* Close Button */}
        <button
          onClick={() => setShowBookingForm(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
            अपॉइंटमेंट <span className="text-purple-600 dark:text-purple-400">बुक करें</span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            कृपया अपनी जानकारी भरें और अपनी सुविधा अनुसार समय चुनें।
          </p>
        </div>

        {/* Salon Info */}
        {salon && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-3">
              {salon.images?.[0] ? (
                <img src={salon.images[0]} alt={salon.salonName} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{salon.salonName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {[salon.address?.area, salon.address?.city].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Details Section */}
        <div className="mb-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            आपकी जानकारी
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">पूरा नाम *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="अपना नाम दर्ज करें"
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">मोबाइल नंबर *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10 अंकों का नंबर"
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ईमेल (वैकल्पिक)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            दिनांक चुनें
          </h4>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:text-white transition-all cursor-pointer"
          />
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              समय स्लॉट चुनें
            </h4>

            {slotsLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading slots...</span>
              </div>
            )}

            {!slotsLoading && isClosed && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm text-amber-600 dark:text-amber-400 text-center">
                {closedMessage}
              </div>
            )}

            {!slotsLoading && !isClosed && slots.length === 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm text-gray-400 text-center">
                No slots available for this date
              </div>
            )}

            {!slotsLoading && !isClosed && slots.length > 0 && (
              <div>
                {availableSlots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200
                            ${isSelected
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 transform scale-105 border border-purple-600'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                            }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
                {bookedSlots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">Booked slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {bookedSlots.map((slot) => (
                        <span
                          key={slot.time}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-600 line-through"
                        >
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Service Summary */}
        {selectedService && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Booking Summary</h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-800 dark:text-white block">{selectedService.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">अवधि: {formatDuration(selectedService.estimatedDuration)}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {submitError && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 text-center">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <span>बुकिंग कन्फर्म करें</span>
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
