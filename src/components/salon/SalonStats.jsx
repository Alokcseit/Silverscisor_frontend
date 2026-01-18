import React from 'react';  
import { Calendar, CheckCircle, DollarSign , Users } from "lucide-react";

const SalonStats = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">आज का ओवरव्यू</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">12</span>
          </div>
          <h3 className="text-lg font-semibold">आज की बुकिंग</h3>
          <p className="text-sm opacity-90 mt-1">+3 नई बुकिंग</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">8</span>
          </div>
          <h3 className="text-lg font-semibold">पूर्ण सेवाएं</h3>
          <p className="text-sm opacity-90 mt-1">4 पेंडिंग</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">₹3.2K</span>
          </div>
          <h3 className="text-lg font-semibold">आज की कमाई</h3>
          <p className="text-sm opacity-90 mt-1">लक्ष्य: ₹5K</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">45</span>
          </div>
          <h3 className="text-lg font-semibold">कुल ग्राहक</h3>
          <p className="text-sm opacity-90 mt-1">इस महीने</p>
        </div>
      </div>
    </div>
  );
    export default SalonStats;