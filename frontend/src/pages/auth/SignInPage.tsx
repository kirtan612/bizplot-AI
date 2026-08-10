import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LightRays from '../../components/LightRays';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('v.shah@aplapollo.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    await signIn(email, password);
    setLoading(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden font-sans">
      {/* React-Bits WebGL LightRays Background in Signature Purple */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <LightRays
          raysOrigin="top-center"
          raysColor="#CF9EFF"
          raysSpeed={1}
          lightSpread={0.6}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.12}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* Subtle Purple Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CF9EFF]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#CF9EFF] text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-white flex items-center space-x-1.5">
              <span>BIZPILOT</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#1F1F1F] border border-[#333333] font-mono text-[#CF9EFF]">
                AI
              </span>
            </span>
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase -mt-1">
              ENTERPRISE COMMAND
            </span>
          </div>
        </Link>

        <Link
          to="/register"
          className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white px-4 py-2 rounded-xl bg-[#100E17] border border-[#2B233D] transition-colors"
        >
          New Company? <span className="text-[#CF9EFF] font-bold ml-1">Register →</span>
        </Link>
      </header>

      {/* Main Content Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg space-y-8 text-center"
        >
          {/* Hero Headline directly above Login Box */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              See Your Business.
            </h1>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#CF9EFF] tracking-tight">
              In One Place.
            </h2>
          </div>

          {/* Centered Login Card Container with Side Glow Accent Lines */}
          <div className="relative max-w-md mx-auto">
            {/* Horizontal Side Glowing Accent Lines (Reference Image) */}
            <div className="hidden md:block absolute top-1/2 -left-60 w-60 h-[1px] bg-gradient-to-r from-transparent via-[#CF9EFF]/30 to-[#CF9EFF]/80 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#CF9EFF] absolute right-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#CF9EFF]" />
            </div>
            <div className="hidden md:block absolute top-1/2 -right-60 w-60 h-[1px] bg-gradient-to-l from-transparent via-[#CF9EFF]/30 to-[#CF9EFF]/80 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#CF9EFF] absolute left-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#CF9EFF]" />
            </div>

            {/* Login Card Box */}
            <div className="rounded-3xl bg-[#09080E]/90 backdrop-blur-xl border border-[#2B233D] p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CF9EFF] via-[#A855F7] to-[#6366F1]" />

              <div className="text-center space-y-1">
                <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">Welcome Back</h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  Login to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username / Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-neutral-300 block">
                    Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] focus:ring-1 focus:ring-[#CF9EFF] rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-neutral-500 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-neutral-300 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#12101A] border border-[#2B233D] focus:border-[#CF9EFF] focus:ring-1 focus:ring-[#CF9EFF] rounded-xl px-4 py-3 pl-10 pr-10 text-xs text-white placeholder-neutral-500 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-[11px] font-sans text-neutral-400 hover:text-[#CF9EFF] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#CF9EFF] text-black font-extrabold text-xs tracking-wide hover:bg-[#c484ff] transition-all shadow-[0_10px_30px_rgba(207,158,255,0.3)] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 font-sans"
                >
                  {loading ? (
                    <span>Authenticating Session...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Persona Selectors */}
              <div className="pt-4 border-t border-[#1F192C] space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block text-center">
                  QUICK DEMO PERSONA LOGIN
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('v.shah@aplapollo.com');
                      setPassword('demo1234');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#14101F] border border-[#2B233D] text-neutral-300 hover:border-[#CF9EFF] text-left truncate cursor-pointer font-sans"
                  >
                    👑 Owner: <span className="text-[#CF9EFF]">v.shah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('r.mehta@aplapollo.com');
                      setPassword('demo1234');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#14101F] border border-[#2B233D] text-neutral-300 hover:border-[#CF9EFF] text-left truncate cursor-pointer font-sans"
                  >
                    📊 Accountant: <span className="text-[#CF9EFF]">r.mehta</span>
                  </button>
                </div>
              </div>
            </div>
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

