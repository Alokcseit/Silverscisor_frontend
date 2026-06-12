// src/components/admin/dashboard/OverviewCards.jsx

import React from 'react';
import { Store, Users, CreditCard, TrendingUp, Loader } from 'lucide-react';
import { useOverview } from '../../../hooks/useAdmin';

const StatCard = ({ icon: Icon, label, value, sub, color, loading }) => (
  <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    {loading ? (
      <div className="h-8 bg-gray-700 rounded animate-pulse mb-2" />
    ) : (
      <p className="text-3xl font-bold text-white mb-1">{value ?? '-'}</p>
    )}
    <p className="text-gray-400 text-sm font-medium">{label}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const OverviewCards = () => {
  const { data, isLoading } = useOverview();

  const breakdown = data?.subscriptions?.breakdown || {};
  const totalSalons = data?.subscriptions?.totalSalons || 0;
  const paidSalons = data?.subscriptions?.totalPaidSalons || 0;
  const revenue = data?.subscriptions?.monthlyRevenue || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={Store}
        label="Total Salons"
        value={totalSalons}
        sub={`${paidSalons} paid`}
        color="bg-indigo-600"
        loading={isLoading}
      />
      <StatCard
        icon={CreditCard}
        label="Monthly Revenue"
        value={`₹${(revenue / 1000).toFixed(1)}K`}
        sub="Subscription revenue"
        color="bg-emerald-600"
        loading={isLoading}
      />
      <StatCard
        icon={TrendingUp}
        label="Gold + Platinum"
        value={(breakdown.gold || 0) + (breakdown.platinum || 0)}
        sub="Premium subscribers"
        color="bg-amber-600"
        loading={isLoading}
      />
      <StatCard
        icon={Users}
        label="Free Plan"
        value={breakdown.free || 0}
        sub="Potential upgrades"
        color="bg-purple-600"
        loading={isLoading}
      />
    </div>
  );
};

export default OverviewCards;