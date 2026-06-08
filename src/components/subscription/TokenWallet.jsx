// src/components/subscription/TokenWallet.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Zap, TrendingDown, Plus, MessageCircle, Camera, BarChart } from 'lucide-react';
import PlanBadge from './PlanBadge';

const TOKEN_PACKAGES = [
  { tokens: 100, price: 50, popular: false },
  { tokens: 500, price: 200, popular: true },
  { tokens: 1000, price: 350, popular: false }
];

const TOKEN_USAGE = [
  { icon: MessageCircle, label: 'WhatsApp message', cost: 1, color: 'text-green-500' },
  { icon: MessageCircle, label: 'SMS notification', cost: 2, color: 'text-blue-500' },
  { icon: Camera, label: 'AI Style analysis', cost: 5, color: 'text-purple-500' },
  { icon: BarChart, label: 'Analytics report', cost: 20, color: 'text-amber-500' }
];

const MOCK_HISTORY = [
  { type: 'debit', label: 'WhatsApp notification', amount: 1, date: 'Today, 10:30 AM', icon: MessageCircle },
  { type: 'debit', label: 'WhatsApp notification', amount: 1, date: 'Today, 09:15 AM', icon: MessageCircle },
  { type: 'credit', label: 'Monthly plan tokens', amount: 1500, date: 'Jun 1, 2026', icon: Zap },
  { type: 'debit', label: 'AI Style analysis', amount: 5, date: 'May 30, 2026', icon: Camera },
  { type: 'debit', label: 'SMS notification', amount: 2, date: 'May 29, 2026', icon: MessageCircle }
];

const TokenWallet = ({ onRecharge }) => {
  const { plan, tokenBalance } = useSelector(state => state.subscription);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Token Balance</p>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8" />
              <span className="text-5xl font-bold">{tokenBalance.toLocaleString()}</span>
            </div>
          </div>
          <PlanBadge plan={plan} size="md" />
        </div>

        <button
          onClick={onRecharge}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition mt-2"
        >
          <Plus className="w-4 h-4" />
          Add Tokens
        </button>
      </div>

      {/* Token Cost Reference */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Token Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOKEN_USAGE.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{item.cost} token{item.cost > 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Recharge */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Recharge</h3>
        <div className="grid grid-cols-3 gap-3">
          {TOKEN_PACKAGES.map((pkg, index) => (
            <button
              key={index}
              onClick={onRecharge}
              className={`relative p-4 rounded-xl border-2 text-center transition hover:-translate-y-0.5 ${
                pkg.popular
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-amber-300'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                  Best Value
                </span>
              )}
              <Zap className={`w-5 h-5 mx-auto mb-1 ${pkg.popular ? 'text-amber-500' : 'text-gray-400'}`} />
              <p className={`font-bold text-lg ${pkg.popular ? 'text-amber-600 dark:text-amber-400' : 'text-gray-800 dark:text-gray-100'}`}>
                {pkg.tokens}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">tokens</p>
              <p className={`font-bold mt-1 ${pkg.popular ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
                ₹{pkg.price}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-gray-500" />
          Transaction History
        </h3>
        <div className="space-y-3">
          {MOCK_HISTORY.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    item.type === 'credit'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      item.type === 'credit' ? 'text-green-600' : 'text-red-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${
                  item.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                }`}>
                  {item.type === 'credit' ? '+' : '-'}{item.amount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TokenWallet;