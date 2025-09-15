import React from 'react';
import { motion } from 'motion/react';

interface AhwazBridgeProps {
  className?: string;
  size?: number;
}

export function AhwazBridge({ className = "", size = 400 }: AhwazBridgeProps) {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width={size} 
        height={size * 0.6} 
        viewBox="0 0 400 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Background Sky Gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="50%" stopColor="#E0F6FF" />
            <stop offset="100%" stopColor="#98D8E8" />
          </linearGradient>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#1E3A5F" />
          </linearGradient>
          <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          <linearGradient id="towerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#696969" />
            <stop offset="50%" stopColor="#808080" />
            <stop offset="100%" stopColor="#505050" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="140" fill="url(#skyGradient)" />
        
        {/* Water */}
        <rect y="140" width="400" height="100" fill="url(#waterGradient)" />
        
        {/* Water Ripples */}
        <motion.path
          d="M0 150 Q100 145 200 150 T400 150"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="none"
          animate={{ d: ["M0 150 Q100 145 200 150 T400 150", "M0 150 Q100 155 200 150 T400 150", "M0 150 Q100 145 200 150 T400 150"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M0 160 Q150 155 300 160 T400 160"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          fill="none"
          animate={{ d: ["M0 160 Q150 155 300 160 T400 160", "M0 160 Q150 165 300 160 T400 160", "M0 160 Q150 155 300 160 T400 160"] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        {/* Bridge Main Structure */}
        {/* Main Bridge Deck */}
        <rect x="0" y="130" width="400" height="8" fill="url(#bridgeGradient)" />
        <rect x="0" y="138" width="400" height="2" fill="#4A4A4A" />
        
        {/* Bridge Pillars in Water */}
        <rect x="95" y="138" width="10" height="60" fill="url(#towerGradient)" />
        <rect x="295" y="138" width="10" height="60" fill="url(#towerGradient)" />
        
        {/* Main Suspension Towers */}
        <rect x="98" y="50" width="4" height="88" fill="url(#towerGradient)" />
        <rect x="298" y="50" width="4" height="88" fill="url(#towerGradient)" />
        
        {/* Tower Tops */}
        <rect x="96" y="50" width="8" height="4" fill="url(#towerGradient)" />
        <rect x="296" y="50" width="8" height="4" fill="url(#towerGradient)" />

        {/* Main Suspension Cables */}
        <motion.path
          d="M100 54 Q200 80 300 54"
          stroke="url(#cableGradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
          d="M100 58 Q200 84 300 58"
          stroke="url(#cableGradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />

        {/* Vertical Suspension Cables */}
        {[120, 140, 160, 180, 200, 220, 240, 260, 280].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={54 + Math.abs(200 - x) * 0.12}
            x2={x}
            y2="130"
            stroke="url(#cableGradient)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
          />
        ))}

        {/* Side Cables to Ground */}
        <motion.path
          d="M100 54 L20 130"
          stroke="url(#cableGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
        <motion.path
          d="M300 54 L380 130"
          stroke="url(#cableGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />

        {/* Bridge Side Railings */}
        <rect x="0" y="128" width="400" height="2" fill="#606060" />
        <rect x="0" y="140" width="400" height="2" fill="#606060" />

        {/* Decorative Elements */}
        {/* Bridge Lights */}
        {[50, 100, 150, 200, 250, 300, 350].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy="126"
            r="2"
            fill="#FFD700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* Persian Architecture Details */}
        <rect x="96" y="46" width="8" height="4" fill="#B8860B" rx="2" />
        <rect x="296" y="46" width="8" height="4" fill="#B8860B" rx="2" />
        
        {/* Sun Reflection on Water */}
        <motion.ellipse
          cx="200"
          cy="180"
          rx="30"
          ry="8"
          fill="rgba(255, 215, 0, 0.3)"
          animate={{ rx: [25, 35, 25], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Birds */}
        <motion.g
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <path d="M50 30 Q55 25 60 30 Q55 35 50 30" fill="#333" />
          <path d="M65 35 Q70 30 75 35 Q70 40 65 35" fill="#333" />
        </motion.g>

        <motion.g
          animate={{ x: [400, 300, 400] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <path d="M350 25 Q355 20 360 25 Q355 30 350 25" fill="#333" />
        </motion.g>

        {/* Persian Calligraphy Style Decoration */}
        <motion.text
          x="200"
          y="120"
          textAnchor="middle"
          fill="#8B4513"
          fontSize="12"
          fontFamily="serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          پل
        </motion.text>
      </svg>
    </div>
  );
}