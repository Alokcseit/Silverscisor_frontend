import React, { useState, useEffect, useCallback } from 'react';
import { X, User, Mail, Phone, MapPin, Edit2, Save, Camera, ArrowLeft, Store, Clock, Image, Navigation, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_TIMING = { open: '09:00', close: '18:00', isClosed: false };

const emptyForm = {
  salonName: '',
  description: '',
  phone: '',
  email: '',
  whatsapp: '',
  street: '',
  area: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  latitude: '',
  longitude: '',
  profileImage: '',
};

const emptyTimings = DAYS.reduce((acc, d) => ({ ...acc, [d]: { ...DEFAULT_TIMING } }), {});

const SalonProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [salonImages, setSalonImages] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [timings, setTimings] = useState(emptyTimings);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchSalonProfile();
  }, [isOpen]);

  const getAuthToken = () => localStorage.getItem('silverscissor_token');

  const fetchSalonProfile = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await axios.post(`${SALON_API}/salon/profile`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const salon = res.data.data;
      setFormData({
        salonName: salon.salonName || '',
        description: salon.description || '',
        phone: salon.contact?.phone || '',
        email: salon.contact?.email || '',
        whatsapp: salon.contact?.whatsapp || '',
        street: salon.address?.street || '',
        area: salon.address?.area || '',
        city: salon.address?.city || '',
        state: salon.address?.state || '',
        pincode: salon.address?.pincode || '',
        country: salon.address?.country || 'India',
        latitude: salon.address?.location?.coordinates?.[1]?.toString() || '',
        longitude: salon.address?.location?.coordinates?.[0]?.toString() || '',
      });
      setProfileImage(salon.images?.[0] || '');
      setSalonImages(salon.images || []);

      if (salon.timings) {
        const t = {};
        DAYS.forEach(d => {
          t[d] = salon.timings[d] || { ...DEFAULT_TIMING };
        });
        setTimings(t);
      }
    } catch (err) {
      console.error('[SalonProfile] Fetch error:', err);
      error('Failed to load salon profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimingChange = (day, field, value) => {
    setTimings(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getAuthToken();
      const body = {
        salonName: formData.salonName,
        description: formData.description,
        contact: {
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
        },
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
        images: profileImage ? [profileImage, ...salonImages.slice(1)] : salonImages,
        timings,
      };

      const res = await axios.put(`${SALON_API}/salon/profile`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        updateUser({ ...user, salonName: formData.salonName });
        setIsEditing(false);
        success('Salon profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      error('Failed to update salon profile');
    } finally {
      setSaving(false);
    }
  };

  const buildAddressString = useCallback(() => {
    const parts = [formData.street, formData.area, formData.city, formData.state, formData.pincode, formData.country];
    return parts.filter(Boolean).join(', ');
  }, [formData.street, formData.area, formData.city, formData.state, formData.pincode, formData.country]);

  const geocodeQuery = async (query) => {
    try {
      const res = await axios.get(`${SALON_API}/salon/geocode`, {
        params: { q: query },
      });
      return res.data;
    } catch {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
        headers: { 'Accept-Language': 'en', 'User-Agent': 'SilverscisorSalonApp/1.0' },
      });
      return res.data;
    }
  };

  const handleAutoGeocode = async () => {
    const fullAddress = buildAddressString();
    if (!fullAddress) {
      error('Please fill in at least city/area before fetching coordinates');
      return;
    }
    setGeocoding(true);
    try {
      let data = await geocodeQuery(fullAddress);

      // Fallback 1: area + city + state + country
      if (!data?.length && formData.area) {
        const areaQuery = [formData.area, formData.city, formData.state, formData.country].filter(Boolean).join(', ');
        data = await geocodeQuery(areaQuery);
      }

      // Fallback 2: city + state + country
      if (!data?.length) {
        const cityQuery = [formData.city, formData.state, formData.country].filter(Boolean).join(', ');
        data = await geocodeQuery(cityQuery);
      }

      if (data?.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
        success('Coordinates fetched from address');
      } else {
        error('Could not find coordinates. Please enter manually.');
      }
    } catch (err) {
      console.error('Geocoding failed:', err);
      error('Failed to fetch coordinates. Check your internet or enter manually.');
    } finally {
      setGeocoding(false);
    }
  };

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
        console.error('Geolocation error:', err);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error('Location permission denied. Please allow access or enter manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            error('Location unavailable. Try again or enter manually.');
            break;
          case err.TIMEOUT:
            error('Location request timed out. Try again.');
            break;
          default:
            error('Could not get location. Enter manually.');
        }
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCancel = () => {
    fetchSalonProfile();
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {isEditing && (
              <button onClick={handleCancel} className="p-2 hover:bg-white/20 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Salon Profile' : 'Salon Profile'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {!isEditing && (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-400 dark:from-emerald-700 dark:to-teal-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {profileImage ? (
                        <img src={profileImage} alt="Salon" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-12 h-12" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">
                      {formData.salonName || 'My Salon'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">Salon Owner</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-emerald-500 dark:border-emerald-400 pb-2">
                      <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Salon Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Salon Name</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.salonName || 'Not Set'}</span>
                      </div>
                      {formData.description && (
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Description</span>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold text-right max-w-md">{formData.description}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-emerald-500 dark:border-emerald-400 pb-2">
                      <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Contact
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Phone</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.phone || 'Not Set'}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.email || 'Not Set'}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">WhatsApp</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{formData.whatsapp || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-emerald-500 dark:border-emerald-400 pb-2">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Address
                    </h4>
                    {formData.street || formData.city ? (
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

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-emerald-500 dark:border-emerald-400 pb-2">
                      <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Working Hours
                    </h4>
                    <div className="space-y-2">
                      {DAYS.map(day => {
                        const t = timings[day];
                        return (
                          <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-700 dark:text-gray-300 font-medium capitalize w-28">{day}</span>
                            {t?.isClosed ? (
                              <span className="text-red-500 font-medium">Closed</span>
                            ) : (
                              <span className="text-gray-600 dark:text-gray-400">
                                {t?.open || '09:00'} - {t?.close || '18:00'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 transition shadow-lg hover:shadow-xl font-semibold"
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
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-400 dark:from-emerald-700 dark:to-teal-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {profileImage ? (
                          <img src={profileImage} alt="Salon" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-12 h-12" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-emerald-600 dark:bg-emerald-500 p-3 rounded-full cursor-pointer hover:bg-emerald-700 dark:hover:bg-emerald-600 transition shadow-lg">
                        <Camera className="w-5 h-5 text-white" />
                        <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click camera icon to upload photo</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Salon Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salon Name *</label>
                        <input type="text" name="salonName" value={formData.salonName} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200 resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">WhatsApp</label>
                        <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="House No., Street Name"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Area/Locality</label>
                        <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Area"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6" placeholder="6-digit pincode"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="md:col-span-2 flex flex-wrap items-end gap-3">
                        <button
                          onClick={handleGetCurrentLocation}
                          disabled={geocoding}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition font-semibold shadow-md disabled:opacity-60"
                        >
                          {geocoding ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {geocoding ? 'Locating...' : 'Get Current Location'}
                        </button>
                        <button
                          onClick={handleAutoGeocode}
                          disabled={geocoding}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold shadow-md disabled:opacity-60"
                        >
                          {geocoding ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Navigation className="w-4 h-4" />
                          )}
                          {geocoding ? 'Fetching...' : 'From Address'}
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Latitude</label>
                        <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Auto-filled"
                          readOnly
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Longitude</label>
                        <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Auto-filled"
                          readOnly
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Working Hours
                    </h4>
                    <div className="space-y-3">
                      {DAYS.map(day => {
                        const t = timings[day] || { ...DEFAULT_TIMING };
                        return (
                          <div key={day} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-700 dark:text-gray-300 font-medium capitalize w-20">{day.slice(0, 3)}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={!t.isClosed} onChange={e => handleTimingChange(day, 'isClosed', !e.target.checked)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
                            </label>
                            {!t.isClosed && (
                              <>
                                <input type="time" value={t.open} onChange={e => handleTimingChange(day, 'open', e.target.value)}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-gray-200" />
                                <span className="text-gray-400">-</span>
                                <input type="time" value={t.close} onChange={e => handleTimingChange(day, 'close', e.target.value)}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-gray-200" />
                              </>
                            )}
                            {t.isClosed && <span className="text-sm text-red-500 font-medium">Closed</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 justify-center">
                    <button onClick={handleCancel} disabled={saving}
                      className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 transition shadow-lg hover:shadow-xl font-semibold disabled:opacity-60">
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <><Save className="w-5 h-5" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {!isEditing && !loading && (
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

export default SalonProfileModal;
