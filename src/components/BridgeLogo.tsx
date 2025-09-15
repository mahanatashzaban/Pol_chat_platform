import React from 'react';
import { motion } from 'motion/react';

interface BridgeLogoProps {
  size?: number;
  className?: string;
}

export function BridgeLogo({ size = 60, className = "" }: BridgeLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9933CC" />
            <stop offset="50%" stopColor="#CC33FF" />
            <stop offset="100%" stopColor="#9933CC" />
          </linearGradient>
          <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <motion.circle
          cx="30"
          cy="30"
          r="28"
          fill="url(#bridgeGradient)"
          opacity="0.1"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Bridge Base */}
        <rect x="5" y="35" width="50" height="3" fill="url(#bridgeGradient)" rx="1.5" />
        
        {/* Bridge Towers */}
        <rect x="18" y="15" width="2" height="23" fill="url(#bridgeGradient)" />
        <rect x="40" y="15" width="2" height="23" fill="url(#bridgeGradient)" />
        
        {/* Tower Tops */}
        <rect x="17" y="15" width="4" height="2" fill="url(#bridgeGradient)" rx="1" />
        <rect x="39" y="15" width="4" height="2" fill="url(#bridgeGradient)" rx="1" />

        {/* Main Suspension Cables */}
        <motion.path
          d="M19 17 Q30 25 41 17"
          stroke="url(#cableGradient)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
          d="M19 19 Q30 27 41 19"
          stroke="url(#cableGradient)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />

        {/* Vertical Suspension Cables */}
        {[22, 26, 30, 34, 38].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={17 + Math.abs(30 - x) * 0.3}
            x2={x}
            y2="35"
            stroke="url(#cableGradient)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
          />
        ))}

        {/* Side Cables */}
        <motion.path
          d="M19 17 L8 35"
          stroke="url(#cableGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
        <motion.path
          d="M41 17 L52 35"
          stroke="url(#cableGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />

        {/* Bridge Lights */}
        {[12, 20, 30, 40, 48].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy="33"
            r="1"
            fill="#FFD700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* Persian Text */}
        <motion.text
          x="30"
          y="48"
          textAnchor="middle"
          fill="url(#bridgeGradient)"
          fontSize="8"
          fontFamily="Vazirmatn"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          پل
        </motion.text>

        {/* Decorative Elements */}
        <motion.circle
          cx="15"
          cy="12"
          r="1"
          fill="#9933CC"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="45"
          cy="10"
          r="1"
          fill="#CC33FF"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </svg>
    </div>
  );
}