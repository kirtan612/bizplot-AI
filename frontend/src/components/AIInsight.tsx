import React from 'react';
import { Sparkles, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AIInsightProps {
  title: string;
  badge?: string;
  type?: 'alert' | 'recommendation' | 'insight' | 'prediction';
  metrics?: { label: string; value: string; change?: string }[];
  description: string;
  recommendation?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({
  title,
  badge = 'AI INSIGHT',
  type = 'insight',
  metrics,
  description,
  recommendation,
  actionText,
  onAction,
  className = '',
}) => {
  const iconMap = {
    alert: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    recommendation: <Sparkles className="w-4 h-4 text-white" />,
    insight: <Sparkles className="w-4 h-4 text-neutral-300" />,
    prediction: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-5 rounded-xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#282828] shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] border border-[#333333]">
            {iconMap[type]}
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
            {badge}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-mono text-neutral-500">LIVE AGENT</span>
        </div>
      </div>

      <h4 className="text-base font-semibold text-white tracking-tight mb-2">{title}</h4>
      <p className="text-xs text-neutral-300 leading-relaxed mb-4">{description}</p>

      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-lg bg-[#080808] border border-[#1C1C1C]">
          {metrics.map((m, i) => (
            <div key={i}>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
                {m.label}
              </span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-sm font-bold font-mono text-white">{m.value}</span>
                {m.change && (
                  <span className={`text-[10px] font-mono ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendation && (
        <div className="mt-3 pt-3 border-t border-[#1F1F1F]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1">
            RECOMMENDED ACTION
          </span>
          <p className="text-xs text-neutral-200 font-medium leading-relaxed">{recommendation}</p>
        </div>
      )}

      {actionText && (
        <div className="mt-4 pt-2">
          <button
            onClick={onAction}
            className="w-full py-2 px-3 rounded-lg bg-[#222222] hover:bg-[#333333] border border-[#3A3A3A] text-xs font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
