import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, ArrowRight } from 'lucide-react';

export default function Pricing({ onGetStarted }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter Tier',
      tagline: 'Essential AI analytics for single-location MSMEs.',
      monthlyPrice: 99,
      annualPrice: 79,
      badge: 'ENTRY LEVEL',
      popular: false,
      features: [
        'Finance & Profit Intelligence Modules',
        'CSV & Excel Auto-Validation Ingestion',
        'PostgreSQL Encrypted Data Storage',
        '90-Day Cashflow Scenario Modeling',
        'Email Support & Standard Auditing'
      ]
    },
    {
      name: 'Growth OS',
      tagline: 'Full AI C-Suite for multi-branch scaling enterprises.',
      monthlyPrice: 249,
      annualPrice: 199,
      badge: 'MOST POPULAR',
      popular: true,
      features: [
        'All 7 Core AI Intelligence Modules',
        'Full AI C-Suite (CEO, CFO, COO, Sales, Sourcing)',
        'Virtual AI Board Meeting Simulations',
        'Inventory Stockout & Deadstock Triggers',
        'Automated Purchase Orders & Reminders',
        'Priority 24/7 Executive SLA Support'
      ]
    },
    {
      name: 'Enterprise Custom',
      tagline: 'Custom fine-tuned models & direct ERP integration.',
      monthlyPrice: 599,
      annualPrice: 479,
      badge: 'CUSTOM SCALE',
      popular: false,
      features: [
        'Custom Dedicated Neural AI Models',
        'Direct Tally, Zoho & Custom ERP Sync',
        'Unlimited Data Stream Throughput',
        'Dedicated On-Premise PostgreSQL Option',
        'Custom SQL Reporting & Data Engineering',
        'Dedicated Account Director & Onboarding'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#0c0c0f] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
            <Zap className="w-3.5 h-3.5" />
            TRANSPARENT ENTERPRISE PRICING
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Predictable Plans for Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Stage of Business Growth.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            No hidden setup fees or per-user penalties. Transparent monthly and annual plans built for MSMEs.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${!isAnnual ? 'text-white' : 'text-zinc-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-800 border border-zinc-700 transition-colors focus:outline-none cursor-pointer"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-blue-500 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-zinc-400'}`}>
              Annual Billing
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className={`rounded-[20px] p-8 flex flex-col justify-between transition-all duration-200 relative ${
                  plan.popular
                    ? 'bg-zinc-900 border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.25)]'
                    : 'bg-[#121215] border border-white/[0.08] hover:border-white/20 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white font-sans">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mb-6 font-normal">{plan.tagline}</p>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono text-white">${price}</span>
                    <span className="text-xs font-mono text-zinc-500">/ month per org</span>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-3 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onGetStarted}
                  className={`w-full h-12 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  }`}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
