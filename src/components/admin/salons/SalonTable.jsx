// src/components/admin/salons/SalonTable.jsx

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, Loader } from 'lucide-react';
import { useAdminSalons, useBlockSalon } from '../../../hooks/useAdmin';
import SalonDetailModal from './SalonDetailModal';

const PLAN_BADGES = {
  free:     'bg-gray-700 text-gray-300',
  silver:   'bg-gray-600 text-gray-200',
  gold:     'bg-yellow-900/40 text-yellow-400',
  platinum: 'bg-purple-900/40 text-purple-400'
};

const SalonTable = () => {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockingId, setBlockingId] = useState(null);

  const { data, isLoading } = useAdminSalons({ search, plan: planFilter, page, limit: 15 });
  const blockMutation = useBlockSalon();

  const salons = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleBlock = async (salonId) => {
    const reason = prompt('Block reason:');
    if (!reason) return;
    await blockMutation.mutateAsync({ salonId, reason });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search salons..."
            className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              {['Salon Name', 'Owner', 'City', 'Plan', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Loader className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                </td>
              </tr>
            ) : salons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">No salons found</td>
              </tr>
            ) : (
              salons.map(salon => (
                <tr key={salon._id} className="hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium text-sm">{salon.salonName}</p>
                    <p className="text-gray-500 text-xs">{salon._id}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{salon.contact?.phone}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{salon.address?.city || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${PLAN_BADGES[salon.subscription?.plan] || PLAN_BADGES.free}`}>
                      {salon.subscription?.plan || 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-semibold ${salon.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {salon.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {salon.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSalon(salon)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {salon.isActive && (
                        <button
                          onClick={() => handleBlock(salon._id)}
                          disabled={blockMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <p className="text-gray-400 text-sm">Total: {data?.total || 0}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition">
            Prev
          </button>
          <span className="px-3 py-1.5 text-gray-400 text-sm">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition">
            Next
          </button>
        </div>
      </div>

      {selectedSalon && (
        <SalonDetailModal salon={selectedSalon} onClose={() => setSelectedSalon(null)} />
      )}
    </div>
  );
};

export default SalonTable;