import React from 'react';
import { Shield, Sparkles, Command } from 'lucide-react';

interface ProductWindowProps {
  title?: string;
  badge?: string;
  children: React.ReactNode;
  activeTab?: string;
  tabs?: string[];
  onTabChange?: (tab: string) => void;
  className?: string;
  laserTheme?: boolean;
}

export const ProductWindow: React.FC<ProductWindowProps> = ({
  title = 'BizPilot AI — Command Center',
  badge = 'PRODUCTION DEMO',
  children,
  activeTab,
  tabs = [],
  onTabChange,
  className = '',
  laserTheme = true,
}) => {
  const containerStyle = laserTheme
    ? 'rounded-2xl bg-[#120F17] border-2 border-[#CF9EFF] shadow-[0_0_35px_rgba(207,158,255,0.35),0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300'
    : 'rounded-2xl bg-[#080808] border border-[#222222] shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300';

  const headerStyle = laserTheme
    ? 'px-4 py-3 bg-[#181324] border-b border-[#2D2342] flex items-center justify-between select-none'
    : 'px-4 py-3 bg-[#0D0D0D] border-b border-[#1E1E1E] flex items-center justify-between select-none';

  const bodyStyle = laserTheme
    ? 'p-4 sm:p-6 bg-[#120F17]'
    : 'p-4 sm:p-6 bg-[#080808]';

  return (
    <div className={`${containerStyle} ${className}`}>
      {/* Window Title Bar */}
      <div className={headerStyle}>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm shadow-rose-900/50 hover:bg-rose-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm shadow-amber-900/50 hover:bg-amber-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm shadow-emerald-900/50 hover:bg-emerald-500 transition-colors cursor-pointer" />
          </div>

          {tabs.length > 0 ? (
            <div className="hidden sm:flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange?.(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab
                      ? laserTheme
                        ? 'bg-[#251A3A] text-white border border-[#CF9EFF]/40'
                        : 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-300 font-semibold flex items-center space-x-1.5">
              <Shield className={`w-3.5 h-3.5 ${laserTheme ? 'text-[#CF9EFF]' : 'text-neutral-300'}`} />
              <span>{title}</span>
            </span>
          )}
        </div>

        {/* Window Top Right Status */}
        <div className="flex items-center space-x-3">
          <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono ${
            laserTheme
              ? 'bg-[#1E172E] border-[#372A52] text-purple-200'
              : 'bg-[#141414] border-[#262626] text-neutral-400'
          }`}>
            <Command className="w-3 h-3" />
            <span>K</span>
            <span className={laserTheme ? 'text-purple-400' : 'text-neutral-600'}>Quick Command</span>
          </div>

          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold flex items-center space-x-1 ${
            laserTheme
              ? 'bg-[#261B3D] border-[#CF9EFF]/60 text-[#CF9EFF] shadow-sm shadow-purple-900/40'
              : 'bg-[#181818] border-[#2A2A2A] text-neutral-300'
          }`}>
            <Sparkles className={`w-3 h-3 ${laserTheme ? 'text-[#CF9EFF]' : 'text-white'}`} />
            <span>{badge}</span>
          </span>
        </div>
      </div>

      {/* Window Body Canvas */}
      <div className={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

export default ProductWindow;
