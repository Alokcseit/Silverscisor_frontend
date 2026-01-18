

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerHomePage from './components/customer/CustomerHomePage';
import SalonDashboardPage from './components/salon/SalonDashboardPage';

function App() {
  const [userType, setUserType] = useState('customer'); // 'customer' or 'salon'

  return (
    <Router>
      <div className="App">
        {/* User Type Switcher - Development ke liye */}
        <div className="fixed top-15 right-4 z-50 bg-white shadow-lg rounded-lg p-2">
          <p className="text-sm font-semibold mb-2">Switch View:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setUserType('customer')}
              className={`px-2 py-1 rounded-lg font-medium transition ${
                userType === 'customer'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setUserType('salon')}
              className={`px-2 py-1 rounded-lg font-medium transition ${
                userType === 'salon'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Salon
            </button>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          {/* Customer Routes */}
          <Route 
            path="/" 
            element={userType === 'customer' ? <CustomerHomePage /> : <Navigate to="/salon" />} 
          />
          <Route 
            path="/customer" 
            element={<CustomerHomePage />} 
          />
          
          {/* Salon Routes */}
          <Route 
            path="/salon" 
            element={userType === 'salon' ? <SalonDashboardPage /> : <Navigate to="/" />} 
          />
          
          {/* Default Redirect */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;