'use client';

import React from 'react';

export const DecorativeSVGSignup = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Soft gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-amber-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/40 to-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-100/20 to-orange-100/20 rounded-full blur-3xl" />
      
      {/* Decorative SVG patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
        <defs>
          {/* Dot pattern */}
          <pattern id="dots-signup" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#e11d48" opacity="0.4" />
          </pattern>
          
          {/* Grid pattern */}
          <pattern id="grid-signup" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e11d48" strokeWidth="0.5" opacity="0.2" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#dots-signup)" />
        <rect width="100%" height="100%" fill="url(#grid-signup)" />
      </svg>

      {/* Floating decorative elements */}
      {/* Top left - Scissors */}
      <div className="absolute top-20 left-16 animate-float">
        <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-500/10 flex items-center justify-center border border-white/50">
          <svg className="w-7 h-7 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        </div>
      </div>

      {/* Top right - Sparkles */}
      <div className="absolute top-32 right-20 animate-float-delayed">
        <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center border border-white/50">
          <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.1-.7-.7.7m-12.1 11.3.7-.7m12.1.7-.7-.7" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      </div>

      {/* Bottom left - Heart/Spa */}
      <div className="absolute bottom-32 left-24 animate-float-slow">
        <div className="w-11 h-11 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg shadow-rose-500/10 flex items-center justify-center border border-white/50">
          <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>

      {/* Bottom right - Star */}
      <div className="absolute bottom-24 right-16 animate-float-delayed">
        <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-lg shadow-lg shadow-amber-500/10 flex items-center justify-center border border-white/50">
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      {/* Middle decorative elements */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 animate-float-slow">
        <div className="w-8 h-8 bg-rose-100/50 rounded-full" />
      </div>
      <div className="absolute top-1/3 right-12 animate-float">
        <div className="w-6 h-6 bg-amber-100/50 rounded-full" />
      </div>

      {/* Curved decorative lines */}
      <svg className="absolute top-0 right-0 w-64 h-64 text-rose-200/30" viewBox="0 0 200 200">
        <path d="M 0 100 Q 100 0 200 100" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 0 120 Q 100 20 200 120" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 0 140 Q 100 40 200 140" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <svg className="absolute bottom-0 left-0 w-64 h-64 text-amber-200/30 rotate-180" viewBox="0 0 200 200">
        <path d="M 0 100 Q 100 0 200 100" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 0 120 Q 100 20 200 120" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 0 140 Q 100 40 200 140" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default DecorativeSVGSignup;
