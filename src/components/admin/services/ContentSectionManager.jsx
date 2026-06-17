import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2, Loader2, X, Check, Upload } from 'lucide-react';
import axios from 'axios';

const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5003/api/admin';

const adminApi = axios.create({ baseURL: ADMIN_API });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const initialForm = { key: '', label: '', content: '{}', isActive: true };

const tryParse = (str) => { try { return JSON.parse(str); } catch { return null; } };

const ContentSectionManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [jsonError, setJsonError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'content-sections'],
    queryFn: () => adminApi.get('/content').then(r => r.data.data || r.data),
  });

  const createMutation = useMutation({
    mutationFn: (body) => adminApi.post('/content', body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'content-sections'] }); setShowForm(false); setForm(initialForm); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => adminApi.put(`/content/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'content-sections'] }); setShowForm(false); setEditing(null); setForm(initialForm); },
  });

  const deleteMutation = useMutation({
    mutationFn: (key) => adminApi.delete(`/content/${key}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'content-sections'] }),
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await adminApi.post('/upload', fd);
      if (res.data.success) {
        const url = res.data.data.url;
        const current = tryParse(form.content) || {};
        setForm(f => ({ ...f, content: JSON.stringify({ ...current, image: url }, null, 2) }));
        setJsonError(null);
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sections = Array.isArray(data) ? data : [];

  const filtered = sections.filter(s =>
    !search || s.key?.toLowerCase().includes(search.toLowerCase()) || s.label?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (sec) => {
    setEditing(sec.key);
    setForm({ key: sec.key, label: sec.label || '', content: JSON.stringify(sec.content || {}, null, 2), isActive: sec.isActive !== false });
    setJsonError(null);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing(null);
    setForm(initialForm);
    setJsonError(null);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.key.trim()) return alert('Key is required');
    const parsed = tryParse(form.content);
    if (!parsed) { setJsonError('Invalid JSON'); return; }
    const payload = { key: form.key.trim(), label: form.label.trim(), content: parsed, isActive: form.isActive };
    if (editing) {
      updateMutation.mutate({ id: editing, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Content Sections</h2>
        <button onClick={handleNew} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sections..."
          className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => { if (!isSaving) { setShowForm(false); setEditing(null); } }}>
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg p-6 border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit Section' : 'New Section'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Key *</label>
                <input type="text" value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Label</label>
                <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-400">Content (JSON)</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded disabled:opacity-60 transition">
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Upload Image
                  </button>
                </div>
                <textarea value={form.content} onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setJsonError(null); }} rows={8}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm font-mono resize-none" />
                {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="csActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="csActive" className="text-sm text-gray-300">Active</label>
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

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No sections found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Key</th>
                  <th className="text-left p-3 font-medium">Label</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sec => (
                  <tr key={sec._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="p-3 font-mono text-xs text-indigo-300">{sec.key}</td>
                    <td className="p-3 text-white">{sec.label || '-'}</td>
                    <td className="p-3">
                      {sec.isActive ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs"><Check className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-xs"><X className="w-3 h-3" /> Inactive</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(sec)} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-indigo-400 transition" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('Delete "' + sec.key + '"?')) deleteMutation.mutate(sec.key); }}
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

export default ContentSectionManager;
