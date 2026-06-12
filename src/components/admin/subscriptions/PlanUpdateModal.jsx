// src/components/admin/subscriptions/PlanUpdateModal.jsx

import React, { useState } from 'react';
import { X, Zap, Crown } from 'lucide-react';
import { useUpdatePlan, useAddTokens } from '../../../hooks/useAdmin';
import { useNotification } from '../../../context/NotificationContext';

const PLANS = ['free', 'silver', 'gold', 'platinum'];

const PlanUpdateModal = ({ sub, onClose }) => {
  const { success } = useNotification();
  const [selectedPlan, setSelectedPlan] = useState(sub.plan);
  const [reason, setReason] = useState('');
  const [tokens, setTokens] = useState('');
  const [activeTab, setActiveTab] = useState('plan');

  const updatePlanMutation = useUpdatePlan();
  const addTokensMutation = useAddTokens();

  const handleUpdatePlan = async () => {
    await updatePlanMutation.mutateAsync({
      salonId: sub.salonId,
      plan: selectedPlan,
      reason
    });
    success('Plan updated successfully!');
    onClose();
  };

  const handleAddTokens = async () => {
    if (!tokens || parseInt(tokens) <= 0) return;
    await addTokensMutation.mutateAsync({
      salonId: sub.salonId,
      tokens: parseInt(tokens),
      reason
    });
    success(`${tokens} tokens added!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Manage Subscription</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Salon Info */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-gray-400 text-sm">Salon: <span className="text-white font-medium">{sub.salonName || sub.salonId}</span></p>
          <p className="text-gray-400 text-sm">Current Plan: <span className="text-white font-medium capitalize">{sub.plan}</span></p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-5">
          <button onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'plan' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            <Crown className="w-4 h-4" /> Update Plan
          </button>
          <button onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'tokens' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            <Zap className="w-4 h-4" /> Add Tokens
          </button>
        </div>

        <div className="p-5 space-y-4">
          {activeTab === 'plan' ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {PLANS.map(plan => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold capitalize transition ${
                      selectedPlan === plan
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Reason (optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Reason for plan change..."
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleUpdatePlan}
                disabled={updatePlanMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {updatePlanMutation.isPending ? 'Updating...' : 'Update Plan'}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tokens to Add</label>
                <input
                  type="number"
                  value={tokens}
                  onChange={e => setTokens(e.target.value)}
                  placeholder="Enter token amount"
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-amber-500 text-sm placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Reason (optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Reason for adding tokens..."
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-amber-500 text-sm placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleAddTokens}
                disabled={addTokensMutation.isPending || !tokens}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {addTokensMutation.isPending ? 'Adding...' : `Add ${tokens || 0} Tokens`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanUpdateModal;