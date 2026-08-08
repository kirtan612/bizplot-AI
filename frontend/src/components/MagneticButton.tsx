import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2;
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-semibold rounded-lg',
    md: 'px-6 py-3 text-sm font-semibold rounded-xl',
    lg: 'px-8 py-4 text-base font-bold rounded-xl',
  }[size];

  const variantClasses = {
    primary: 'bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/10 border border-white',
    secondary: 'bg-[#181818] text-white hover:bg-[#242424] border border-[#2E2E2E]',
    outline: 'bg-transparent text-white border border-[#3A3A3A] hover:border-white hover:bg-white/5',
    glow: 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.4)] border border-white',
  }[variant];

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors duration-200 select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
};
