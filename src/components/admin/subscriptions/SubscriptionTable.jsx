// src/components/admin/subscriptions/SubscriptionTable.jsx

import React, { useState } from 'react';
import { Zap, Loader } from 'lucide-react';
import { useAdminSubscriptions } from '../../../hooks/useAdmin';
import PlanUpdateModal from './PlanUpdateModal';

const PLAN_BADGES = {
  free:     'bg-gray-700 text-gray-300',
  silver:   'bg-gray-600 text-gray-200',
  gold:     'bg-yellow-900/40 text-yellow-400',
  platinum: 'bg-purple-900/40 text-purple-400'
};

const SubscriptionTable = () => {
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSub, setSelectedSub] = useState(null);

  const { data, isLoading } = useAdminSubscriptions({ plan: planFilter, page, limit: 15 });
  const subs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const revenue = data?.revenue || [];

  const totalRevenue = revenue.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);

  return (
    <div className="space-y-4">
      {/* Revenue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['free', 'silver', 'gold', 'platinum'].map(plan => {
          const r = revenue.find(rv => rv._id === plan);
          return (
            <div key={plan} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className={`text-xs font-semibold uppercase mb-2 ${PLAN_BADGES[plan].split(' ')[1]}`}>{plan}</p>
              <p className="text-2xl font-bold text-white">{r?.count || 0}</p>
              <p className="text-gray-400 text-xs">₹{(r?.totalRevenue || 0).toLocaleString()}/mo</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Subscriptions</h3>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                {['Salon', 'Plan', 'Token Balance', 'Billing Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-12"><Loader className="w-6 h-6 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No subscriptions found</td></tr>
              ) : (
                subs.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{sub.salonName || sub.salonId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${PLAN_BADGES[sub.plan] || PLAN_BADGES.free}`}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Zap className="w-3 h-3" />
                        <span className="text-sm font-semibold">{sub.tokenBalance || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${sub.billing?.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {sub.billing?.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="text-xs px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
      </div>

      {selectedSub && (
        <PlanUpdateModal sub={selectedSub} onClose={() => setSelectedSub(null)} />
      )}
    </div>
  );
};

export default SubscriptionTable;