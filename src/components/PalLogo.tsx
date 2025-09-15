import React from 'react';

interface PalLogoProps {
  className?: string;
  size?: number;
}

export function PalLogo({ className = "", size = 64 }: PalLogoProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Background Circle */}
        <circle 
          cx="32" 
          cy="32" 
          r="30" 
          fill="url(#gradient1)"
          stroke="url(#gradient2)"
          strokeWidth="2"
        />
        
        {/* Bridge Shape */}
        <path
          d="M12 32 Q20 20 32 32 Q44 20 52 32"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Bridge Pillars */}
        <rect x="30" y="32" width="4" height="12" fill="white" rx="2" />
        <rect x="18" y="36" width="3" height="8" fill="white" rx="1.5" />
        <rect x="43" y="36" width="3" height="8" fill="white" rx="1.5" />
        
        {/* Connection Points */}
        <circle cx="14" cy="32" r="3" fill="white" />
        <circle cx="50" cy="32" r="3" fill="white" />
        
        {/* Decorative Elements */}
        <circle cx="25" cy="28" r="1.5" fill="rgba(255,255,255,0.8)" />
        <circle cx="39" cy="28" r="1.5" fill="rgba(255,255,255,0.8)" />
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}