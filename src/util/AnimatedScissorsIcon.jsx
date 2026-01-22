"use client";

export default function AnimatedScissorsIcon({ 
  size = 50, 
  color = "currentColor",
  speed = "normal" // slow, normal, fast
}) {
  const duration = speed === "slow" ? "2s" : speed === "fast" ? "0.6s" : "1s";
  
  return (
    <svg
      width={size*1.}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animated-scissors"
    >
      <defs>
        {/* Gradient for premium look */}
        <linearGradient id="scissorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        
        {/* Shine effect */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Drop shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Center pivot point decoration */}
      <circle cx="50" cy="50" r="6" fill="url(#scissorGradient)" filter="url(#shadow)">
        <animate
          attributeName="r"
          values="6;7;6"
          dur={duration}
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="50" r="3" fill="white" opacity="0.6" />
      
      {/* Decorative ring around pivot */}
      <circle 
        cx="50" 
        cy="50" 
        r="9" 
        fill="none" 
        stroke={color} 
        strokeWidth="1" 
        opacity="0.3"
        strokeDasharray="2 2"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Top blade group */}
      <g filter="url(#shadow)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50; -15 50 50; 0 50 50"
          dur={duration}
          repeatCount="indefinite"
        />
        
        {/* Top blade - unique curved design */}
        <path
          d="M50 50 
             Q 55 45, 70 30 
             Q 80 20, 85 15
             Q 88 12, 86 10
             Q 84 8, 80 12
             Q 70 22, 55 42
             Q 52 46, 50 50"
          fill="url(#scissorGradient)"
          stroke={color}
          strokeWidth="1"
        />
        
        {/* Top blade inner edge */}
        <path
          d="M50 50 
             Q 48 44, 58 28 
             Q 65 18, 72 12
             Q 75 9, 78 11"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.4"
        />
        
        {/* Top finger ring - ergonomic design */}
        <ellipse cx="82" cy="8" rx="8" ry="6" fill="none" stroke="url(#scissorGradient)" strokeWidth="3">
          <animate
            attributeName="stroke-width"
            values="3;3.5;3"
            dur={duration}
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="82" cy="8" rx="5" ry="3.5" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        
        {/* Shine on top blade */}
        <path
          d="M55 42 Q 65 30, 75 18"
          fill="none"
          stroke="url(#shineGradient)"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.6;0.9;0.6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      
      {/* Bottom blade group */}
      <g filter="url(#shadow)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50; 15 50 50; 0 50 50"
          dur={duration}
          repeatCount="indefinite"
        />
        
        {/* Bottom blade - unique curved design */}
        <path
          d="M50 50 
             Q 55 55, 70 70 
             Q 80 80, 85 85
             Q 88 88, 86 90
             Q 84 92, 80 88
             Q 70 78, 55 58
             Q 52 54, 50 50"
          fill="url(#scissorGradient)"
          stroke={color}
          strokeWidth="1"
        />
        
        {/* Bottom blade inner edge */}
        <path
          d="M50 50 
             Q 48 56, 58 72 
             Q 65 82, 72 88
             Q 75 91, 78 89"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.4"
        />
        
        {/* Bottom finger ring - ergonomic with thumb rest */}
        <ellipse cx="82" cy="92" rx="8" ry="6" fill="none" stroke="url(#scissorGradient)" strokeWidth="3">
          <animate
            attributeName="stroke-width"
            values="3;3.5;3"
            dur={duration}
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="82" cy="92" rx="5" ry="3.5" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        
        {/* Thumb rest bump */}
        <path
          d="M88 88 Q 92 90, 90 94"
          fill="none"
          stroke="url(#scissorGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Shine on bottom blade */}
        <path
          d="M55 58 Q 65 70, 75 82"
          fill="none"
          stroke="url(#shineGradient)"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.6;0.9;0.6"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.75s"
          />
        </path>
      </g>
      
      {/* Cutting sparkle effects */}
      <g>
        <circle cx="35" cy="50" r="1.5" fill={color} opacity="0">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur={duration}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="0;2;0"
            dur={duration}
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="30" cy="45" r="1" fill={color} opacity="0">
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur={duration}
            repeatCount="indefinite"
            begin="0.2s"
          />
        </circle>
        <circle cx="32" cy="55" r="1" fill={color} opacity="0">
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur={duration}
            repeatCount="indefinite"
            begin="0.4s"
          />
        </circle>
      </g>
      
      {/* Mini star sparkles */}
      <g opacity="0.7">
        <path d="M25 50 L27 48 L25 46 L23 48 Z" fill={color}>
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="0.5;1;0.5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M20 42 L21 41 L20 40 L19 41 Z" fill={color}>
          <animate
            attributeName="opacity"
            values="0;0.7;0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </path>
        <path d="M22 58 L23 57 L22 56 L21 57 Z" fill={color}>
          <animate
            attributeName="opacity"
            values="0;0.7;0"
            dur="1.3s"
            repeatCount="indefinite"
            begin="0.8s"
          />
        </path>
      </g>
    </svg>
  );
}
