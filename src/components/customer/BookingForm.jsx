import React, { useState } from 'react';
import { Calendar, Clock, User, X, Mail, Phone, CheckCircle2 } from 'lucide-react';

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
      alert('कृपया सभी आवश्यक जानकारी भरें!');
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
            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:text-white dark:calendar-invert transition-all cursor-pointer"
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    disabled={isBooked}
                    className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isBooked
                        ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent'
                        : isSelected
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 transform scale-105 border border-purple-600'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                  >
                    {slot}
                    {isBooked && (
                        <span className="absolute -top-2 -right-2 text-[10px] bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                            Booked
                        </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Service Summary */}
        {selectedService && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Booking Summary</h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-800 dark:text-white block">{selectedService.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">अवधि: {selectedService.duration}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>बुकिंग कन्फर्म करें</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookingForm;