import React, { useState, useEffect } from 'react';
import { Bot, User, CheckCircle2, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ReasoningStep {
  text: string;
  status: 'pending' | 'done' | 'active';
}

export interface AIMessageProps {
  query?: string;
  steps?: string[];
  responseContent: string;
  impactBars?: { label: string; percentage: number; color?: string }[];
  recommendedAction?: string;
  isAnimated?: boolean;
  className?: string;
}

export const AIMessage: React.FC<AIMessageProps> = ({
  query,
  steps = [],
  responseContent,
  impactBars = [],
  recommendedAction,
  isAnimated = true,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(isAnimated ? 0 : steps.length);
  const [isDoneThinking, setIsDoneThinking] = useState(!isAnimated || steps.length === 0);

  useEffect(() => {
    if (!isAnimated || steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= steps.length) {
          clearInterval(interval);
          setIsDoneThinking(true);
          return steps.length;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [steps, isAnimated]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* User Prompt */}
      {query && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start justify-end space-x-3"
        >
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-lg shadow-md font-medium">
            {query}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#3E3E3E] flex items-center justify-center shrink-0 text-neutral-300">
            <User className="w-4 h-4" />
          </div>
        </motion.div>
      )}

      {/* AI Assistant Output */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start space-x-3"
      >
        <div className="w-8 h-8 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-lg shadow-white/10">
          <Bot className="w-4 h-4" />
        </div>

        <div className="flex-1 bg-[#0D0D0D] border border-[#222222] rounded-2xl rounded-tl-none p-5 shadow-2xl space-y-4">
          {/* Reasoning Steps */}
          {steps.length > 0 && (
            <div className="p-3 rounded-xl bg-[#050505] border border-[#1A1A1A] space-y-2">
              <div className="flex items-center space-x-2 pb-1 border-b border-[#141414]">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  BizPilot Neural Execution Trace
                </span>
              </div>
              {steps.map((stepText, idx) => {
                const isDone = idx < currentStepIndex || isDoneThinking;
                const isActive = idx === currentStepIndex && !isDoneThinking;

                return (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-mono">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0" />
                    )}
                    <span className={isDone ? 'text-neutral-300' : isActive ? 'text-white font-semibold' : 'text-neutral-600'}>
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final Response Content */}
          {isDoneThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                {responseContent}
              </div>

              {/* Impact Breakdown Bars */}
              {impactBars.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#1C1C1C] space-y-2.5">
                  <span className="text-[11px] font-mono uppercase text-neutral-400 block tracking-wider">
                    VARIANCE IMPACT BREAKDOWN
                  </span>
                  {impactBars.map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-300">{bar.label}</span>
                        <span className="text-white font-bold">{bar.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#181818] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.percentage}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`h-full rounded-full ${bar.color || 'bg-white'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Next Step */}
              {recommendedAction && (
                <div className="mt-4 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      RECOMMENDED ACTION
                    </span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">
                      {recommendedAction}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center space-x-1 cursor-pointer">
                    <span>Execute</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
