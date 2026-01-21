

import React from 'react';

export const DecorativeSVG = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Soft gradient blobs - different positions from signup */}
      <div className="absolute -top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-rose-200/50 to-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-gradient-to-tr from-amber-200/50 to-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-gradient-to-l from-rose-100/30 to-amber-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-gradient-to-r from-amber-100/30 to-rose-100/30 rounded-full blur-3xl" />
      
      {/* Decorative SVG patterns - Hexagon pattern for login */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
        <defs>
          {/* Hexagon pattern */}
          <pattern id="hexagons-login" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <path 
              d="M28 0 L56 16.67 L56 50 L28 66.67 L0 50 L0 16.67 Z M28 100 L56 116.67 L56 83.33 L28 66.67 L0 83.33 L0 116.67 Z" 
              fill="none" 
              stroke="#be123c" 
              strokeWidth="0.5" 
              opacity="0.3"
            />
          </pattern>
          
          {/* Radial lines pattern */}
          <pattern id="radial-login" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="#d97706" opacity="0.4" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#d97706" strokeWidth="0.3" opacity="0.2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#d97706" strokeWidth="0.3" opacity="0.1" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#hexagons-login)" />
        <rect width="100%" height="100%" fill="url(#radial-login)" />
      </svg>

      {/* Floating decorative elements - Different icons for login */}
      {/* Top left - Mirror */}
      <div className="absolute top-16 left-12 animate-float">
        <div className="w-14 h-14 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-rose-500/10 flex items-center justify-center border border-white/60">
          <svg className="w-7 h-7 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="7" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </div>
      </div>

      {/* Top right - Hair dryer */}
      <div className="absolute top-24 right-16 animate-float-delayed">
        <div className="w-12 h-12 bg-white/70 backdrop-blur-md rounded-xl shadow-xl shadow-amber-500/10 flex items-center justify-center border border-white/60">
          <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10h4l3 8h7a3 3 0 0 0 0-6H7" />
            <circle cx="19" cy="12" r="2" />
            <path d="M3 10a2 2 0 0 1 2-2h2l1 2" />
          </svg>
        </div>
      </div>

      {/* Bottom left - Comb */}
      <div className="absolute bottom-28 left-20 animate-float-slow">
        <div className="w-12 h-12 bg-white/70 backdrop-blur-md rounded-xl shadow-xl shadow-rose-500/10 flex items-center justify-center border border-white/60">
          <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v4H4z" />
            <line x1="6" y1="8" x2="6" y2="20" />
            <line x1="10" y1="8" x2="10" y2="20" />
            <line x1="14" y1="8" x2="14" y2="20" />
            <line x1="18" y1="8" x2="18" y2="20" />
          </svg>
        </div>
      </div>

      {/* Bottom right - Flower/Spa */}
      <div className="absolute bottom-20 right-12 animate-float">
        <div className="w-11 h-11 bg-white/70 backdrop-blur-md rounded-xl shadow-xl shadow-amber-500/10 flex items-center justify-center border border-white/60">
          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8" />
            <path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8" />
            <path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0" />
            <path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0" />
          </svg>
        </div>
      </div>

      {/* Side floating elements */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 animate-float-delayed">
        <div className="w-9 h-9 bg-white/60 backdrop-blur-sm rounded-full shadow-lg shadow-rose-500/5 flex items-center justify-center border border-white/40">
          <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5L12 12l-4 2.5 1.5-4.5L6 7.5h4.5L12 3z" />
          </svg>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-8 animate-float-slow">
        <div className="w-7 h-7 bg-amber-100/60 rounded-full" />
      </div>
      
      <div className="absolute bottom-1/3 left-10 animate-float">
        <div className="w-5 h-5 bg-rose-100/60 rounded-full" />
      </div>

      {/* Corner decorative arcs */}
      <svg className="absolute top-0 left-0 w-48 h-48 text-rose-300/20" viewBox="0 0 200 200">
        <path d="M 0 0 Q 100 100 0 200" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 20 0 Q 100 80 20 160" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M 40 0 Q 100 60 40 120" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>

      <svg className="absolute bottom-0 right-0 w-48 h-48 text-amber-300/20 rotate-180" viewBox="0 0 200 200">
        <path d="M 0 0 Q 100 100 0 200" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 20 0 Q 100 80 20 160" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M 40 0 Q 100 60 40 120" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>

      {/* Diagonal decorative lines */}
      <svg className="absolute top-1/4 right-1/4 w-32 h-32 text-rose-200/20" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="20" y1="0" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <line x1="0" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default DecorativeSVG;
