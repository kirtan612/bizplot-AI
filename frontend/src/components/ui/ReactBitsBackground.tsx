import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface ReactBitsBackgroundProps {
  children?: React.ReactNode;
}

export const ReactBitsBackground: React.FC<ReactBitsBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Stars System (React Bits style)
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      color: ['#7C3AED', '#A855F7', '#C084FC', '#38BDF8'][Math.floor(Math.random() * 4)]
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw React Bits Particle Dots
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#09090B] overflow-hidden text-text-primary">
      {/* 1. React Bits Live Canvas Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      {/* 2. React Bits Aurora Waves (Gradient Mesh Animations) */}
      <motion.div
        animate={{
          opacity: [0.35, 0.65, 0.35],
          scale: [1, 1.15, 1],
          rotate: [0, 10, -5, 0]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-40 left-1/3 z-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-primary/30 via-secondary/20 to-ai/25 rounded-full blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          opacity: [0.25, 0.55, 0.25],
          scale: [1.1, 0.9, 1.1],
          rotate: [0, -12, 8, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-0 right-10 z-0 w-[35rem] h-[35rem] bg-gradient-to-br from-ai/20 via-primary/25 to-surface/40 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
