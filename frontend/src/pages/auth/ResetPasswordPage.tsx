import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import LightRays from '../../components/LightRays';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
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

      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#CF9EFF] text-black font-bold flex items-center justify-center">
            <Shield className="w-5 h-5 fill-black" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white font-sans">
            BIZPILOT <span className="text-xs px-1.5 py-0.5 rounded bg-[#1F1F1F] font-mono text-[#CF9EFF]">AI</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#120F1D] border border-[#2B233D] text-[11px] font-mono text-[#CF9EFF] uppercase tracking-wider">
              TOKEN VERIFIED
            </span>
            <h1 className="text-3xl font-extrabold text-white font-sans">Set New Password</h1>
            <p className="text-xs text-neutral-400 font-sans">
              Create a new secure password for your organization user account.
            </p>
          </div>

          <div className="rounded-3xl bg-[#09080E]/90 backdrop-blur-xl border border-[#2B233D] p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CF9EFF] to-[#A855F7]" />

            {!completed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-neutral-300 block">NEW SECURE PASSWORD</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-neutral-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-neutral-300 block">CONFIRM NEW PASSWORD</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-neutral-500 font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#CF9EFF] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c484ff] transition-all shadow-[0_10px_30px_rgba(207,158,255,0.3)] flex items-center justify-center space-x-2 cursor-pointer font-sans"
                >
                  <span>Update Password & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-[#CF9EFF] mx-auto" />
                <h3 className="text-base font-bold text-white font-sans">Password Updated Successfully</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Your credentials have been updated. You may now log in to your workspace.
                </p>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full py-3.5 rounded-xl bg-[#CF9EFF] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c484ff] font-sans"
                >
                  Sign In to Workspace →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 border-t border-[#171224] text-center text-xs font-mono text-neutral-500">
        © 2026 BizPilot AI Inc. All rights reserved.
      </footer>
    </div>
  );
};

