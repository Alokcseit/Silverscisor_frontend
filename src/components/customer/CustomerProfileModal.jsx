import React, { useState, useEffect, useCallback } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Edit2, Save, Camera, ArrowLeft, Navigation, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import CustomerModalBackgroundSVG from '../../util/CustomerModalBackgroundSVG';
import axios from 'axios';

const AUTH_API = import.meta.env.VITE_AUTH_API_URL
  ? `${import.meta.env.VITE_AUTH_API_URL}/api`
  : 'https://silverscisormasterbackend.onrender.com/api';

const CustomerProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || 'male',
    street: user?.address?.street || '',
    area: user?.address?.area || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India',
    latitude: user?.address?.location?.coordinates?.[1]?.toString() || '',
    longitude: user?.address?.location?.coordinates?.[0]?.toString() || '',
  });

  const getToken = () => localStorage.getItem('silverscissor_token');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'male',
        street: user.address?.street || '',
        area: user.address?.area || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India',
        latitude: user.address?.location?.coordinates?.[1]?.toString() || '',
        longitude: user.address?.location?.coordinates?.[0]?.toString() || '',
      });
      setProfileImage(user.profilePicture || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const buildAddressString = useCallback(() => {
    const parts = [formData.street, formData.area, formData.city, formData.state, formData.pincode, formData.country];
    return parts.filter(Boolean).join(', ');
  }, [formData.street, formData.area, formData.city, formData.state, formData.pincode, formData.country]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      error('Geolocation is not supported by your browser');
      return;
    }
    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        success('Current location detected');
        setGeocoding(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            error('Location unavailable');
            break;
          case err.TIMEOUT:
            error('Location request timed out');
            break;
          default:
            error('Could not get location');
        }
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const geocodeQuery = async (query) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api'}/salon/geocode`, {
        params: { q: query },
      });
      return res.data;
    } catch {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
        headers: { 'Accept-Language': 'en', 'User-Agent': 'SilverscisorApp/1.0' },
      });
      return res.data;
    }
  };

  const handleAutoGeocode = async () => {
    const address = buildAddressString();
    if (!address) {
      error('Please fill in at least city/area');
      return;
    }
    setGeocoding(true);
    try {
      let data = await geocodeQuery(address);
      if (!data?.length && formData.area) {
        data = await geocodeQuery([formData.area, formData.city, formData.state, formData.country].filter(Boolean).join(', '));
      }
      if (!data?.length) {
        data = await geocodeQuery([formData.city, formData.state, formData.country].filter(Boolean).join(', '));
      }
      if (data?.length > 0) {
        setFormData(prev => ({ ...prev, latitude: data[0].lat, longitude: data[0].lon }));
        success('Coordinates fetched from address');
      } else {
        error('Could not find coordinates for this address');
      }
    } catch (err) {
      error('Failed to fetch coordinates');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const body = {
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        profilePicture: profileImage,
        address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          location: {
            type: 'Point',
            coordinates: [
              parseFloat(formData.longitude) || 0,
              parseFloat(formData.latitude) || 0,
            ],
          },
        },
      };

      const res = await axios.put(`${AUTH_API}/auth/profile`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = res.data.data;
      updateUser({
        ...user,
        username: updated.username,
        email: updated.email,
        phone: updated.phone,
        dateOfBirth: updated.dateOfBirth,
        gender: updated.gender,
        profilePicture: updated.profilePicture,
        address: updated.address,
      });

      setIsEditing(false);
      success('Profile updated successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'male',
      street: user?.address?.street || '',
      area: user?.address?.area || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India',
      latitude: user?.address?.location?.coordinates?.[1]?.toString() || '',
      longitude: user?.address?.location?.coordinates?.[0]?.toString() || '',
    });
    setProfileImage(user?.profilePicture || '');
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CustomerModalBackgroundSVG />
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {isEditing && (
              <button onClick={handleCancel} className="p-2 hover:bg-white/20 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Profile' : 'My Profile'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">

          {!isEditing && (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 dark:from-purple-700 dark:to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{formData.name || 'User'}</h3>
                <p className="text-gray-500 dark:text-gray-400">{user?.userType === 'customer' ? 'Customer' : 'Salon Owner'}</p>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-purple-500 dark:border-purple-400 pb-2">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Personal Information
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Full Name</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.name || 'Not Set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.email || 'Not Set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Phone</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.phone || 'Not Set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Date of Birth</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.dateOfBirth || 'Not Set'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Gender</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold capitalize">{formData.gender || 'Not Set'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-purple-500 dark:border-purple-400 pb-2">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Address Information
                </h4>
                {formData.street || formData.area || formData.city ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                      {formData.street && <span className="block">{formData.street}</span>}
                      {formData.area && <span className="block">{formData.area}</span>}
                      {formData.city && formData.state && <span className="block">{formData.city}, {formData.state}</span>}
                      {formData.pincode && <span className="block">PIN: {formData.pincode}</span>}
                      {formData.country && <span className="block font-semibold mt-1">{formData.country}</span>}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No address added yet</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition shadow-lg hover:shadow-xl font-semibold"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>
            </>
          )}

          {isEditing && (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 dark:from-purple-700 dark:to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.username?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 dark:bg-purple-500 p-3 rounded-full cursor-pointer hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click camera icon to upload photo</p>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength="10"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <div className="flex gap-6">
                      {['male', 'female', 'other'].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="House No., Street Name"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Area/Locality</label>
                    <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Area"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6" placeholder="6-digit pincode"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap items-end gap-3">
                    <button
                      onClick={handleGetCurrentLocation}
                      disabled={geocoding}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition font-semibold shadow-md disabled:opacity-60"
                    >
                      {geocoding ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                      {geocoding ? 'Locating...' : 'Get Current Location'}
                    </button>
                    <button
                      onClick={handleAutoGeocode}
                      disabled={geocoding}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold shadow-md disabled:opacity-60"
                    >
                      {geocoding ? <Loader className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      {geocoding ? 'Fetching...' : 'From Address'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Latitude</label>
                    <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Auto-filled" readOnly
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Longitude</label>
                    <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Auto-filled" readOnly
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-center">
                <button onClick={handleCancel} disabled={saving}
                  className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 transition shadow-lg hover:shadow-xl font-semibold disabled:opacity-60">
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save className="w-5 h-5" /> Save Changes</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfileModal;
