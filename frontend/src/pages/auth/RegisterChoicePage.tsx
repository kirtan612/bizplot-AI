import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Building2, UserPlus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import LightRays from '../../components/LightRays';

export const RegisterChoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden font-sans">
      {/* React-Bits WebGL LightRays Background on Pitch Black */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <LightRays
          raysOrigin="top-center"
          raysColor="#CF9EFF"
          raysSpeed={1}
          lightSpread={0.6}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CF9EFF]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#CF9EFF] text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-white flex items-center space-x-1.5 font-sans">
              <span>BIZPILOT</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#1F1F1F] border border-[#333333] font-mono text-[#CF9EFF]">
                AI
              </span>
            </span>
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase -mt-1">
              ENTERPRISE REGISTRATION
            </span>
          </div>
        </Link>

        <Link
          to="/signin"
          className="text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white px-4 py-2 rounded-xl bg-[#100E17] border border-[#2B233D] transition-colors"
        >
          Already registered? <span className="text-[#CF9EFF] font-bold ml-1">Sign In →</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-4xl space-y-10 text-center">
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 max-w-2xl mx-auto"
          >
            <span className="px-3 py-1 rounded-full bg-[#120F1D] border border-[#2B233D] text-[11px] font-mono text-[#CF9EFF] uppercase tracking-wider">
              MULTI-TENANT ARCHITECTURE
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
              Choose Your Registration Pathway
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              BizPilot AI isolates company data at the organization level. Select how you wish to initialize your business account.
            </p>
          </motion.div>

          {/* Two Prominent Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* PATH 1: Create a new company */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/create-company')}
              className="rounded-3xl bg-[#09080E]/90 backdrop-blur-xl border border-[#2B233D] hover:border-[#CF9EFF]/80 p-8 space-y-6 cursor-pointer group transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CF9EFF] to-[#A855F7] opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#CF9EFF]/10 border border-[#CF9EFF]/30 text-[#CF9EFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#CF9EFF] font-semibold block mb-1">
                    PATHWAY A — ORGANIZATIONAL FOUNDER
                  </span>
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-[#CF9EFF] transition-colors font-sans">
                    Create a New Company
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Start a fresh organization tenant. As the founder, you will automatically be assigned the <span className="text-white font-bold">OWNER</span> role with complete control over workspaces, team invitations, and financial permissions.
                </p>

                <ul className="space-y-2 text-xs font-sans text-neutral-300 pt-2 border-t border-[#1F192C]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9EFF] shrink-0" />
                    <span>Automatic OWNER Role Assignment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9EFF] shrink-0" />
                    <span>Dedicated Organization Workspace</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9EFF] shrink-0" />
                    <span>Invite Team & Custom Permission Roles</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-sans text-[#CF9EFF] font-bold group-hover:translate-x-1 transition-transform">
                <span>Start Company Setup</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* PATH 2: Join an existing company */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate('/join-company')}
              className="rounded-3xl bg-[#09080E]/90 backdrop-blur-xl border border-[#2B233D] hover:border-[#CF9EFF]/80 p-8 space-y-6 cursor-pointer group transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-1">
                    PATHWAY B — TEAM MEMBER / EMPLOYEE
                  </span>
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-purple-400 transition-colors font-sans">
                    Join an Existing Company
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Join your company's existing BizPilot workspace using an invitation link or company join code. Your role and specific module permissions will be assigned by your organization administrator.
                </p>

                <ul className="space-y-2 text-xs font-sans text-neutral-300 pt-2 border-t border-[#1F192C]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Join via Company Code (e.g. BIZ-APL-8842)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Controlled Administrator Permissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Secure Identity & Role Verification</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-sans text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Enter Join Code</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 border-t border-[#171224] text-center text-xs font-mono text-neutral-500">
        © 2026 BizPilot AI Inc. All rights reserved.
      </footer>
    </div>
  );
};

