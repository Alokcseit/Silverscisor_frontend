// src/components/customer/recommendations/PersonalizedSuggestions.jsx

import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { useRecommendations } from '../../../hooks/useRecommendations';
import { useSelector } from 'react-redux';

const PersonalizedSuggestions = ({ onServiceSelect }) => {
  const { personalizedSuggestions } = useRecommendations();
  const { user } = useSelector(state => state.auth);

  if (!user || personalizedSuggestions.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-gray-800 dark:text-gray-100">
            Just for {user?.username}
          </h3>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          {personalizedSuggestions.map((service) => (
            <div
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:shadow-md transition group"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {service.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {service.reason}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  ₹{service.price}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSuggestions;