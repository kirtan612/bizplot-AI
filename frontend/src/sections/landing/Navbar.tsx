import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#product-showcase' },
    { name: 'Solutions', href: '#business-overview' },
    { name: 'AI Executives', href: '#ai-executives' },
    { name: 'Intelligence', href: '#customer-intelligence' },
    { name: 'How It Works', href: '#company-knowledge' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-nav py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-[#1E1E1E]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-white flex items-center space-x-1.5">
              <span>BIZPILOT</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#1F1F1F] border border-[#333333] font-mono text-neutral-300">
                AI
              </span>
            </span>
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase -mt-1">
              INDIAN BUSINESS OS
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/signin"
            className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
          >
            Login
          </Link>
          <Link to="/register">
            <MagneticButton variant="glow" size="sm">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline-block" />
            </MagneticButton>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#141414] text-white border border-[#262626] cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-b border-[#222222] px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-wider font-semibold text-neutral-300 hover:text-white py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#1F1F1F] space-y-3">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center text-xs uppercase tracking-wider font-semibold text-neutral-300 py-2 border border-[#292929] rounded-lg"
              >
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <MagneticButton variant="primary" size="md" className="w-full">
                  Get Started
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
