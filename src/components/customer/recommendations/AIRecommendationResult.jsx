// src/components/customer/recommendations/AIRecommendationResult.jsx

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, X } from 'lucide-react';

const CategoryTab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
      active
        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {label} ({count})
  </button>
);

const ServiceCard = ({ item, onSelect, type, isAIGenerated, capturedImage, generating }) => {
  const isStockPhoto = item.image && item.image.includes('unsplash');
  const hasNoImage = !item.image;
  const useCaptured = (isStockPhoto || hasNoImage) && capturedImage;
  const displayImage = useCaptured ? capturedImage : item.image;
  const isWaitingForAI = useCaptured && generating;

  return (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group flex flex-col">
    <div
      onClick={() => onSelect(item, type)}
      className="relative h-36 sm:h-44 overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
    >
      {displayImage ? (
        <>
          <img
            src={displayImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {isAIGenerated && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI
            </div>
          )}
          {isWaitingForAI && !isAIGenerated && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Generating AI...
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{item.name}</h4>
      </div>
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-1">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
        {item.tags?.map(tag => (
          <span
            key={tag}
            className={`text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
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
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 flex-1">{item.description}</p>
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1 sm:gap-2">
          <Clock className="w-3 h-3" />
          {item.duration}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">{item.confidence}%</span>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
        <span className="font-bold text-rose-500 dark:text-rose-400 text-sm sm:text-base">₹{item.price}</span>
        <button
          onClick={() => onSelect(item, type)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:from-rose-600 hover:to-amber-600 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Book at Salon
        </button>
      </div>
    </div>
  </div>
  );
};

const AIRecommendationResult = ({ result, capturedImage, onServiceSelect, onClose, generating, onGenerateAIPhotos }) => {
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

  const hasAIImage = (item) => item.image && item.image.startsWith('http') && !item.image.includes('unsplash');

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 dark:from-slate-700 dark:to-slate-600 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Captured Photo */}
              {capturedImage && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 sm:border-3 border-white shadow-lg flex-shrink-0">
                  <img src={capturedImage} alt="Your photo" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                  <h3 className="font-bold text-white text-base sm:text-lg truncate">AI Analysis Complete!</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] sm:text-xs bg-white/20 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Face: {result.faceShape}
                  </span>
                  <span className="text-[10px] sm:text-xs bg-white/20 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Skin: {result.skinTone}
                  </span>
                  <span className="text-[10px] sm:text-xs bg-white/20 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Hair: {result.currentHairLength}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onGenerateAIPhotos && (
                <button
                  onClick={onGenerateAIPhotos}
                  disabled={generating}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {generating ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating AI...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> AI Photos</>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition text-white flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-2">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
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
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {activeData.map(item => (
            <ServiceCard
              key={item.id}
              item={item}
              onSelect={handleSelect}
              type={activeTab}
              isAIGenerated={hasAIImage(item)}
              capturedImage={capturedImage}
              generating={generating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationResult;