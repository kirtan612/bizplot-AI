import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer({ onGetStarted }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#060608] border-t border-white/[0.08] text-zinc-400 text-xs py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight font-sans">
                BizPilot<span className="text-blue-400 ml-0.5">AI</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-normal">
              The AI Business Operating System for MSMEs. Autonomous financial, inventory, and sales intelligence powered by specialized neural C-Suite agents.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ALL SYSTEMS OPERATIONAL (99.99% UPTIME)
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h5 className="text-xs font-mono uppercase font-semibold text-zinc-200 mb-4 tracking-wider">
                Platform
              </h5>
              <ul className="space-y-3 text-zinc-400 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Core AI Modules</a></li>
                <li><a href="#ai-team" className="hover:text-white transition-colors">AI C-Suite</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Tiers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase font-semibold text-zinc-200 mb-4 tracking-wider">
                Enterprise
              </h5>
              <ul className="space-y-3 text-zinc-400 text-xs">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Pipeline Architecture</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white transition-colors">Interactive Demo</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Security & FAQ</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onGetStarted(); }} className="hover:text-white transition-colors">Sign In</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Input */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-mono uppercase font-semibold text-zinc-200 tracking-wider">
              Stay Updated
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Get weekly MSME growth insights & AI playbooks directly in your inbox.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter work email..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 w-12 shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} BizPilot AI Inc. All rights reserved. Enterprise AI Business Operating System.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Security Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
