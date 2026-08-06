import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Building } from 'lucide-react';

export default function RegisterView({ onNavigate, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('Rajesh Sharma');
  const [email, setEmail] = useState('rajesh@apexindustrial.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegisterSuccess(email);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Card Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/30 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
          <Building className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
          Register Company Account
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          Create an MSME owner profile to initialize your dedicated AI Operating System.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[#121215] border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Full Name (Company Owner)</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full h-12 pl-11 pr-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Work Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-12 pl-11 pr-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-9 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Accept Terms */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400 select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-[#0d0d0f] border-zinc-700 text-purple-600 focus:ring-0 cursor-pointer"
              />
              <span className="leading-normal">
                I agree to the <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>, <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>, and AES-256 Data Isolation Agreement.
              </span>
            </label>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering Account...
              </span>
            ) : (
              <>
                <span>Create Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Switch Link */}
      <div className="mt-6 text-center text-xs text-zinc-400">
        Already have a registered account?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer ml-1"
        >
          Sign In Here
        </button>
      </div>
    </motion.div>
  );
}
