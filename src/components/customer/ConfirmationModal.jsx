import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const ConfirmationModal = ({ bookingDetails, setShowConfirmation }) => {
  if (!bookingDetails) return null;

  const isPending = bookingDetails.status === 'pending' || !bookingDetails.status;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          {isPending ? (
            <>
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">रिक्वेस्ट भेज दी गई!</h3>
              <p className="text-gray-600 mb-6">सैलून के कन्फर्मेशन का इंतज़ार करें</p>
            </>
          ) : (
            <>
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">बुकिंग कन्फर्म!</h3>
              <p className="text-gray-600 mb-6">आपकी अपॉइंटमेंट सफलतापूर्वक बुक हो गई है</p>
            </>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">नाम:</span>
              <span className="font-semibold">{bookingDetails.customerName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">दिनांक:</span>
              <span className="font-semibold">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">समय:</span>
              <span className="font-semibold">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">सेवा:</span>
              <span className="font-semibold">{bookingDetails.service?.name}</span>
            </div>
            {bookingDetails.salon && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">सैलून:</span>
                <span className="font-semibold">{bookingDetails.salon.salonName}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-600">कुल मूल्य:</span>
              <span className="font-bold text-purple-600 text-lg">₹{bookingDetails.service?.price}</span>
            </div>
          </div>

          {isPending && (
            <p className="text-sm text-amber-600 mb-4 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              सैलून के रिस्पॉन्स का इंतज़ार करें
            </p>
          )}

          <button
            onClick={() => setShowConfirmation(false)}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              isPending
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            ठीक है
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
