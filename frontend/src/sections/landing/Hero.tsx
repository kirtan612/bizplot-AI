import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton';
import { ProductWindow } from '../../components/ProductWindow';
import { MetricGroup } from '../../components/MetricGroup';
import { BusinessChart } from '../../components/BusinessChart';
import { LaserFlow } from '../../components/LaserFlow';
import { fadeInUp, staggerContainer } from '../../lib/animations';

export const Hero: React.FC = () => {
  const revealRef = useRef<HTMLDivElement | null>(null);

  const chartData = [
    { label: 'Jan', value: 18.2 },
    { label: 'Feb', value: 19.8 },
    { label: 'Mar', value: 21.4 },
    { label: 'Apr', value: 22.1 },
    { label: 'May', value: 23.5 },
    { label: 'Jun', value: 24.8 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  return (
    <section
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#07050E]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* LaserFlow Volumetric Beam — Centered Exactly in Middle (horizontalBeamOffset = 0.0) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
        <LaserFlow
          horizontalBeamOffset={0.15}
          verticalBeamOffset={0.0}
          horizontalSizing={0.7}
          verticalSizing={2.0}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={4.5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.35}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.2}
          falloffStart={1.2}
          color="#CF9EFF"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-1" />

      {/* Interactive Cursor Spotlight Reveal Glow */}
      <div
        ref={revealRef}
        className="absolute inset-0 pointer-events-none z-2 transition-opacity duration-300 opacity-60"
        style={{
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.85) 80px, rgba(255,255,255,0.4) 180px, rgba(255,255,255,0) 300px)',
          maskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.85) 80px, rgba(255,255,255,0.4) 180px, rgba(255,255,255,0) 300px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          background: 'radial-gradient(circle at var(--mx) var(--my), rgba(207,158,255,0.2) 0%, transparent 70%)'
        } as React.CSSProperties}
      />

      {/* Central Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Tagline Badge */}
          <motion.div variants={fadeInUp} className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-[#0E0B18]/90 backdrop-blur-md border border-[#372B4D] text-xs font-mono text-purple-200 font-semibold tracking-wider uppercase inline-flex items-center space-x-2 shadow-2xl shadow-purple-950/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-3.5 h-3.5 text-[#CF9EFF]" />
              <span>THE AI OPERATING SYSTEM FOR INDIAN BUSINESS</span>
            </span>
          </motion.div>

          {/* Main Headline - High contrast with text-shadow against central laser beam */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            YOUR BUSINESS.
            <br />
            <span className="bg-gradient-to-r from-white via-purple-100 to-[#CF9EFF] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              ONE INTELLIGENT OS.
            </span>
          </motion.h1>

          {/* Supporting Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-neutral-200 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            BizPilot AI turns your business data into continuous intelligence, accurate financial predictions, and automated executive decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton variant="glow" size="lg" className="w-full sm:w-auto shadow-2xl shadow-purple-900/40">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </MagneticButton>
            <MagneticButton variant="outline" size="lg" className="w-full sm:w-auto">
              <span>Explore the Platform</span>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Hero Visual — Floating Product Application Window */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 relative -translate-y-[35px]"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-[#CF9EFF]/30 via-purple-500/10 to-transparent blur-2xl opacity-50 pointer-events-none" />

          <ProductWindow title="BizPilot AI Command Center — Executive Telemetry (Live Demo)">
            <div className="space-y-6">
              {/* Metric Strip */}
              <MetricGroup
                columns={4}
                metrics={[
                  { label: 'Revenue', value: 24.8, suffix: ' Cr', change: 8.4, changeLabel: 'vs last cycle', status: 'healthy', statusText: 'RECORD HIGH' },
                  { label: 'Gross Profit', value: 3.42, suffix: ' Cr', change: 5.8, changeLabel: 'vs last cycle', status: 'healthy', statusText: 'STABLE' },
                  { label: 'Cashflow', value: 1.86, suffix: ' Cr', change: -2.1, changeLabel: 'vs last cycle', status: 'warning', statusText: 'BUFFER NEEDED' },
                  { label: 'Retention', value: 87.4, prefix: '', suffix: '%', change: 1.2, changeLabel: 'MoM', status: 'healthy', statusText: 'EXCELLENT' },
                ]}
              />

              {/* Grid: Chart + AI Insight */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BusinessChart
                    title="Revenue Trajectory (H1 FY26)"
                    subtitle="Actual vs AI Projections (Values in ₹ Crore)"
                    data={chartData}
                    type="area"
                    height={220}
                  />
                </div>

                {/* AI Insight Box */}
                <div className="p-5 rounded-xl bg-[#0D0B14] border border-[#252033] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>AI EXECUTIVE ALERT</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">REALTIME</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Profit margin pressure detected.</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Raw material costs (GI Pipe Sheets) increased <strong className="text-white">12.4%</strong> over the last purchasing cycle while average customer discount rose by 1.8%.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#151221] border border-[#2D263B]">
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase mb-0.5">CFO RECOMMENDATION</span>
                    <span className="text-xs text-neutral-200 font-semibold block">
                      Re-index pricing tiers for Tier-2 distributors before Q3 orders lock.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ProductWindow>
        </motion.div>
      </div>
    </section>
  );
};


