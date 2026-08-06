import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'How secure is our business data with BizPilot AI?',
      a: 'We enforce enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. Your financial, inventory, and ledger data is isolated in dedicated PostgreSQL instances and is NEVER used to train shared public foundation models.'
    },
    {
      q: 'Do I need technical skills to connect my ERP or CSV files?',
      a: 'No technical or coding skills required. You can simply drag and drop standard CSV/Excel sales and inventory registers, or connect Tally, Zoho, and QuickBooks with our pre-built 1-click connectors.'
    },
    {
      q: 'How does the AI Board Meeting feature work in practice?',
      a: 'The AI Board Meeting brings together specialized AI agents (AI CEO, CFO, COO, Sales Director, Sourcing Manager) in a virtual executive session. They analyze your real business data, debate growth scenarios, and generate a unified consensus strategy.'
    },
    {
      q: 'Can BizPilot AI integrate with existing accounting software?',
      a: 'Yes! BizPilot AI supports native integrations and direct export/import pipelines for Tally Prime, Zoho Books, QuickBooks Online, SAP Business One, and custom PostgreSQL database backends.'
    },
    {
      q: 'What ROI can an MSME expect in the first 30 days?',
      a: 'Our MSME partners typically achieve a 14% to 34% increase in net profit margins within 90 days by identifying hidden freight overruns, liquidating deadstock, and recovering overdue receivables before they turn bad.'
    },
    {
      q: 'Can I test BizPilot AI before committing to a paid plan?',
      a: 'Yes, we offer a 14-day full-featured free trial with zero credit card required. You get full access to all 7 Core AI Intelligence Modules and the AI C-Suite.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-32 bg-[#09090b] relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Everything you need to know about BizPilot AI security, integrations, and deployment.
          </p>

          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. security, Tally, ROI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#121215] border border-white/[0.08] rounded-[20px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="text-base font-semibold text-white font-sans">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/[0.06] bg-zinc-900/40"
                    >
                      <div className="p-6 text-sm text-zinc-300 leading-relaxed font-sans font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
