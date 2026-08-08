import React from 'react';
import { motion } from 'framer-motion';
import { DataStream } from '../../components/DataStream';
import { fadeInUp } from '../../lib/animations';

export const DataUniverse: React.FC = () => {
  return (
    <section className="py-24 bg-[#050505] border-t border-b border-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            UNIFIED DATA INGESTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ALL YOUR BUSINESS DATA.
            <br />
            <span className="text-gradient">ONE REAL-TIME UNIVERSE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot continuously ingests invoices, GST filings, inventory MT logs, customer ledgers, and bank records to construct your live business context graph.
          </p>
        </motion.div>

        {/* Data Stream Convergence Interactive Component */}
        <DataStream />
      </div>
    </section>
  );
};
