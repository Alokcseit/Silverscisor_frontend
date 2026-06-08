// src/components/subscription/PlanBadge.jsx

import React from 'react';
import { Crown, Star, Zap, Gift } from 'lucide-react';

const PLAN_CONFIG = {
  free: {
    label: 'Free',
    icon: Gift,
    className: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    iconColor: 'text-gray-500'
  },
  silver: {
    label: 'Silver',
    icon: Star,
    className: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300',
    iconColor: 'text-gray-400'
  },
  gold: {
    label: 'Gold',
    icon: Crown,
    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    iconColor: 'text-yellow-500'
  },
  platinum: {
    label: 'Platinum',
    icon: Zap,
    className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    iconColor: 'text-purple-500'
  }
};

const PlanBadge = ({ plan = 'free', size = 'sm' }) => {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${config.className} ${
      size === 'sm' ? 'text-xs' : 'text-sm'
    }`}>
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${config.iconColor}`} />
      {config.label}
    </span>
  );
};

export default PlanBadge;