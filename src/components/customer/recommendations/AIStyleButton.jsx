// src/components/customer/recommendations/AIStyleButton.jsx

import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

const AIStyleButton = ({ onClick }) => (
  <div className="max-w-7xl mx-auto px-4 py-4">
    <button
      onClick={onClick}
      className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-2xl p-4 sm:p-5 hover:from-rose-100 hover:to-amber-100 dark:hover:from-rose-900/30 dark:hover:to-amber-900/30 transition group gap-3"
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition flex-shrink-0">
          <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">
              AI Style Recommendation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-none">
            Click your photo and get personalized haircut, beard & color suggestions
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {['Face Shape', 'Skin Tone', 'Hair Style'].map(tag => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-1.5 sm:px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 self-end sm:self-auto w-full sm:w-auto">
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md group-hover:shadow-lg transition text-center sm:text-left">
          Try Now
        </div>
      </div>
    </button>
  </div>
);

export default AIStyleButton;