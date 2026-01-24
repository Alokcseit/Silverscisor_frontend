import React from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';

const CustomerHeroSection = () => (
  // Change 1: Very compact padding on mobile (py-6)
  <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 md:py-24 overflow-hidden">
    
    {/* Background Pattern/Image */}
    <div 
      className="absolute inset-0 opacity-70 dark:opacity-70 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/images/herosvg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>

    {/* Decorative Elements - Smaller blobs on mobile */}
    <div className="absolute top-5 left-5 w-16 h-16 md:w-32 md:h-32 bg-purple-300 dark:bg-purple-900 rounded-full blur-2xl opacity-30 animate-pulse"></div>
    <div className="absolute bottom-5 right-5 w-20 h-20 md:w-40 md:h-40 bg-blue-300 dark:bg-blue-900 rounded-full blur-2xl opacity-30 animate-pulse"></div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Text Section - Reduced margins */}
      <div className="text-center md:text-left mb-5 md:mb-14 relative z-10">
        
        {/* Badge - Smaller padding */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/50 dark:bg-gray-800/50 border border-purple-200 dark:border-purple-700 backdrop-blur-sm mb-3 mx-auto md:mx-0">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300 uppercase">
                Premium Experience
            </span>
        </div>

        {/* Title - Significantly smaller on mobile (text-2xl) */}
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 leading-tight tracking-tight">
          BOOK YOUR <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 filter drop-shadow-sm">
            DREAM SALON
          </span>
        </h2>

        {/* Subtitle - Smaller text (text-sm) */}
        <p className="text-sm sm:text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto md:mx-0 md:border-l-4 md:border-purple-500 md:pl-4">
           Please come at a time that <span className="text-purple-600 dark:text-purple-400 font-bold underline decoration-wavy decoration-purple-300"> suits you best.</span>
        </p>
      </div>

      {/* Search Box Container - Centered and Compact */}
      <div className="max-w-lg mx-auto md:mx-0">
        {/* Change 2: Reduced internal padding (p-3) */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg shadow-purple-900/10 p-3 md:p-5 border border-white/20 dark:border-gray-700">
          
          {/* Location - Smaller text */}
          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-2 md:mb-3 text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            <span>Reddivaripalle, Andhra Pradesh</span>
          </div>

          {/* Search Input Group */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              {/* Change 3: Reduced input height (py-2) and font size */}
              <input
                type="text"
                placeholder="Search salon..."
                className="w-full pl-8 md:pl-10 pr-2 py-2 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base transition-all"
              />
            </div>
            {/* Change 4: Smaller button on mobile */}
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:scale-105 transition-all duration-200 whitespace-nowrap text-xs md:text-base">
              SEARCH
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2 mt-3 md:mt-4">
            {['Nearby', 'Top Rated', 'Open Now'].map((filter) => (
               <button key={filter} className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs sm:text-sm bg-gray-100 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-purple-900/40 text-gray-600 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-300 rounded-md md:rounded-lg transition-colors font-medium">
                 {filter}
               </button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-3 md:mt-6 text-center md:text-left">
          <p className="text-gray-500 dark:text-gray-400 mb-1.5 font-medium text-[10px] md:text-sm">Trending Searches:</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
            {['Haircut', 'Beard Styling', 'Facial'].map((item) => (
               <span key={item} className="px-2 py-0.5 md:px-3 md:py-1 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] md:text-xs hover:bg-white hover:border-purple-300 cursor-pointer transition shadow-sm">
                 {item}
               </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerHeroSection;