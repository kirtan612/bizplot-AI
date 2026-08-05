import React from 'react';
import { motion } from 'framer-motion';

export const AmbientBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-text-primary">
      {/* 1. SVG Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 2. Floating Animated Glow Orbs (21st.dev / Linear style) */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 left-1/4 z-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -90, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.15, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/3 -right-20 z-0 w-[30rem] h-[30rem] bg-ai/15 rounded-full blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, 50, -60, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-10 left-1/3 z-0 w-80 h-80 bg-secondary/15 rounded-full blur-[130px] pointer-events-none"
      />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
