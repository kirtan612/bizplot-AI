import React from 'react';
import { cn } from '@/utils/cn';

export interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className,
  speed = 3
}) => {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[linear-gradient(110deg,#FAFAFA,45%,#C084FC,55%,#FAFAFA)] bg-[length:250%_100%] animate-shimmer font-bold",
        className
      )}
      style={{
        animationDuration: `${speed}s`
      }}
    >
      {text}
    </span>
  );
};
