import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ForgotPasswordView({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/30 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
          Reset Password
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          Enter your registered work email to receive an instant secure reset link.
        </p>
      </div>

      <div className="bg-[#121215] border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden">
        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Reset Link Sent</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We sent a 256-bit encrypted password reset link to <span className="text-white font-mono">{email}</span>. Please check your inbox or spam folder.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => onNavigate('reset-password')}
                className="w-full h-12 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-zinc-400 hover:text-white pt-2 cursor-pointer"
              >
                Re-enter email address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Registered Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-12 pl-11 pr-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Security Token...
                </span>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => onNavigate('login')}
          className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </motion.div>
  );
}
