import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Trash2, Power, CalendarOff, RefreshCw, Database } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import axios from 'axios';
import Swal from 'sweetalert2';

const SALON_API = import.meta.env.VITE_SALON_API_URL || 'http://localhost:5002/api';
const CACHE_KEY = 'silverscissor_salon_settings_cache';

const SalonSettingsModal = ({ isOpen, onClose }) => {
  const { success, error } = useNotification();
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [holidayNote, setHolidayNote] = useState('');
  const [timeRanges, setTimeRanges] = useState([{ start: '10:00', end: '11:00' }]);
  const [offlineDate, setOfflineDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [cachedData, setCachedData, clearCachedData] = useLocalStorage(CACHE_KEY, {
    holidays: [],
    lastFetched: null
  });

  const getToken = () => localStorage.getItem('silverscissor_token');

  useEffect(() => {
    if (isOpen) {
      setIsOffline(false);
      if (cachedData.holidays?.length > 0) {
        setHolidays(cachedData.holidays);
      }
      fetchHolidays();
    }
  }, [isOpen]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const res = await axios.get(
        `${SALON_API}/salon/schedule?startDate=${today.toISOString()}&endDate=${endDate.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const holidayData = res.data.data.filter((s) => s.isHoliday);
      setHolidays(holidayData);
      setCachedData({ holidays: holidayData, lastFetched: new Date().toISOString() });
      setIsOffline(false);
    } catch (err) {
      if (!cachedData.holidays?.length) {
        console.error('Failed to fetch holidays and no cache available:', err);
      }
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async () => {
    if (!selectedDate) return;
    try {
      const token = getToken();
      await axios.post(
        `${SALON_API}/salon/holiday`,
        { date: selectedDate, note: holidayNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Holiday set successfully!');
      setSelectedDate('');
      setHolidayNote('');
      fetchHolidays();
    } catch (err) {
      error('Failed to set holiday');
    }
  };

  const handleRemoveHoliday = async (date) => {
    try {
      const token = getToken();
      await axios.delete(
        `${SALON_API}/salon/holiday`,
        { headers: { Authorization: `Bearer ${token}` }, data: { date } }
      );
      success('Holiday removed');
      fetchHolidays();
    } catch (err) {
      error('Failed to remove holiday');
    }
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { start: '12:00', end: '13:00' }]);
  };

  const handleRemoveTimeRange = (index) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  const handleTimeRangeChange = (index, field, value) => {
    const updated = [...timeRanges];
    updated[index][field] = value;
    setTimeRanges(updated);
  };

  const handleSetOffline = async () => {
    if (!offlineDate || timeRanges.length === 0) return;
    try {
      const token = getToken();
      await axios.put(
        `${SALON_API}/salon/offline-slots`,
        { date: offlineDate, timeRanges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Offline slots updated!');
      setOfflineDate('');
      setTimeRanges([{ start: '10:00', end: '11:00' }]);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update offline slots');
    }
  };

  const handleResetServer = () => {
    Swal.fire({
      title: 'Reset All Server Data?',
      text: 'This will permanently delete all holidays and offline slots from the server.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete all',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getToken();
          await axios.delete(`${SALON_API}/salon/settings/reset`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          clearCachedData();
          setHolidays([]);
          setIsOffline(false);
          success('All settings reset on server');
        } catch (err) {
          error('Failed to reset server data');
        }
      }
    });
  };

  const handleResetCache = () => {
    Swal.fire({
      title: 'Reset Local Cache?',
      text: 'This will clear locally stored settings. Server data will not be affected.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reset',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCachedData();
        setHolidays([]);
        setIsOffline(false);
        success('Local settings cache cleared');
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-white px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Settings
          </h2>
          <div className="flex items-center gap-2">
            {cachedData.lastFetched && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1" title={`Last synced: ${new Date(cachedData.lastFetched).toLocaleString()}`}>
                <Database className="w-3 h-3" />
                Cached
              </span>
            )}
            {isOffline && cachedData.holidays?.length > 0 && (
              <span className="text-xs bg-yellow-400/30 text-yellow-100 px-2 py-1 rounded-full flex items-center gap-1">
                Offline Mode
              </span>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-8">
          {/* Holiday Management */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-orange-500 pb-2">
              <CalendarOff className="w-5 h-5 text-orange-600" />
              Holiday / Full Day Off
            </h3>

            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
              />
              <input
                type="text"
                value={holidayNote}
                onChange={(e) => setHolidayNote(e.target.value)}
                placeholder="Reason (optional)"
                className="flex-1 min-w-[200px] px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={handleAddHoliday}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-5 py-2.5 rounded-lg hover:from-orange-700 hover:to-red-600 transition font-semibold shadow-md"
              >
                <CalendarOff className="w-4 h-4" />
                Mark Holiday
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : holidays.length > 0 ? (
              <div className="space-y-2">
                {holidays.map((h) => (
                  <div key={h._id} className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 px-4 py-3 rounded-lg border border-red-200 dark:border-red-500/20">
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {new Date(h.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {h.holidayNote && (
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">— {h.holidayNote}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(h.date)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No holidays set for the next 30 days.</p>
            )}
          </div>

          {/* Offline Time Slots */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b-2 border-amber-500 pb-2">
              <Power className="w-5 h-5 text-amber-600" />
              Offline Time Slots
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Mark specific time ranges as offline so customers can't book during those hours.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
              <input
                type="date"
                value={offlineDate}
                onChange={(e) => setOfflineDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 dark:text-gray-200"
              />
            </div>

            <div className="space-y-3 mb-4">
              {timeRanges.map((range, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="time"
                    value={range.start}
                    onChange={(e) => handleTimeRangeChange(i, 'start', e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 dark:text-gray-200"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={range.end}
                    onChange={(e) => handleTimeRangeChange(i, 'end', e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 dark:text-gray-200"
                  />
                  {timeRanges.length > 1 && (
                    <button
                      onClick={() => handleRemoveTimeRange(i)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddTimeRange}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Time Range
              </button>
              <button
                onClick={handleSetOffline}
                disabled={!offlineDate}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-5 py-2.5 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition font-semibold shadow-md disabled:opacity-50"
              >
                <Power className="w-4 h-4" />
                Set Offline
              </button>
            </div>
          </div>
          {/* Reset Cache */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Local Cache</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cachedData.lastFetched
                    ? `Last synced: ${new Date(cachedData.lastFetched).toLocaleString()}`
                    : 'No cached data'}
                </p>
              </div>
              <button
                onClick={handleResetCache}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Cache
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Server Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reset all holidays &amp; offline slots</p>
              </div>
              <button
                onClick={handleResetServer}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonSettingsModal;
