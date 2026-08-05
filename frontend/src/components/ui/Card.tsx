import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'glass' | 'ai';
  hoverable?: boolean;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  hoverable = false,
  children,
  ...props
}, ref) => {
  const baseStyles = "rounded-xl p-5 border transition-all duration-200";

  const variants = {
    default: "bg-surface border-borderToken text-text-primary shadow-card",
    elevated: "bg-surface-elevated border-borderToken/80 text-text-primary shadow-lg",
    glass: "glass-panel text-text-primary shadow-card",
    ai: "bg-surface/90 border-ai/30 text-text-primary shadow-aiGlow relative overflow-hidden"
  };

  const hoverMotion = hoverable ? {
    whileHover: { y: -2, transition: { duration: 0.2 } }
  } : {};

  return (
    <motion.div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        hoverable && "hover:border-borderHover cursor-pointer",
        className
      )}
      {...hoverMotion}
      {...props}
    >
      {variant === 'ai' && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-ai/10 rounded-full blur-2xl pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-text-primary", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-text-secondary", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("flex items-center pt-4 mt-4 border-t border-borderToken", className)} {...props}>
    {children}
  </div>
);
