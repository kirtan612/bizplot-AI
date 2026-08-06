import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, UserPlus, X, Check, Copy, ShieldCheck } from 'lucide-react';

export default function InviteTeamModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Manager');
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://bizpilot.ai/invite/org_89201948');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (email) {
      setInvited(true);
      setTimeout(() => {
        setInvited(false);
        setEmail('');
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121215] border border-white/20 rounded-[20px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
            <p className="text-xs text-zinc-400">Grant role-based access to your business OS.</p>
          </div>
        </div>

        {invited ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-xs space-y-1">
            <Check className="w-5 h-5 mx-auto" />
            <p className="font-semibold">Invitation Dispatched!</p>
            <p className="text-zinc-400 text-[11px]">Invite email sent to {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Teammate Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full h-12 pl-11 pr-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">System Role & Permissions</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="Manager">Manager (Full Inventory & Sales Execution)</option>
                <option value="Staff">Staff (Read-Only Stock Registers)</option>
                <option value="Owner">Co-Owner (Full Financial & AI Board Governance)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 h-12 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-1.5 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>

              <button
                type="submit"
                className="flex-1 h-12 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.35)]"
              >
                Send Invite
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
