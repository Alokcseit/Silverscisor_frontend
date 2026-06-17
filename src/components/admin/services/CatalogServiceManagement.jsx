import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2, Loader2, X, Check, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5003/api/admin';

const adminApi = axios.create({ baseURL: ADMIN_API });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CATEGORIES = ['haircut', 'beard', 'color', 'facial', 'massage', 'other'];

const initialForm = { name: '', description: '', category: 'other', imageUrl: '', isActive: true, displayOrder: 0 };

const CatalogServiceManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'catalog-services'],
    queryFn: () => adminApi.get('/services/catalog/admin').then(r => r.data.data || r.data),
  });

  const createMutation = useMutation({
    mutationFn: (body) => adminApi.post('/services/catalog', body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'catalog-services'] }); setShowForm(false); setForm(initialForm); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => adminApi.put(`/services/catalog/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'catalog-services'] }); setShowForm(false); setEditing(null); setForm(initialForm); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/services/catalog/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'catalog-services'] }),
  });

  const services = Array.isArray(data) ? data : [];

  const filtered = services.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (svc) => {
    setEditing(svc._id);
    setForm({ name: svc.name || '', description: svc.description || '', category: svc.category || 'other', imageUrl: svc.imageUrl || '', isActive: svc.isActive !== false, displayOrder: svc.displayOrder || 0 });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert('Name is required');
    const payload = { ...form, name: form.name.trim() };
    if (editing) {
      updateMutation.mutate({ id: editing, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Catalog Services</h2>
        <button onClick={handleNew} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
          className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500" />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => { if (!isSaving) { setShowForm(false); setEditing(null); } }}>
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg p-6 border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Display Order</label>
                  <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..."
                    className="flex-1 p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500" />
                </div>
                {form.imageUrl && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-gray-700">
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition">Cancel</button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No services found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Order</th>
                  <th className="text-left p-3 font-medium">Image</th>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(svc => (
                  <tr key={svc._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="p-3 text-gray-400 text-xs">{svc.displayOrder}</td>
                    <td className="p-3">
                      {svc.imageUrl ? (
                        <img src={svc.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-700" onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium text-white">{svc.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">{svc.category}</span>
                    </td>
                    <td className="p-3">
                      {svc.isActive ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs"><Check className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-xs"><X className="w-3 h-3" /> Inactive</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(svc)} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-indigo-400 transition" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('Delete "' + svc.name + '"?')) deleteMutation.mutate(svc._id); }}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-400 transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogServiceManagement;