import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className,
  glowColor = 'from-primary via-secondary to-ai',
  ...props
}) => {
  return (
    <div className="relative group inline-block">
      {/* Animated glowing border background */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl bg-gradient-to-r blur-sm opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse",
          glowColor
        )}
      />
      <button
        className={cn(
          "relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-white/10 font-semibold text-sm text-white shadow-xl transition-all duration-200 active:scale-95",
          className
        )}
        {...props}
      >
        <Sparkles className="w-4 h-4 text-ai animate-spin" style={{ animationDuration: '6s' }} />
        <span>{children}</span>
      </button>
    </div>
  );
};
