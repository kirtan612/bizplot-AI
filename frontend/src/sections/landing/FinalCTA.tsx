import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton';
import { fadeInUp } from '../../lib/animations';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-[#050505] via-[#080808] to-[#030303] relative overflow-hidden border-t border-[#1E1E1E]">
      <div className="absolute inset-0 bg-radial-gradient opacity-80 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="space-y-6"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#121212] border border-[#2A2A2A] text-xs font-mono text-neutral-300 font-semibold tracking-wider uppercase inline-flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>TRANSFORM YOUR BUSINESS OPERATING SYSTEM TODAY</span>
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            STOP MANAGING
            <br />
            <span className="text-gradient">YOUR BUSINESS IN THE DARK.</span>
          </h2>

          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Give your business an AI that understands what is happening, why it matters, and what to do next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <MagneticButton variant="glow" size="lg" className="w-full sm:w-auto px-10 py-5 text-lg">
              <span>ENTER BIZPILOT</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </MagneticButton>
            <MagneticButton variant="outline" size="lg" className="w-full sm:w-auto px-8 py-5 text-base">
              <span>Explore the Platform</span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
