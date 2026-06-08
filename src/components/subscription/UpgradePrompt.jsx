// src/components/subscription/UpgradePrompt.jsx

import React from 'react';
import { Crown, X, Zap } from 'lucide-react';

const UpgradePrompt = ({ isOpen, onClose, onUpgrade, feature, requiredPlan }) => {
  if (!isOpen) return null;

  const PLAN_COLORS = {
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-purple-500 to-indigo-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Gradient Top */}
        <div className={`bg-gradient-to-r ${PLAN_COLORS[requiredPlan] || PLAN_COLORS.gold} p-6 text-center`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <Crown className="w-10 h-10 text-white mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">
            {requiredPlan?.charAt(0).toUpperCase() + requiredPlan?.slice(1)} Plan Required
          </h3>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
            "{feature}" ke liye upgrade karein
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Yeh feature {requiredPlan} plan mein available hai. Abhi upgrade karein aur apne salon ko grow karein!
          </p>

          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${PLAN_COLORS[requiredPlan] || PLAN_COLORS.gold} text-white py-3 rounded-xl font-bold hover:opacity-90 transition`}
            >
              <Zap className="w-5 h-5" />
              Upgrade to {requiredPlan?.charAt(0).toUpperCase() + requiredPlan?.slice(1)}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              Baad mein karenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;