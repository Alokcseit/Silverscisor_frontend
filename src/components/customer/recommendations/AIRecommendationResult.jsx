// src/components/customer/recommendations/AIRecommendationResult.jsx

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, CheckCircle, X, ChevronRight } from 'lucide-react';

const CategoryTab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
      active
        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {label} ({count})
  </button>
);

const ServiceCard = ({ item, onSelect, type }) => (
  <div
    onClick={() => onSelect(item, type)}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-rose-500 transition">
            {item.name}
          </h4>
          {/* Tags */}
          {item.tags?.map(tag => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                tag === 'Best Match'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : tag === 'Trending'
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
      </div>

      {/* Color swatch for hair color */}
      {item.colorCode && (
        <div
          className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0 ml-2"
          style={{ backgroundColor: item.colorCode }}
        />
      )}
    </div>

    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.duration}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">{item.confidence}% match</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-rose-500 dark:text-rose-400">₹{item.price}</span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

const AIRecommendationResult = ({ result, capturedImage, onServiceSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState('haircuts');

  if (!result) return null;

  const tabs = [
    { id: 'haircuts', label: 'Haircuts', data: result.recommendations.haircuts },
    { id: 'beardStyles', label: 'Beard', data: result.recommendations.beardStyles },
    { id: 'hairColors', label: 'Hair Color', data: result.recommendations.hairColors },
  ];

  const activeData = tabs.find(t => t.id === activeTab)?.data || [];

  const handleSelect = (service, type) => {
    onServiceSelect({
      ...service,
      type,
      aiRecommended: true
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 dark:from-slate-700 dark:to-slate-600 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Captured Photo */}
              {capturedImage && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
                  <img src={capturedImage} alt="Your photo" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-lg">AI Analysis Complete!</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    Face: {result.faceShape}
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    Skin: {result.skinTone}
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    Hair: {result.currentHairLength}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="self-start sm:self-auto p-2 hover:bg-white/20 rounded-lg transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map(tab => (
              <CategoryTab
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                count={tab.data.length}
              />
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="px-5 pb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {activeData.map(item => (
            <ServiceCard
              key={item.id}
              item={item}
              onSelect={handleSelect}
              type={activeTab}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationResult;