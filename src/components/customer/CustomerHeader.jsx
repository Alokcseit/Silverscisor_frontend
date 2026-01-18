// src/components/customer/CustomerHeader.jsx

import React from 'react';
import { Scissors, Bell, User } from 'lucide-react';

const CustomerHeader = ({ currentView, setCurrentView }) => (
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scissors className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Silverscisor</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`font-medium ${currentView === 'home' ? 'underline' : 'opacity-80 hover:opacity-100'}`}
          >
            होम
          </button>
          <button
            onClick={() => setCurrentView('bookings')}
            className={`font-medium ${currentView === 'bookings' ? 'underline' : 'opacity-80 hover:opacity-100'}`}
          >
            मेरी बुकिंग
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 cursor-pointer" />
          <User className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
);

export default CustomerHeader;