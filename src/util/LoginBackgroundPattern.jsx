// src/util/LoginBackgroundPattern.jsx

import React from 'react';

const LoginBackgroundPattern = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      
      {/* 1. Base Background Color (Light/Dark Switch) */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-slate-950 transition-colors duration-500" />

      {/* 2. Main SVG Pattern */}
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Light Mode Gradients */}
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-rose-200 dark:stop-color-rose-900/40" stopOpacity="0.6" />
            <stop offset="100%" className="stop-color-amber-100 dark:stop-color-amber-900/30" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className="stop-color-blue-100 dark:stop-color-blue-900/30" stopOpacity="0.5" />
            <stop offset="100%" className="stop-color-purple-100 dark:stop-color-purple-900/30" stopOpacity="0.5" />
          </linearGradient>

          {/* Grid Pattern Definition */}
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* --- Grid Overlay --- */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* --- Abstract Floating Blobs (Fluid Shapes) --- */}
        
        {/* Top Right Blob */}
        <path
          d="M1000 0 C1200 100 1400 50 1600 200 V0 H1000 Z"
          fill="url(#grad1)"
          className="transition-all duration-1000 ease-in-out"
          style={{ opacity: 0.8 }}
        >
          <animate 
             attributeName="d" 
             dur="10s" 
             repeatCount="indefinite" 
             values="M1000 0 C1200 100 1400 50 1600 200 V0 H1000 Z; M900 0 C1100 150 1300 0 1600 150 V0 H900 Z; M1000 0 C1200 100 1400 50 1600 200 V0 H1000 Z"
          />
        </path>

        {/* Bottom Left Blob */}
        <path
          d="M0 600 C200 500 400 700 600 800 V1000 H0 V600 Z"
          fill="url(#grad2)"
          className="transition-all duration-1000 ease-in-out"
          style={{ opacity: 0.8 }}
        >
           <animate 
             attributeName="d" 
             dur="12s" 
             repeatCount="indefinite" 
             values="M0 600 C200 500 400 700 600 800 V1000 H0 V600 Z; M0 500 C300 400 500 800 700 900 V1000 H0 V500 Z; M0 600 C200 500 400 700 600 800 V1000 H0 V600 Z"
          />
        </path>

        {/* Center Accent Circle (Glow) */}
        <circle cx="50%" cy="50%" r="300" fill="url(#grad1)" filter="blur(80px)" opacity="0.4">
           <animate attributeName="opacity" values="0.3;0.5;0.3" dur="5s" repeatCount="indefinite" />
        </circle>

      </svg>
      
      {/* Optional: Floating Particles/Sparkles */}
      <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-amber-400 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute bottom-10 left-10 w-4 h-4 bg-purple-400 rounded-full blur-sm animate-bounce opacity-30"></div>
      </div>

    </div>
  );
};

export default LoginBackgroundPattern;