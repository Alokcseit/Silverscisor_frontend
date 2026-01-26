// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Scissors, ArrowRight, Phone, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DecorativeSVG } from '../../util/DecorativeSVG';
import DecorativeSVGLoginDark from '../../util/DecorativeSVGLoginDark';
import { useTheme } from '../../context/ThemeContext';
import SalonMorphIcon from '../../util/SalonMorphIcon';
import { loginAPI } from './services/login';
import Swal from 'sweetalert2';

const Login = ({ onSwitchToSignup }) => {
    const { theme, toggleTheme } = useTheme();
  const { login } = useAuth(); // 👈 AuthContext
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Enter a valid email';
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = 'Enter a 10-digit number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsLoading(true);

  try {
    // 1️⃣ Call the API
    const data = await loginAPI(formData);
    console.log("data",data)
    const token = data?.data.token; 
    const user = data?.data.user || {}; 

    // 3️⃣ Save token securely (Context function provided in your snippet)
    // You might also want to save it to sessionStorage here if your 'login' function doesn't do it
    localStorage.setItem("authToken", token); 
    
    login(user, token); 

    // 4️⃣ Optional: Success Alert
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: `Welcome back, ${user.username || 'User'}!`,
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {
    // 5️⃣ Handle Errors
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
     
      {theme === 'light' ? <DecorativeSVG /> : <DecorativeSVGLoginDark />}


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
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-900/10 dark:shadow-black/30 p-8 border border-white/50 dark:border-white/10 transition-all duration-500 hover:shadow-3xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <SalonMorphIcon />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 dark:from-rose-400 dark:to-amber-400 bg-clip-text text-transparent mb-1">
              Silverscisor
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">Welcome back! Sign in to continue</p>
          </div>

          {/* Login Method Toggle */}
          <div className="mb-6">
            <div className="flex gap-3 p-1.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  loginMethod === 'email'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10 dark:shadow-black/20'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  loginMethod === 'phone'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10 dark:shadow-black/20'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-14 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.email ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-gray-100 dark:border-slate-700 group-focus-within:bg-rose-50 dark:group-focus-within:bg-rose-500/20 group-focus-within:border-rose-100 dark:group-focus-within:border-rose-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    maxLength="10"
                    className={`w-full pl-14 pr-4 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                      errors.phone ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-gray-100 dark:border-slate-700 group-focus-within:bg-rose-50 dark:group-focus-within:bg-rose-500/20 group-focus-within:border-rose-100 dark:group-focus-within:border-rose-500/30 transition-colors">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-14 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:focus:ring-rose-500/40 focus:bg-white dark:focus:bg-slate-800 border-2 transition-all duration-300 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                    errors.password ? 'border-red-400 bg-red-50/50 dark:bg-red-500/10' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium transition-colors hover:underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-base hover:from-rose-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-rose-500/30 dark:hover:shadow-rose-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-slate-900 text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              New to Silverscisor?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-rose-500 dark:text-rose-400 font-semibold hover:text-rose-600 dark:hover:text-rose-300 transition-colors hover:underline underline-offset-2"
              >
                Create Account
              </button>
            </p>
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

export default Login;