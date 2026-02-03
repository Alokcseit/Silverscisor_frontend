
// src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Sparkles, Sun, Moon } from 'lucide-react';
import DecorativeSVGLoginDark from '../../util/DecorativeSVGLoginDark';
import SalonMorphIcon from '../../util/SalonMorphIcon';
import Swal from 'sweetalert2';
import { useTheme } from '../../context/ThemeContext';
import DecorativeSVG from '../../util/DecorativeSVG';
import axios from 'axios';

const ForgotPassword = ({ onBackToLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email');
      return;
    }

    setIsLoading(true);

   try {
    console.log("email",email)
  const response = await axios.post('https://silverscisor-frontend.vercel.app/api/v1/auth/forgot-password',  {email} );
  console.log(response)
  if (response.status === 200) {
    Swal.fire({
      icon: 'success',
      title: 'Email Sent!',
      text: `We have sent a password reset link to ${email}`,
      confirmButtonColor: '#f43f5e'
    }).then(() => {
       onBackToLogin(); // Reset ke baad user ko login par bhejna achha practice hai
    });
  }
} catch (error) {
  setError(error.response?.data?.message || 'Something went wrong');
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error.response?.data?.message || 'Email not found or server error',
  });
}
  };

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
              Reset Password
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-gray-100 dark:border-slate-700 group-focus-within:bg-rose-50 dark:group-focus-within:bg-rose-500/20 group-focus-within:border-rose-100 dark:group-focus-within:border-rose-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className={`w-full pl-14 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                    error ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                  }`}
                />
              </div>
              {error && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                  {error}
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
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Button */}
          <div className="mt-6">
            <button
              onClick={onBackToLogin}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
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

export default ForgotPassword;