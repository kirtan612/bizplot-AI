import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface ExecutiveData {
  id: string;
  role: string;
  title: string;
  status: 'active' | 'warning' | 'alert';
  alertTitle: string;
  metricLabel: string;
  metricValue: string;
  drivers: string[];
  recommendation: string;
  icon: LucideIcon;
}

interface ExecutiveNodeProps {
  executive: ExecutiveData;
  isActive: boolean;
  onSelect: () => void;
}

export const ExecutiveNode: React.FC<ExecutiveNodeProps> = ({
  executive,
  isActive,
  onSelect,
}) => {
  const Icon = executive.icon;

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isActive
          ? 'bg-[#181818] border-white/40 shadow-2xl shadow-white/10'
          : 'bg-[#0B0B0B] border-[#1E1E1E] hover:border-[#333333] hover:bg-[#111111]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isActive
                ? 'bg-white text-black border-white'
                : 'bg-[#141414] text-neutral-300 border-[#262626]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              AI EXECUTIVE
            </span>
            <h4 className="text-base font-bold text-white tracking-tight">{executive.role}</h4>
          </div>
        </div>

        <span
          className={`w-2.5 h-2.5 rounded-full ${
            executive.status === 'alert'
              ? 'bg-rose-500 animate-ping'
              : executive.status === 'warning'
              ? 'bg-amber-400 animate-pulse'
              : 'bg-emerald-400'
          }`}
        />
      </div>

      <div className="space-y-1.5 mt-3 pt-3 border-t border-[#1C1C1C]">
        <span className="text-xs font-semibold text-neutral-200 block truncate">
          {executive.alertTitle}
        </span>
        <div className="flex items-baseline justify-between text-xs font-mono">
          <span className="text-neutral-400">{executive.metricLabel}</span>
          <span className="text-white font-bold">{executive.metricValue}</span>
        </div>
      </div>
    </motion.div>
  );
};
