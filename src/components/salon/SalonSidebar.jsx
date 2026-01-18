

import React from 'react';
import { Home, Calendar, Scissors, Settings, Users, DollarSign, LogOut } from 'lucide-react';

const SalonSidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'डैशबोर्ड',
      icon: Home,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'bookings',
      name: 'बुकिंग',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'services',
      name: 'सेवाएं',
      icon: Scissors,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'customers',
      name: 'ग्राहक',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'earnings',
      name: 'कमाई',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      id: 'settings',
      name: 'सेटिंग्स',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Silverscisor</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? `${item.bgColor} ${item.color} font-semibold`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Salon Info */}
      <div className="absolute bottom-20 w-64 p-4 bg-gradient-to-br from-green-50 to-teal-50 m-4 rounded-lg">
        <p className="text-xs text-gray-600 mb-1">सैलून का नाम</p>
        <p className="font-bold text-gray-800">Silverscisor Salon</p>
        <p className="text-xs text-gray-500 mt-2">📍 Connaught Place, Delhi</p>
      </div>
    </div>
  );
};

export default SalonSidebar;