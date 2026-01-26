// src/components/auth/Signup.jsx

import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Scissors, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { DecorativeSVGSignup } from '../../util/DecorativeSVGSignup';
import DecorativeSVGSignupDark from '../../util/DecorativeSVGSignupDark';
import { useTheme } from '../../context/ThemeContext';
import SalonMorphIcon from '../../util/SalonMorphIcon';
import Swal from 'sweetalert2';
import { signupAPI } from './services/signup';

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'valid email address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'valid 10-digit mobile number is required';
    }

    if (!formData.password) {
      newErrors.password = 'password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsLoading(true);

  try {
    // 1️⃣ Call the Signup API
    const responseData = await signupAPI(formData);

    // 2️⃣ Success Alert
    Swal.fire({
      icon: 'success',
      title: 'Signup Successful!',
      text: 'Your account has been created successfully.',
      timer: 2000,
      showConfirmButton: false
    });

    // 3️⃣ Call parent handler (e.g., to switch to login screen)
    if (onSignupSuccess) {
        // Pass response data or formData based on what your app needs
        onSignupSuccess(responseData); 
    }

  } catch (error) {
    // 4️⃣ Error Alert
    Swal.fire({
      icon: 'error',
      title: 'Signup Failed',
      text: error.message,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* <DecorativeSVGSignup /> */}
      {theme === 'light' ? <DecorativeSVGSignup /> : <DecorativeSVGSignupDark />}
     
      <div className="w-full max-w-md relative z-10">
            <div className="flex flex-row justify-center">
                         <button
                     onClick={toggleTheme}
                     className="p-2 rounded-full text-amber-400"
                   >
                     {theme === "dark" ? <Sun /> : <Moon />}
                   </button>
                       </div>
        {/* Main Card */}
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-rose-900/10 dark:shadow-black/30 border border-white/60 dark:border-white/10 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-rose-50/30 dark:from-slate-800/30 dark:via-transparent dark:to-rose-500/5 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 via-rose-500 to-amber-500 rounded-2xl mb-4 shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20 transform hover:scale-105 transition-transform duration-300">
                <SalonMorphIcon />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">
                Silverscisor
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Create your account to get started</p>
            </div>

            {/* User Type Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'customer' })}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    formData.userType === 'customer'
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-500/15 scale-[1.02]'
                      : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'salon_owner' })}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    formData.userType === 'salon_owner'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/15 scale-[1.02]'
                      : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  Salon Owner
                </button>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center group-focus-within:bg-rose-500 dark:group-focus-within:bg-rose-500 transition-all duration-300">
                    <User className="w-4 h-4 text-rose-500 dark:text-rose-400 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full pl-16 pr-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 border-2 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.name ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10 focus:border-red-400 dark:focus:border-red-500' : 'border-gray-100 dark:border-slate-700 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 dark:focus:shadow-rose-500/5'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center group-focus-within:bg-rose-500 dark:group-focus-within:bg-rose-500 transition-all duration-300">
                    <Mail className="w-4 h-4 text-rose-500 dark:text-rose-400 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-16 pr-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 border-2 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.email ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10 focus:border-red-400 dark:focus:border-red-500' : 'border-gray-100 dark:border-slate-700 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 dark:focus:shadow-rose-500/5'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center group-focus-within:bg-rose-500 dark:group-focus-within:bg-rose-500 transition-all duration-300">
                    <Phone className="w-4 h-4 text-rose-500 dark:text-rose-400 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    maxLength="10"
                    className={`w-full pl-16 pr-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 border-2 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.phone ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10 focus:border-red-400 dark:focus:border-red-500' : 'border-gray-100 dark:border-slate-700 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 dark:focus:shadow-rose-500/5'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center group-focus-within:bg-rose-500 dark:group-focus-within:bg-rose-500 transition-all duration-300">
                    <Lock className="w-4 h-4 text-rose-500 dark:text-rose-400 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full pl-16 pr-14 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 border-2 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.password ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10 focus:border-red-400 dark:focus:border-red-500' : 'border-gray-100 dark:border-slate-700 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 dark:focus:shadow-rose-500/5'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center group-focus-within:bg-rose-500 dark:group-focus-within:bg-rose-500 transition-all duration-300">
                    <Lock className="w-4 h-4 text-rose-500 dark:text-rose-400 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full pl-16 pr-14 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 border-2 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.confirmPassword ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10 focus:border-red-400 dark:focus:border-red-500' : 'border-gray-100 dark:border-slate-700 focus:border-rose-400 dark:focus:border-rose-500 focus:shadow-lg focus:shadow-rose-500/10 dark:focus:shadow-rose-500/5'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-500 via-rose-500 to-amber-500 text-white py-4 rounded-2xl font-semibold text-base hover:shadow-xl hover:shadow-rose-500/30 dark:hover:shadow-rose-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-rose-500 dark:text-rose-400 font-semibold hover:text-rose-600 dark:hover:text-rose-300 transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-6">
          Silverscisor &copy; 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;