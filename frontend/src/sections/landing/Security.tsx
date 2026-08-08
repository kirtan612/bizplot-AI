import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Key, FileCheck, EyeOff } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';

export const Security: React.FC = () => {
  const securityItems = [
    { title: 'Multi-Tenant Isolation', desc: 'UUID-partitioned databases ensure complete isolation between company accounts.', icon: Lock },
    { title: 'Role-Based Access Control', desc: 'Granular permissions restricting executive view access per division.', icon: Key },
    { title: 'Immutable Audit Logs', desc: 'Every AI recommendation and manual override is recorded in an encrypted audit trail.', icon: FileCheck },
    { title: 'Private Knowledge Context', desc: 'Your financial data is never used to train global public AI models.', icon: EyeOff },
  ];

  return (
    <section className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            ENTERPRISE SECURITY & PRIVACY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            YOUR BUSINESS.
            <br />
            <span className="text-gradient">YOUR PRIVACY GUARANTEED.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Engineered with strict zero-trust parameters to safeguard your confidential pricing, margins, customer ledgers, and bank records.
          </p>
        </motion.div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4"
              >
                <div className="p-3 rounded-xl bg-[#141414] border border-[#292929] text-white w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-mono tracking-tight">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
