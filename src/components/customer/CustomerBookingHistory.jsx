// src/components/customer/CustomerBookingHistory.jsx

import React from 'react';
import { Calendar, Clock, Scissors, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CustomerBookingHistory = ({ bookings }) => {
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            कन्फर्म्ड
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            पूर्ण
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            रद्द
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            पेंडिंग
          </span>
        );
      default:
        return null;
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">मेरी बुकिंग</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">कोई बुकिंग नहीं</h3>
          <p className="text-gray-500">अभी तक कोई अपॉइंटमेंट बुक नहीं की गई है</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Scissors className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">{booking.service.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">बुकिंग ID: #{booking.id}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    दिनांक
                  </p>
                  <p className="font-semibold text-gray-800">{booking.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    समय
                  </p>
                  <p className="font-semibold text-gray-800">{booking.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">अवधि</p>
                  <p className="font-semibold text-gray-800">{booking.service.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">मूल्य</p>
                  <p className="font-bold text-purple-600 text-lg">₹{booking.service.price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {booking.status === 'confirmed' && (
                  <>
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                      विवरण देखें
                    </button>
                    <button className="px-6 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition">
                      रद्द करें
                    </button>
                  </>
                )}
                {booking.status === 'completed' && (
                  <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition">
                    ⭐ रिव्यू दें
                  </button>
                )}
                {booking.status === 'cancelled' && (
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                    फिर से बुक करें
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">कुल बुकिंग</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">पूर्ण</p>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">आगामी</p>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">कुल खर्च</p>
            <p className="text-2xl font-bold">
              ₹{bookings.reduce((sum, b) => sum + b.service.price, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookingHistory;