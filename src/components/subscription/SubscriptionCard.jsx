// src/components/subscription/SubscriptionCard.jsx

import React from 'react';
import { Check, X, Crown, Star, Zap, Gift } from 'lucide-react';

const PLAN_ICONS = {
  free: Gift,
  silver: Star,
  gold: Crown,
  platinum: Zap
};

const PLAN_COLORS = {
  free: 'from-gray-400 to-gray-500',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-500 to-indigo-600'
};

const SubscriptionCard = ({ plan, isCurrentPlan, onSelect }) => {
  const Icon = PLAN_ICONS[plan.id] || Gift;
  const gradient = PLAN_COLORS[plan.id];

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden ${
      plan.popular
        ? 'border-amber-400 dark:border-amber-500'
        : isCurrentPlan
        ? 'border-green-400 dark:border-green-500'
        : 'border-gray-200 dark:border-gray-700'
    }`}>

      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold text-center py-1">
          ⭐ MOST POPULAR
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold text-center py-1">
          ✓ CURRENT PLAN
        </div>
      )}

      <div className={`p-6 ${plan.popular || isCurrentPlan ? 'pt-8' : ''}`}>
        {/* Plan Header */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white mb-4`}>
          <Icon className="w-4 h-4" />
          <span className="font-bold text-sm">{plan.name}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          {plan.price === 0 ? (
            <div>
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">FREE</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Forever free</p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl text-gray-500 dark:text-gray-400">₹</span>
                <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              {plan.tokens && (
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mt-1">
                  + {plan.tokens} tokens/month included
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                feature.included
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600 line-through'
              }`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => !isCurrentPlan && onSelect(plan)}
          disabled={isCurrentPlan}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            isCurrentPlan
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
              : plan.popular
              ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:scale-105`
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {isCurrentPlan
            ? '✓ Active Plan'
            : plan.price === 0
            ? 'Get Started Free'
            : `Upgrade to ${plan.name}`
          }
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;