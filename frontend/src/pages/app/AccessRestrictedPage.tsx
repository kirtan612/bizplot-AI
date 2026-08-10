import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/auth';

export const AccessRestrictedPage: React.FC<{ requiredPermission?: Permission }> = ({ requiredPermission }) => {
  const { role, user, organization } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-white font-mono">
      <div className="max-w-md w-full rounded-2xl bg-[#0A0A0A] border border-rose-900/40 p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600" />

        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40 text-[10px] font-bold uppercase tracking-wider">
            HTTP 403 — FORBIDDEN
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Access Restricted</h2>
          <p className="text-xs text-neutral-400">
            Your current role (<span className="text-rose-400 font-bold">{role?.name || 'RESTRICTED'}</span>) does not hold authorization to inspect this module.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#121212] border border-[#242424] text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">USER IDENTITY:</span>
            <span className="text-white font-bold">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">ORGANIZATION:</span>
            <span className="text-white font-bold">{organization?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">REQUIRED PERMISSION:</span>
            <span className="text-rose-400 font-bold">{requiredPermission || 'restricted.view'}</span>
          </div>
        </div>

        <div className="text-left p-3 rounded-lg bg-[#0F0D15] border border-[#231B30] text-[11px] text-neutral-400 leading-relaxed">
          💡 <span className="text-white font-bold">FastAPI Backend Enforcement:</span> Frontend access restrictions are enforced alongside JWT and organization claims on every backend query.
        </div>

        <Link
          to="/app"
          className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-[#181818] border border-[#333333] text-xs text-white hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
