import React from 'react';
import { Home, Calendar, Bell, User } from 'lucide-react';

const CustomerBottomNav = ({ currentView, setCurrentView }) => {
  
  // नेविगेशन आइटम्स का डेटा एक जगह परिभाषित करें ताकि कोड साफ रहे
  const navItems = [
    { id: 'home', label: 'होम', icon: Home },
    { id: 'bookings', label: 'बुकिंग्स', icon: Calendar },
    { id: 'notifications', label: 'अलर्ट', icon: Bell, badge: 3 },
    { id: 'profile', label: 'प्रोफाइल', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main Bar Container with Glassmorphism */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_15px_rgba(0,0,0,0.2)] px-6 py-2 pb-safe">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="relative group flex flex-col items-center justify-center w-16 h-14"
                >
                  {/* Active Indicator (Glow Background) */}
                  <span
                    className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 opacity-100 scale-100' 
                        : 'bg-transparent opacity-0 scale-75'
                    }`}
                  ></span>

                  {/* Icon Container */}
                  <div className="relative z-10 transition-transform duration-300">
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive 
                          ? 'text-purple-600 dark:text-purple-400 -translate-y-1' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-300'
                      }`} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    
                    {/* Notification Badge */}
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center ring-2 ring-white dark:ring-gray-900">
                          {item.badge}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Label Text */}
                  <span 
                    className={`text-[10px] font-medium z-10 transition-all duration-300 mt-1 ${
                      isActive 
                        ? 'text-purple-700 dark:text-purple-300 translate-y-0 opacity-100' 
                        : 'text-gray-500 dark:text-gray-500 translate-y-2 opacity-0 h-0 w-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Inactive State Dot (Optional: Shows a dot instead of text when inactive) */}
                  {!isActive && (
                     <span className="absolute bottom-2 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  )}
                </button>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBottomNav;