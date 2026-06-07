// src/components/common/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';

const ProtectedRoute = ({ children, requiredUserType, validateEndpoint, redirectTo }) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [invalidSession, setInvalidSession] = useState(false);

  const { data: validateData, error: validateError, loading: validateLoading, status: validateStatus } =
    useApi({ url: validateEndpoint, method: 'GET', auto: !!validateEndpoint && isAuthenticated, auth: true, dependencies: [isAuthenticated] });

  if (isLoading || validateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/auth'} replace />;
  }

  // If a validation endpoint was provided and returned an error/status indicating an invalid session,
  // force logout and redirect to auth.
  useEffect(() => {
    if (!validateEndpoint) return;
    if (validateError || validateStatus === 401) {
      setInvalidSession(true);
      try {
        logout();
      } catch (e) {}
    }
  }, [validateError, validateStatus, validateEndpoint, logout]);

  if (invalidSession) {
    return <Navigate to={redirectTo || '/auth'} replace />;
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    return <Navigate to={user?.userType === 'customer' ? '/customer' : '/salon'} replace />;
  }

  return children;
};

export default ProtectedRoute;