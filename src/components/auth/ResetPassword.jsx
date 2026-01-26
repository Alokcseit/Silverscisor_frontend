// src/components/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Sparkles, Sun, Moon, CheckCircle, XCircle } from 'lucide-react';
import DecorativeSVGLoginDark from '../../util/DecorativeSVGLoginDark';
import SalonMorphIcon from '../../util/SalonMorphIcon';
import Swal from 'sweetalert2';
import { useTheme } from '../../context/ThemeContext';
import DecorativeSVG from '../../util/DecorativeSVG';

const ResetPassword = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(null);
  const [errors, setErrors] = useState({});

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsVerifying(false);
        return;
      }

      try {
        // TODO: API call to verify token
        // const response = await fetch(`/api/auth/verify-reset-token/${token}`);
        // const data = await response.json();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, assume token is valid
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // TODO: API call to reset password
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, newPassword: formData.newPassword })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful!',
        text: 'Your password has been changed. Redirecting to login...',
        confirmButtonColor: '#f43f5e',
        timer: 2000
      }).then(() => {
        navigate('/auth');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {theme === 'light' ? <DecorativeSVG /> : <DecorativeSVGLoginDark />}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {theme === 'light' ? <DecorativeSVG /> : <DecorativeSVGLoginDark />}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background SVGs */}
      {theme === 'light' ? <DecorativeSVG /> : <DecorativeSVGLoginDark />}

      <div className="w-full max-w-md relative z-10">
        
        {/* Theme Toggle */}
        <div className="flex flex-row justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-amber-400"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-900/10 dark:shadow-black/30 p-8 border border-white/50 dark:border-white/10 transition-all duration-500">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20">
                <SalonMorphIcon />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 dark:from-rose-400 dark:to-amber-400 bg-clip-text text-transparent mb-1">
              Create New Password
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-gray-100 dark:border-slate-700 group-focus-within:bg-rose-50 dark:group-focus-within:bg-rose-500/20 group-focus-within:border-rose-100 dark:group-focus-within:border-rose-500/30 transition-colors">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`w-full pl-14 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                    errors.newPassword ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-gray-100 dark:border-slate-700 group-focus-within:bg-rose-50 dark:group-focus-within:bg-rose-500/20 group-focus-within:border-rose-100 dark:group-focus-within:border-rose-500/30 transition-colors">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full pl-14 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-base hover:from-rose-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-rose-500/30 dark:hover:shadow-rose-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-6">
          Silverscisor &copy; 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;