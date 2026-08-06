import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VerifyOTPView({ email, onVerifySuccess }) {
  const [otp, setOtp] = useState(['4', '8', '9', '2', '0', '6']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onVerifySuccess();
      }, 700);
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <KeyRound className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
          Verify Security Code
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          We sent a 6-digit verification pin to <span className="text-white font-mono">{email || 'rajesh@apexindustrial.com'}</span>
        </p>
      </div>

      <div className="bg-[#121215] border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6 Input Boxes */}
          <div className="flex items-center justify-center gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 bg-[#0d0d0f] border border-white/15 focus:border-cyan-400 rounded-xl text-xl font-bold font-mono text-center text-white outline-none transition-colors shadow-inner"
              />
            ))}
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            {timer > 0 ? (
              <span>Resend code in <span className="text-cyan-400 font-bold">00:{timer < 10 ? `0${timer}` : timer}</span></span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend 6-Digit Code
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full h-12 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Code...
              </span>
            ) : (
              <>
                <span>Verify & Launch Setup Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
