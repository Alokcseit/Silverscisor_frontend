// src/components/customer/BookingForm.jsx

import React, { useState } from 'react';
import { Calendar, Clock, User, X } from 'lucide-react';

const BookingForm = ({ selectedService, setShowConfirmation, setBookingDetails, setShowBookingForm }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const bookedSlots = ['02:00 PM', '07:00 PM']; // Example booked slots

  const handleSubmit = () => {
    if (!customerName || !customerPhone || !selectedDate || !selectedTime) {
      alert('कृपया सभी जानकारी भरें!');
      return;
    }

    const booking = {
      customerName,
      customerPhone,
      customerEmail,
      date: selectedDate,
      time: selectedTime,
      service: selectedService
    };

    setBookingDetails(booking);
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowBookingForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">अपॉइंटमेंट बुक करें</h3>
        
        {/* Customer Details */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            आपकी जानकारी
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">पूरा नाम *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="अपना नाम दर्ज करें"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">मोबाइल नंबर *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10 अंकों का नंबर"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ईमेल (वैकल्पिक)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            दिनांक चुनें
          </h4>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              समय स्लॉट चुनें
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    disabled={isBooked}
                    className={`p-3 rounded-lg transition ${
                      isBooked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'border-2 border-purple-600 bg-purple-50 font-medium'
                        : 'border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {slot}
                    {isBooked && <span className="block text-xs">बुक्ड</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Service Summary */}
        {selectedService && (
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">चयनित सेवा</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{selectedService.name}</span>
              <span className="font-bold text-purple-600">₹{selectedService.price}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">अवधि: {selectedService.duration}</div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition"
        >
          बुकिंग कन्फर्म करें
        </button>
      </div>
    </div>
  );
};

export default BookingForm;