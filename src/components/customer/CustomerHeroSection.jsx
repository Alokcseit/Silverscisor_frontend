import React from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react'; // Added Sparkles icon

const CustomerHeroSection = () => (
  <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24 overflow-hidden">
    {/* Background Pattern/Image */}
    <div 
      className="absolute inset-0 opacity-70 dark:opacity-70 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/images/herosvg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>

    {/* Decorative Elements - Background Blobs */}
    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center md:text-left mb-10 md:mb-14 relative z-10">
        
        {/* Small Badge above title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 border border-purple-200 dark:border-purple-700 backdrop-blur-sm mb-4 mx-auto md:mx-0">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300 uppercase">
                Premium Experience
            </span>
        </div>

        {/* Main Title with Gradient and split effect */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          BOOK YOUR <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 filter drop-shadow-sm">
            DREAM SALON
          </span>
        </h2>

        {/* Subtitle with better spacing and color */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto md:mx-0 border-l-4 border-purple-500 pl-4 md:border-none md:pl-0">
           Please come at a time that <span className="text-purple-600 dark:text-purple-400 font-bold underline decoration-wavy decoration-purple-300"> suits you best.</span>
        </p>
      </div>

      {/* Search Box - Left Aligned (Same as before) */}
      <div className="max-w-lg">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/10 p-5 border border-white/20 dark:border-gray-700">
          {/* Location Indicator */}
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Reddivaripalle, Andhra Pradesh</span>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search salon..."
                className="w-full pl-10 sm:pl-11 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base transition-all"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-lg transition-all duration-200 whitespace-nowrap text-sm sm:text-base">
              SEARCH
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Nearby', 'Top Rated', 'Open Now'].map((filter) => (
               <button key={filter} className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-purple-900/40 text-gray-600 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-300 rounded-lg transition-colors font-medium">
                 {filter}
               </button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-6 text-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Trending Searches:</p>
          <div className="flex flex-wrap gap-2">
            {['Haircut', 'Beard Styling', 'Facial'].map((item) => (
               <span key={item} className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-white hover:border-purple-300 cursor-pointer transition shadow-sm">
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