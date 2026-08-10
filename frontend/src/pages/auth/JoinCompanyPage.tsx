import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserPlus, User, Mail, Lock, Key, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LightRays from '../../components/LightRays';

export const JoinCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { joinCompany } = useAuth();

  const [fullName, setFullName] = useState('Saurabh Patel');
  const [workEmail, setWorkEmail] = useState('s.patel@aplapollo.com');
  const [password, setPassword] = useState('••••••••••••');
  const [inviteCode, setInviteCode] = useState('BIZ-APL-8842');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await joinCompany({
      fullName,
      workEmail,
      password,
      inviteCode,
    });
    setLoading(false);
    navigate('/app');
  };

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
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CF9EFF]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Bar */}
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
              TEAM MEMBER JOIN
            </span>
          </div>
        </Link>

        <Link
          to="/register"
          className="text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-white px-4 py-2 rounded-xl bg-[#100E17] border border-[#2B233D] transition-colors"
        >
          ← Change Pathway
        </Link>
      </header>

      {/* Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#120F1D] border border-[#2B233D] text-[11px] font-mono text-[#CF9EFF] uppercase tracking-wider">
              PATHWAY B — TEAM MEMBER REGISTRATION
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Join Existing Company
            </h1>
            <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
              Enter your corporate email and company invitation code to connect your account to your organization's workspace.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl bg-[#09080E]/90 backdrop-blur-xl border border-[#2B233D] p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CF9EFF] to-[#A855F7]" />

            {/* Informational Banner */}
            <div className="p-4 rounded-2xl bg-[#14101F] border border-[#2B233D] text-xs font-sans text-neutral-300 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-[#CF9EFF] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white uppercase block font-sans">Controlled Role Access</span>
                <p className="text-[11px] leading-relaxed text-neutral-300 font-sans">
                  Employee accounts do not automatically receive full administrative access. Your specific role and permissions will be defined by your organization's administrator.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Invitation Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-white flex justify-between">
                  <span>COMPANY INVITATION CODE</span>
                  <span className="text-[#CF9EFF] font-mono">e.g. BIZ-APL-8842</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#CF9EFF] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="BIZ-XXXX-1234"
                    className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white font-mono uppercase tracking-wider placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-medium text-neutral-300">YOUR FULL NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Saurabh Patel"
                    className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-neutral-500 font-sans"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-medium text-neutral-300">CORPORATE WORK EMAIL</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-neutral-500 font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-medium text-neutral-300">CREATE PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-neutral-500 font-sans"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#CF9EFF] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c484ff] transition-all shadow-[0_10px_30px_rgba(207,158,255,0.3)] flex items-center justify-center space-x-2 cursor-pointer mt-4 font-sans"
              >
                {loading ? (
                  <span>Verifying Invitation Code...</span>
                ) : (
                  <>
                    <span>Verify Code & Join Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 border-t border-[#171224] text-center text-xs font-mono text-neutral-500">
        © 2026 BizPilot AI Inc. All rights reserved.
      </footer>
    </div>
  );
};

