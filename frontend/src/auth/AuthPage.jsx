import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowLeft, ShieldCheck, Sparkles, Bot, DollarSign, TrendingUp } from 'lucide-react';

import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ForgotPasswordView from './components/ForgotPasswordView';
import ResetPasswordView from './components/ResetPasswordView';
import VerifyOTPView from './components/VerifyOTPView';
import CreateCompanyWizard from './components/CreateCompanyWizard';

export default function AuthPage({ initialView = 'login', onNavigateHome, onAuthComplete }) {
  const [authView, setAuthView] = useState(initialView); // 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-otp' | 'wizard'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setAuthView('verify-otp');
  };

  const handleVerifySuccess = () => {
    setAuthView('wizard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="h-20 max-w-7xl mx-auto px-6 sm:px-8 w-full flex items-center justify-between relative z-20">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="flex items-center gap-3 group text-decoration-none"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Cpu className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-bold text-base tracking-tight text-white font-sans">
            BizPilot<span className="text-blue-400 ml-0.5">AI</span>
          </span>
        </a>

        <button
          onClick={onNavigateHome}
          className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>
      </header>

      {/* Central Content Split Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 w-full flex items-center py-12 relative z-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Panel: Auth Form View */}
          <div className={`${authView === 'wizard' ? 'lg:col-span-12' : 'lg:col-span-6'} transition-all`}>
            <AnimatePresence mode="wait">
              {authView === 'login' && (
                <LoginView
                  key="login"
                  onNavigate={setAuthView}
                  onLoginSuccess={onAuthComplete}
                />
              )}

              {authView === 'register' && (
                <RegisterView
                  key="register"
                  onNavigate={setAuthView}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )}

              {authView === 'forgot-password' && (
                <ForgotPasswordView
                  key="forgot-password"
                  onNavigate={setAuthView}
                />
              )}

              {authView === 'reset-password' && (
                <ResetPasswordView
                  key="reset-password"
                  onNavigate={setAuthView}
                />
              )}

              {authView === 'verify-otp' && (
                <VerifyOTPView
                  key="verify-otp"
                  email={registeredEmail}
                  onVerifySuccess={handleVerifySuccess}
                />
              )}

              {authView === 'wizard' && (
                <CreateCompanyWizard
                  key="wizard"
                  onWizardComplete={onAuthComplete}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel (Desktop Showcase - Hidden during wizard mode) */}
          {authView !== 'wizard' && (
            <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pl-6 border-l border-white/[0.08]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  ENTERPRISE MSME OPERATING SYSTEM
                </div>
                <h2 className="text-3xl font-bold text-white font-sans leading-tight">
                  Autonomous Decision Engine for Modern MSMEs.
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                  Connect your accounting ledger, ERP systems, and warehouse nodes to unlock 24/7 strategic advisory from AI CEO, CFO, and COO agents.
                </p>
              </div>

              {/* Dynamic Telemetry Preview Card */}
              <div className="p-6 rounded-[20px] bg-[#121215] border border-white/10 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Bot className="w-4 h-4 text-purple-400" />
                    AI CFO REAL-TIME TELEMETRY
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08]">
                    <span className="text-[11px] text-zinc-400 font-mono">CASH RUNWAY</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">$284,500</div>
                    <span className="text-[10px] font-mono text-emerald-400">+14.2% this month</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08]">
                    <span className="text-[11px] text-zinc-400 font-mono">NET MARGIN</span>
                    <div className="text-xl font-bold font-mono text-purple-400 mt-1">28.6%</div>
                    <span className="text-[10px] font-mono text-purple-400">+$18.4k recovered</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 text-xs text-zinc-300 font-mono border border-white/[0.06] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>AES-256 Multi-Tenant Data Isolation Enabled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="h-16 max-w-7xl mx-auto px-6 sm:px-8 w-full flex items-center justify-between text-xs text-zinc-500 font-mono relative z-20">
        <div>&copy; {new Date().getFullYear()} BizPilot AI Inc. Security & Compliance Verified.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-zinc-300">Privacy</a>
          <a href="#" className="hover:text-zinc-300">Terms</a>
        </div>
      </footer>
    </div>
  );
}
