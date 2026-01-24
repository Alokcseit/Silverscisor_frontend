// src/util/AnimatedScissorsIcon.jsx

import React from 'react';

const AnimatedScissorsIcon = ({ size = 60, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Silver Gradient for Blades */}
          <linearGradient id="bladeSilver" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Gold Gradient for Handles */}
          <linearGradient id="handleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Top Blade Group (Rotates Down) --- */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-15 50 50; 0 50 50; -15 50 50"
            dur="1.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
          
          {/* Blade */}
          <path
            d="M50 50 L15 35 Q10 33 12 30 L50 42 Z"
            fill="url(#bladeSilver)"
            stroke="#64748B"
            strokeWidth="0.5"
          />
          {/* Handle Loop */}
          <path
            d="M50 42 L75 30 Q85 25 85 35 Q85 45 75 40 L55 48"
            fill="none"
            stroke="url(#handleGold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Finger Rest */}
          <path d="M85 35 Q92 32 95 38" stroke="url(#handleGold)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* --- Bottom Blade Group (Rotates Up) --- */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="15 50 50; 0 50 50; 15 50 50"
            dur="1.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />

          {/* Blade */}
          <path
            d="M50 50 L15 65 Q10 67 12 70 L50 58 Z"
            fill="url(#bladeSilver)"
            stroke="#64748B"
            strokeWidth="0.5"
          />
          {/* Handle Loop */}
          <path
            d="M50 58 L75 70 Q85 75 85 65 Q85 55 75 60 L55 52"
            fill="none"
            stroke="url(#handleGold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* --- Central Pivot Screw (Static) --- */}
        <circle cx="50" cy="50" r="4" fill="url(#handleGold)" stroke="#B45309" strokeWidth="1" />
        <path d="M48 50 L52 50 M50 48 L50 52" stroke="#B45309" strokeWidth="1" />

        {/* --- Cutting Sparkles (Only appears when closed) --- */}
        <g opacity="0">
          <animate
            attributeName="opacity"
            values="0; 0; 1; 0; 0"
            keyTimes="0; 0.4; 0.5; 0.6; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
          
          {/* Star 1 */}
          <path
            d="M15 50 L18 42 L21 50 L29 53 L21 56 L18 64 L15 56 L7 53 Z"
            fill="#FCD34D"
            filter="url(#glow)"
            transform="scale(0.6) translate(10, 10)"
          />
          
          {/* Star 2 (Small) */}
          <path
            d="M10 40 L12 36 L14 40 L18 41 L14 42 L12 46 L10 42 L6 41 Z"
            fill="white"
            filter="url(#glow)"
            opacity="0.8"
          />
        </g>

        {/* Speed Lines (Action Effect) */}
        <g opacity="0.5">
           <path d="M10 20 Q 5 25 10 30" stroke="white" strokeWidth="1" fill="none">
             <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.1s"/>
           </path>
           <path d="M10 80 Q 5 75 10 70" stroke="white" strokeWidth="1" fill="none">
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.1s"/>
           </path>
        </g>

      </svg>
    </div>
  );
};

export default AnimatedScissorsIcon;