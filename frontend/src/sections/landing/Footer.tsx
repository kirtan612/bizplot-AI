import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030303] border-t border-[#181818] py-16 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-black font-bold flex items-center justify-center">
                <Shield className="w-4 h-4 fill-black" />
              </div>
              <span className="font-bold text-lg text-white tracking-wider">BIZPILOT AI</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              AI Operating System for Modern Indian Businesses. Continuous telemetry, profit intelligence, working capital prediction, and autonomous executive decisions.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">PRODUCT</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#business-overview" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="#customer-intelligence" className="hover:text-white transition-colors">Customer Intelligence</a></li>
              <li><a href="#profit-intelligence" className="hover:text-white transition-colors">Profit Intelligence</a></li>
              <li><a href="#cashflow-intelligence" className="hover:text-white transition-colors">Cashflow Intelligence</a></li>
              <li><a href="#predictive-intelligence" className="hover:text-white transition-colors">Predictive AI</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">AI EXECUTIVES</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#ai-executives" className="hover:text-white transition-colors">CFO AI Agent</a></li>
              <li><a href="#ai-executives" className="hover:text-white transition-colors">COO AI Agent</a></li>
              <li><a href="#ai-executives" className="hover:text-white transition-colors">Sales AI Agent</a></li>
              <li><a href="#ai-executives" className="hover:text-white transition-colors">Supply Chain AI</a></li>
              <li><a href="#ai-analyst" className="hover:text-white transition-colors">AI Business Analyst</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">LEGAL & TRUST</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Architecture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Ingestion SLA</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#121212] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500">
          <span>© 2026 BizPilot AI. Built for Modern Indian Business. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Production Telemetry Ready</span>
        </div>
      </div>
    </footer>
  );
};
