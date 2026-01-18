// src/components/customer/CustomerBottomNav.jsx

import React from 'react';
import { Home, Calendar, Bell, User } from 'lucide-react';

const CustomerBottomNav = ({ currentView, setCurrentView }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 shadow-lg">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-around items-center">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'home' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">होम</span>
        </button>
        
        <button
          onClick={() => setCurrentView('bookings')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'bookings' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">मेरी बुकिंग</span>
        </button>
        
        <button 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-500 transition"
        >
          <div className="relative">
            <Bell className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          <span className="text-xs font-medium">नोटिफिकेशन</span>
        </button>
        
        <button 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-purple-500 transition"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">प्रोफाइल</span>
        </button>
      </div>
    </div>
  </div>
);

export default CustomerBottomNav;