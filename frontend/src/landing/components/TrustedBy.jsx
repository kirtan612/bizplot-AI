import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Lock, Zap } from 'lucide-react';

export default function TrustedBy() {
  const brands = [
    { name: 'NEXUS ENTERPRISE', tag: 'Logistics' },
    { name: 'APEX INDUSTRIAL', tag: 'Manufacturing' },
    { name: 'HORIZON RETAIL', tag: 'Multi-Store' },
    { name: 'QUANTUM SUPPLY', tag: 'Distribution' },
    { name: 'STRATOS COMMERCE', tag: 'D2C Brand' },
    { name: 'VANTAGE STEEL', tag: 'Heavy Industry' },
    { name: 'NOVA PHARMA', tag: 'Supply Chain' },
    { name: 'STEELGRID TECH', tag: 'Hardware' }
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#0c0c0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500">
          POWERING HIGH-GROWTH MSMEs & ENTERPRISE LEADERS NATIONWIDE
        </p>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative flex overflow-hidden select-none mask-gradient">
        {/* Gradient Blur Masks for Seamless Marquee Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0c0c0f] to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0c0c0f] to-transparent pointer-events-none" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 25,
          }}
          className="flex items-center gap-12 whitespace-nowrap min-w-full"
        >
          {[...brands, ...brands].map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center gap-3 group opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xs font-mono font-bold text-zinc-300 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                {brand.name.substring(0, 2)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold tracking-wider font-mono text-zinc-200 group-hover:text-white transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{brand.tag}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
