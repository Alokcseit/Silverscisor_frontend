import React from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import AnimatedClipSVG from '../../util/AnimatedClipSVG'; 
import Ballpit from '../../util/Ballpit'; // Ballpit import kiya

const CustomerHeroSection = () => (
  <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 md:py-24 overflow-hidden min-h-[500px] md:min-h-[600px]">
    
    {/* Layer 1: Ballpit (Deepest Background) */}
    <div className="absolute inset-0 z-0">
      <Ballpit 
        count={60}
        gravity={0.01}
        friction={0.9975}
        wallBounce={0.95}
        followCursor={true}
        colors={['#A855F7', '#3B82F6', '#EC4899']} // Salon theme colors
      />
    </div>

    {/* Layer 2: Purani Image (Base Background) */}
    <div 
      className="absolute inset-0 opacity-50 dark:opacity-50 bg-cover bg-center bg-no-repeat z-10 pointer-events-none"
      style={{
        backgroundImage: "url('/src/assets/images/herosvg.png')",
      }}
    ></div>

    {/* Layer 3: Animated SVG (Scissors & Tools Overlay) */}
    <div className="absolute inset-0 z-20 opacity-50 pointer-events-none flex items-center justify-center">
       <AnimatedClipSVG />
    </div>

    {/* Layer 4: Decorative Blobs */}
    <div className="absolute top-5 left-5 w-16 h-16 md:w-32 md:h-32 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl opacity-20 animate-pulse z-25"></div>
    <div className="absolute bottom-5 right-5 w-20 h-20 md:w-40 md:h-40 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-20 animate-pulse z-25"></div>

    {/* Layer 5: Actual Content */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30">
      
      {/* Header Text Section */}
      <div className="text-center md:text-left mb-5 md:mb-14">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/60 dark:bg-gray-800/60 border border-purple-200 dark:border-purple-700 backdrop-blur-md mb-3 mx-auto md:mx-0">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-purple-700 dark:text-purple-300 uppercase">
                Premium Experience
            </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 leading-tight tracking-tight">
          BOOK YOUR <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 filter drop-shadow-sm">
            DREAM SALON
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto md:mx-0 md:border-l-4 md:border-purple-500 md:pl-4">
           Please come at a time that <span className="text-purple-600 dark:text-purple-400 font-bold underline decoration-wavy decoration-purple-300"> suits you best.</span>
        </p>
      </div>

      {/* Search Box Container */}
      <div className="max-w-lg mx-auto md:mx-0">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-xl shadow-purple-900/10 p-3 md:p-5 border border-white/40 dark:border-gray-700">
          
          {/* Location */}
          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-2 md:mb-3 text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            <span>Reddivaripalle, Andhra Pradesh</span>
          </div>

          {/* Search Input Group */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search salon..."
                className="w-full pl-8 md:pl-10 pr-2 py-2 md:py-3 border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base transition-all"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap text-xs md:text-base">
              SEARCH
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2 mt-3 md:mt-4">
            {['Nearby', 'Top Rated', 'Open Now'].map((filter) => (
               <button key={filter} className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs sm:text-sm bg-white/50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-purple-900/40 text-gray-600 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-300 rounded-md md:rounded-lg transition-colors font-medium border border-gray-100 dark:border-gray-600">
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
               <span key={item} className="px-2 py-0.5 md:px-3 md:py-1 bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] md:text-xs hover:bg-white hover:border-purple-300 cursor-pointer transition shadow-sm backdrop-blur-sm">
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