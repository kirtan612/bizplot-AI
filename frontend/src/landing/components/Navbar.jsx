import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

export default function Navbar({ onNavigateToApp }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Core AI', href: '#modules' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'AI C-Suite', href: '#ai-team' },
    { label: 'Preview', href: '#dashboard-preview' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-200 flex items-center ${
        isScrolled
          ? 'bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 shrink-0 text-decoration-none group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 group-hover:border-blue-500/60 transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Cpu className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-sm group-hover:opacity-100 opacity-50 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-zinc-100 font-sans">
                BizPilot<span className="text-blue-400 ml-0.5">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                OS v2.4
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeSection === item.href
                    ? 'text-white bg-white/[0.1] shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onNavigateToApp}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={onNavigateToApp}
              className="h-10 px-5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-200 group cursor-pointer border border-blue-400/30 overflow-hidden inline-flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-20 left-0 right-0 bg-[#0c0c0e] border-b border-white/[0.08] px-6 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl flex items-center justify-between"
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-zinc-800 flex flex-col gap-3">
                <button
                  onClick={onNavigateToApp}
                  className="w-full h-12 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-700/80 rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateToApp}
                  className="w-full h-12 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl text-center shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
