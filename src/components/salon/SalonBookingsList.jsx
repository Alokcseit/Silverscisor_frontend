
import { User, Phone } from 'lucide-react';
const SalonBookingsList = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">आज की बुकिंग</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            सभी
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            कन्फर्म्ड
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            पेंडिंग
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Booking Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">राहुल कुमार</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              कन्फर्म्ड
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">सेवा</p>
              <p className="font-semibold text-gray-800">Haircut + Beard</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">समय</p>
              <p className="font-semibold text-gray-800">11:00 AM</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">अवधि</p>
              <p className="font-semibold text-gray-800">45 मिनट</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">मूल्य</p>
              <p className="font-semibold text-purple-600">₹250</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
              पूर्ण करें
            </button>
            <button className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              रद्द करें
            </button>
          </div>
        </div>

        {/* Booking Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">प्रिया शर्मा</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  +91 98765 43211
                </p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              पेंडिंग
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">सेवा</p>
              <p className="font-semibold text-gray-800">Facial</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">समय</p>
              <p className="font-semibold text-gray-800">02:00 PM</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">अवधि</p>
              <p className="font-semibold text-gray-800">60 मिनट</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">मूल्य</p>
              <p className="font-semibold text-purple-600">₹300</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
              पूर्ण करें
            </button>
            <button className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              रद्द करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );


export default SalonBookingsList;