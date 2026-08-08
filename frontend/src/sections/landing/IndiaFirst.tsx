import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';

export const IndiaFirst: React.FC = () => {
  const features = [
    { title: 'Native Indian Currency Formatting', desc: 'Full support for ₹ Lakh and ₹ Crore financial scales (e.g. ₹24.8 Cr, ₹3.42 Cr, ₹18.5 L).' },
    { title: 'GST & ITC Reconciliation', desc: 'Auto-reconciles GSTR-1, 3B, and 2B Input Tax Credit discrepancies to catch vendor leaks.' },
    { title: 'Tally & Busy Sync Pipeline', desc: 'Direct secure connector for Tally Prime and Busy accounting vouchers with sub-second sync.' },
    { title: 'MSME 45-Day Payment Rule Guard', desc: 'Automated warnings for MSME supplier invoice due dates under Section 43B(h).' },
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            GEOGRAPHICALLY TUNED ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            BUILT FOR INDIAN BUSINESS.
            <br />
            <span className="text-gradient">FROM DAY ONE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Generic Western SaaS software fails to model Indian business realities. BizPilot was architected specifically for Indian commercial ledgers, GST laws, and supplier credit structures.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#202020] hover:border-[#333333] transition-colors space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#181818] border border-[#2C2C2C] text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed pl-11">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
