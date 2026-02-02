// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomerHomePage from './components/customer/CustomerHomePage';
import SalonDashboardPage from './components/salon/SalonDashboardPage';
import AuthPage from './components/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import ResetPassword from './components/auth/ResetPassword';
import {QueueProvider} from './context/QueueContext'
function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  console.log(isAuthenticated,"dagkfhd",user)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <LoadingSpinner size="lg" message="Loading Silverscisor..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Route */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to={user?.userType === 'customer' ? '/customer' : '/salon'} replace />
          ) : (
            <AuthPage />
          )
        }
      />

      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute requiredUserType="customer">
            <CustomerHomePage />
          </ProtectedRoute>
        }
      />

      {/* Salon Routes */}
      <Route
        path="/salon"
        element={
          <ProtectedRoute requiredUserType="salon">
            <SalonDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.userType === 'customer' ? '/customer' : '/salon'} replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <QueueProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
          </QueueProvider>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
