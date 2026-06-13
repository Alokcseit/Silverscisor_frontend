import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Scissors, Clock, DollarSign, Tag, Camera, RotateCcw } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';

const CATEGORIES = [
  { value: 'haircut', label: 'Haircut' },
  { value: 'beard', label: 'Beard' },
  { value: 'facial', label: 'Facial' },
  { value: 'color', label: 'Color' },
  { value: 'massage', label: 'Massage' },
  { value: 'other', label: 'Other' },
];

const emptyService = {
  name: '',
  description: '',
  category: 'other',
  price: '',
  estimatedDuration: '',
  bufferTime: 10,
};

const SalonServiceManagement = () => {
  const { success, error } = useNotification();
  const fileInputRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const getToken = () => localStorage.getItem('silverscissor_token');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${SALON_API}/services/my-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
      error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await axios.post(`${SALON_API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.url;
    } catch (err) {
      console.error('Upload failed:', err);
      error('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const openAddForm = () => {
    setForm(emptyService);
    setEditingId(null);
    setImagePreview(null);
    setImageFile(null);
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      estimatedDuration: service.estimatedDuration.toString(),
      bufferTime: service.bufferTime,
    });
    setEditingId(service._id);
    setImagePreview(service.imageUrl || null);
    setImageFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyService);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.estimatedDuration) {
      error('Name, Price, and Duration are required');
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      let imageUrl = editingId ? (imagePreview && !imageFile ? imagePreview : '') : '';

      if (imageFile) {
        const uploaded = await uploadImage();
        if (uploaded) imageUrl = uploaded;
      }

      const body = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        estimatedDuration: parseInt(form.estimatedDuration),
        bufferTime: parseInt(form.bufferTime) || 10,
        ...(imageUrl ? { imageUrl } : {}),
      };

      if (editingId) {
        await axios.put(`${SALON_API}/services/${editingId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success('Service updated');
      } else {
        await axios.post(`${SALON_API}/services`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success('Service added');
      }
      closeForm();
      fetchServices();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (service) => {
    Swal.fire({
      title: 'Remove Service?',
      text: `"${service.name}" will be hidden from customers.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getToken();
          await axios.delete(`${SALON_API}/services/${service._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          success(`"${service.name}" removed`);
          fetchServices();
        } catch (err) {
          error('Failed to remove service');
        }
      }
    });
  };

  const handleRestore = async (serviceId) => {
    try {
      const token = getToken();
      await axios.put(`${SALON_API}/services/${serviceId}`, { isAvailable: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      success('Service restored');
      fetchServices();
    } catch (err) {
      error('Failed to restore service');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Services</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your salon services</p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-semibold shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>
            <button onClick={closeForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Image</label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition overflow-hidden bg-gray-50 dark:bg-gray-700"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (max 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview && (
                  <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Classic Haircut"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief description..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200">
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price (₹) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder="299"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration (min) *</label>
              <input type="number" name="estimatedDuration" value={form.estimatedDuration} onChange={handleChange} min="5" placeholder="30"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buffer Time (min)</label>
              <input type="number" name="bufferTime" value={form.bufferTime} onChange={handleChange} min="0" placeholder="10"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200" />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={closeForm}
                className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold shadow-md disabled:opacity-60">
                {(saving || uploading) ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : editingId ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20">
          <Scissors className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Services Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first service to get started</p>
          {!showForm && (
            <button onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-semibold shadow-md">
              <Plus className="w-5 h-5" />
              Add Your First Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map(service => (
            <div key={service._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${service.isAvailable ? 'border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-500/20'} p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="flex items-center gap-4 flex-1">
                {service.imageUrl && (
                  <img src={service.imageUrl} alt={service.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{service.name}</h3>
                    {!service.isAvailable && (
                      <span className="text-xs bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">Hidden</span>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{service.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {CATEGORIES.find(c => c.value === service.category)?.label || service.category}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                      <DollarSign className="w-4 h-4" />
                      ₹{service.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.estimatedDuration} min
                    </span>
                    {service.bufferTime > 0 && (
                      <span className="text-gray-400">+ {service.bufferTime} min buffer</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!service.isAvailable && (
                  <button
                    onClick={() => handleRestore(service._id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>
                )}
                <button
                  onClick={() => openEditForm(service)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalonServiceManagement;
