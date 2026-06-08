// src/components/customer/recommendations/RecommendedServices.jsx

import React from 'react';
import { Star, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useRecommendations } from '../../../hooks/useRecommendations';

const RecommendedServices = ({ onServiceSelect }) => {
  const { recommendedServices, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Recommended for You
          </h2>
        </div>
        <button className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
          See all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recommended Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedServices.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
          >
            {/* Score Badge */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  {service.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {service.reason}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                {Math.round(service.score * 100)}%
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
              </div>
              <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                ₹{service.price}
              </span>
            </div>

            {/* Book Button (on hover) */}
            <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-purple-700 hover:to-blue-700">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedServices;