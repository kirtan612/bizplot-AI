import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, Send, ArrowRight, Lightbulb, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function FloatingAIButton() {
  const { aiAdvisorOpen, setAiAdvisorOpen, hasNewAiInsights, setHasNewAiInsights } = useShell();
  const toast = useToast();

  const handleToggle = () => {
    setAiAdvisorOpen(!aiAdvisorOpen);
    if (hasNewAiInsights) setHasNewAiInsights(false);
  };

  return (
    <>
      {/* Floating AI Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group p-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-purple-400/40 flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="Open AI Business Advisor"
        >
          {/* Subtle Glow Ring animation when recommendations available */}
          {hasNewAiInsights && (
            <span className="absolute inset-0 rounded-full bg-purple-500/40 animate-ping" />
          )}

          <div className="relative z-10 flex items-center gap-2">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline font-bold text-xs tracking-wider pr-1">ASK AI</span>
          </div>

          {/* New Recommendations Unread Badge */}
          {hasNewAiInsights && (
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-purple-900 shadow-md" />
          )}
        </motion.button>
      </div>

      {/* Slide-over / Modal Assistant Drawer */}
      <FloatingAIAdvisorDrawer />
    </>
  );
}

function FloatingAIAdvisorDrawer() {
  const { aiAdvisorOpen, setAiAdvisorOpen, setActiveTab } = useShell();
  const toast = useToast();
  const [prompt, setPrompt] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Greetings Kirtan. I am BizPilot AI Advisor. I have analyzed your Q3 revenue streams and supply chain bottlenecks.',
      suggestions: [
        'How to optimize margin leakage in Western region?',
        'Reconcile GST inputs for pending vendor invoices',
        'Forecast cash flow for next 60 days'
      ]
    }
  ]);

  if (!aiAdvisorOpen) return null;

  const handleSend = (userText) => {
    const textToSend = userText || prompt;
    if (!textToSend.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Analysis complete for "${textToSend}". Working capital forecast indicates a 14.2% surplus by month-end. Recommend allocating ₹3.5L to steel coil reorders before raw material price surge.`,
        actionTab: 'profit',
        actionLabel: 'View Detailed Profit Matrix'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={() => setAiAdvisorOpen(false)} />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-screen max-w-lg bg-[#0f0f14] border-l border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.3)] flex flex-col relative z-10 text-white"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
                    <span>AI Business Advisor</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      GPT-4o OS
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">Autonomous MSME Executive Strategist</p>
                </div>
              </div>

              <button
                onClick={() => setAiAdvisorOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white/[0.05] border border-white/10 text-zinc-200 rounded-bl-none shadow-lg'
                    }`}
                  >
                    <p>{m.text}</p>

                    {m.suggestions && (
                      <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
                        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-400" />
                          <span>Suggested Prompts:</span>
                        </div>
                        {m.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-[11px] text-purple-200 transition-colors cursor-pointer"
                          >
                            → {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.actionLabel && (
                      <button
                        onClick={() => {
                          setAiAdvisorOpen(false);
                          if (m.actionTab) setActiveTab(m.actionTab);
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                      >
                        <span>{m.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Input Box */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus-within:border-purple-500 transition-colors">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask AI anything about EBITDA, GST, Stock, Cash Flow..."
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 text-center mt-2 font-mono">
                BizPilot AI processes cross-module financial telemetry in real-time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
