// src/components/customer/recommendations/TrendingNearYou.jsx

import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { useRecommendations } from '../../../hooks/useRecommendations';

const TrendingNearYou = ({ onServiceSelect }) => {
  const { trendingServices } = useRecommendations();

  return (
    <div className="flex items-center gap-2 flex-wrap mt-4">
      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="font-medium">Trending:</span>
      </div>

      {trendingServices.map((service) => (
        <button
          key={service.id}
          onClick={() => onServiceSelect && onServiceSelect(service)}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/40 transition border border-orange-200 dark:border-orange-800"
        >
          <TrendingUp className="w-3 h-3" />
          {service.name}
          <span className="text-xs opacity-70">({service.bookingsToday} today)</span>
        </button>
      ))}
    </div>
  );
};

export default TrendingNearYou;