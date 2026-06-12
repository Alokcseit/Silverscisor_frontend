// src/components/admin/dashboard/RevenueChart.jsx

import React, { useState } from 'react';
import { TrendingUp, Loader } from 'lucide-react';
import { useRevenue } from '../../../hooks/useAdmin';

const PLAN_COLORS = {
  free: '#6B7280',
  silver: '#9CA3AF',
  gold: '#F59E0B',
  platinum: '#8B5CF6'
};

const RevenueChart = () => {
  const [period, setPeriod] = useState('30');
  const { data, isLoading } = useRevenue(period);

  const revenueByPlan = data?.revenueByPlan || [];
  const totalRevenue = data?.totalRevenue || 0;

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white">Revenue Breakdown</h3>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="text-center mb-5">
            <p className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>

          <div className="space-y-3">
            {revenueByPlan.map(item => {
              const pct = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 capitalize font-medium">{item._id} Plan</span>
                    <span className="text-gray-400">₹{item.revenue.toLocaleString()} ({item.count} salons)</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: PLAN_COLORS[item._id] || '#6B7280'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueChart;
