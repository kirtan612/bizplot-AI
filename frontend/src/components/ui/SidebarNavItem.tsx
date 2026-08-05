import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarNavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isRoleGated?: boolean;
  requiredRole?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  icon,
  isActive = false,
  isRoleGated = false,
  requiredRole = 'Admin Only',
  badge,
  onClick,
  className
}) => {
  return (
    <div
      onClick={isRoleGated ? undefined : onClick}
      className={cn(
        "group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none",
        isActive
          ? "bg-primary-muted text-white border border-primary/30 shadow-glow font-semibold"
          : isRoleGated
          ? "opacity-50 cursor-not-allowed text-text-muted hover:bg-transparent"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary")}>
          {icon}
        </span>
        <span>{label}</span>
      </div>

      {isRoleGated ? (
        <span className="flex items-center gap-1 text-[10px] font-mono text-status-warning bg-status-warning/10 border border-status-warning/20 px-2 py-0.5 rounded-md shrink-0">
          <Lock className="w-3 h-3" />
          <span>{requiredRole}</span>
        </span>
      ) : badge ? (
        <span className="text-[10px] font-bold text-text-primary bg-surface-hover px-2 py-0.5 rounded-full border border-borderToken shrink-0">
          {badge}
        </span>
      ) : null}
    </div>
  );
};
