import React from 'react';
import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface VoiceActivityIndicatorProps {
  isActive: boolean;
  speakerName?: string;
  className?: string;
}

export function VoiceActivityIndicator({ isActive, speakerName, className = "" }: VoiceActivityIndicatorProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg ${className}`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Mic className="h-4 w-4" />
      </motion.div>
      
      <span className="text-sm font-medium">{speakerName} در حال صحبت</span>
      
      {/* Audio Wave Animation */}
      <div className="flex items-center gap-1 ml-2">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white rounded-full"
            animate={{
              height: [4, 12, 6, 8, 4],
              opacity: [0.4, 1, 0.6, 0.8, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}