import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, User, Lock, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AcceptInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const { acceptInvitation } = useAuth();

  const [fullName, setFullName] = useState('Pooja Verma');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await acceptInvitation('INV-8842', fullName, password);
    setLoading(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white text-black font-bold flex items-center justify-center">
            <Shield className="w-5 h-5 fill-black" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            BIZPILOT <span className="text-xs px-1.5 py-0.5 rounded bg-[#1F1F1F] font-mono text-neutral-300">AI</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[11px] font-mono uppercase tracking-wider">
              INVITATION VERIFIED
            </span>
            <h1 className="text-3xl font-extrabold text-white">Accept Team Invitation</h1>
            <p className="text-xs text-neutral-400">
              You have been invited by <span className="text-white font-bold">APL Apollo Steel Distribution Ltd.</span> as an <span className="text-emerald-400 font-bold">ACCOUNTANT</span>.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-[#222222] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#242424] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">ORGANIZATION:</span>
                <span className="text-white font-bold">APL Apollo Steel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">ASSIGNED ROLE:</span>
                <span className="text-emerald-400 font-bold">ACCOUNTANT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">DEPARTMENT:</span>
                <span className="text-white font-bold">GST Reconciliation</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">CONFIRM YOUR FULL NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">SET WORKSPACE PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <span>Configuring Account...</span>
                ) : (
                  <>
                    <span>Accept & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 border-t border-[#141414] text-center text-xs font-mono text-neutral-600">
        © 2026 BizPilot AI Inc. All rights reserved.
      </footer>
    </div>
  );
};
