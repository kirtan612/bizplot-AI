import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  UserPlus,
  Shield,
  Mail,
  User,
  Building2,
  CheckCircle2,
  X,
  Search,
  Sliders,
  MoreVertical,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Permission, TeamMember } from '../../types/auth';

export const TeamManagementPage: React.FC = () => {
  const { teamMembers, roles, inviteMember, updateMemberRole, toggleMemberStatus, hasPermission } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Invite Modal Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteDept, setInviteDept] = useState('Sales & Operations');
  const [inviteRoleId, setInviteRoleId] = useState(roles[3]?.id || 'role-employee');
  const [customPerms, setCustomPerms] = useState<Permission[]>([
    'customers.view',
    'sales.view',
    'inventory.view',
  ]);

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.roleName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || m.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleTogglePerm = (perm: Permission) => {
    if (customPerms.includes(perm)) {
      setCustomPerms(customPerms.filter((p) => p !== perm));
    } else {
      setCustomPerms([...customPerms, perm]);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMember({
      email: inviteEmail,
      name: inviteName,
      department: inviteDept,
      roleId: inviteRoleId,
      customPermissions: customPerms,
    });
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
  };

  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono font-bold uppercase">
              ORGANIZATION GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Team & User Permissions
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Manage organization members, assign dynamic roles, and configure granular module permission matrix.
          </p>
        </div>

        {hasPermission('users.create') && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">TOTAL MEMBERS</span>
          <span className="text-2xl font-extrabold text-white font-mono">{teamMembers.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">ACTIVE USERS</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            {teamMembers.filter((m) => m.status === 'Active').length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">PENDING INVITATIONS</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">
            {teamMembers.filter((m) => m.status === 'Invited').length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">ROLES CONFIGURED</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">{roles.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A0A] p-4 rounded-xl border border-[#202020]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, email, role..."
            className="w-full bg-[#121212] border border-[#242424] focus:border-cyan-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-neutral-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-neutral-400">DEPARTMENT:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#121212] border border-[#242424] text-white rounded-lg px-3 py-1.5 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Executive Board">Executive Board</option>
            <option value="Sales & Operations">Sales & Operations</option>
            <option value="Treasury & Finance">Treasury & Finance</option>
            <option value="Warehouse Logistics">Warehouse Logistics</option>
            <option value="GST Reconciliation">GST Reconciliation</option>
          </select>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl bg-[#0A0A0A] border border-[#222222] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#101010] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#202020]">
                <th className="py-3.5 px-5">MEMBER</th>
                <th className="py-3.5 px-5">ROLE</th>
                <th className="py-3.5 px-5">DEPARTMENT</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5">LAST ACTIVE</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#101010] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/40 flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{member.name}</span>
                        <span className="text-[11px] text-neutral-400 block">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        member.roleName === 'OWNER'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                          : member.roleName === 'MANAGER'
                          ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                          : member.roleName === 'ACCOUNTANT'
                          ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                      }`}
                    >
                      {member.roleName}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-neutral-300">{member.department}</td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.status === 'Active'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : member.status === 'Invited'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-neutral-400 text-[11px]">{member.lastActive}</td>

                  <td className="py-4 px-5 text-right space-x-2">
                    {hasPermission('users.update') && member.roleName !== 'OWNER' && (
                      <button
                        onClick={() => setEditingMember(member)}
                        className="px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-[11px] text-cyan-400 hover:text-white hover:border-cyan-500 cursor-pointer"
                      >
                        Edit Role & Permissions
                      </button>
                    )}
                    {hasPermission('users.delete') && member.roleName !== 'OWNER' && (
                      <button
                        onClick={() => toggleMemberStatus(member.id)}
                        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer ${
                          member.status === 'Active'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/40 hover:bg-rose-900'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900'
                        }`}
                      >
                        {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENTERPRISE INVITE MEMBER MODAL */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-[#262626] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Invite Organization Member</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Send team invitation and configure custom permission matrix
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg bg-[#141414] text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Pooja Verma"
                      className="w-full bg-[#121212] border border-[#262626] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">WORK EMAIL</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="p.verma@company.com"
                      className="w-full bg-[#121212] border border-[#262626] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">DEPARTMENT</label>
                    <input
                      type="text"
                      value={inviteDept}
                      onChange={(e) => setInviteDept(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">ASSIGNED ROLE</label>
                    <select
                      value={inviteRoleId}
                      onChange={(e) => setInviteRoleId(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white cursor-pointer"
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.description.substring(0, 30)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Granular Permission Matrix */}
                <div className="space-y-3 pt-4 border-t border-[#1C1C1C]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">
                      GRANULAR PERMISSION MATRIX CONFIGURATION
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {customPerms.length} Permissions Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0F0F0F] p-4 rounded-xl border border-[#222222]">
                    {/* Finance */}
                    <div className="space-y-2">
                      <span className="text-neutral-400 font-bold block text-[11px] border-b border-[#202020] pb-1">
                        FINANCE & TREASURY
                      </span>
                      {[
                        { perm: 'finance.view', label: 'View Finance & Ledgers' },
                        { perm: 'finance.create', label: 'Create Financial Entries' },
                        { perm: 'cashflow.view', label: 'View Cashflow Forecast' },
                      ].map(({ perm, label }) => (
                        <label key={perm} className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customPerms.includes(perm as any)}
                            onChange={() => handleTogglePerm(perm as any)}
                            className="rounded bg-[#1A1A1A] border-[#333333] text-cyan-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Invoices */}
                    <div className="space-y-2">
                      <span className="text-neutral-400 font-bold block text-[11px] border-b border-[#202020] pb-1">
                        INVOICING & GST
                      </span>
                      {[
                        { perm: 'invoices.view', label: 'View Invoices' },
                        { perm: 'invoices.create', label: 'Generate Invoices' },
                        { perm: 'invoices.delete', label: 'Delete Invoices' },
                      ].map(({ perm, label }) => (
                        <label key={perm} className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customPerms.includes(perm as any)}
                            onChange={() => handleTogglePerm(perm as any)}
                            className="rounded bg-[#1A1A1A] border-[#333333] text-cyan-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Customers & Sales */}
                    <div className="space-y-2">
                      <span className="text-neutral-400 font-bold block text-[11px] border-b border-[#202020] pb-1">
                        CUSTOMERS & SALES
                      </span>
                      {[
                        { perm: 'customers.view', label: 'View Customer Accounts' },
                        { perm: 'customers.create', label: 'Create Customers' },
                        { perm: 'sales.view', label: 'View Sales Telemetry' },
                      ].map(({ perm, label }) => (
                        <label key={perm} className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customPerms.includes(perm as any)}
                            onChange={() => handleTogglePerm(perm as any)}
                            className="rounded bg-[#1A1A1A] border-[#333333] text-cyan-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Reports & AI */}
                    <div className="space-y-2">
                      <span className="text-neutral-400 font-bold block text-[11px] border-b border-[#202020] pb-1">
                        REPORTS & AI ANALYTICS
                      </span>
                      {[
                        { perm: 'reports.view', label: 'View Financial Reports' },
                        { perm: 'ai.insights.view', label: 'View AI Insights' },
                        { perm: 'ai.insights.create', label: 'Query AI Business Analyst' },
                      ].map(({ perm, label }) => (
                        <label key={perm} className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customPerms.includes(perm as any)}
                            onChange={() => handleTogglePerm(perm as any)}
                            className="rounded bg-[#1A1A1A] border-[#333333] text-cyan-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1C1C1C]">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#141414] text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200"
                  >
                    Send Invitation & Permissions
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT ROLE & PERMISSIONS MODAL */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-[#262626] rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                <h3 className="text-lg font-bold text-white">Edit Role: {editingMember.name}</h3>
                <button onClick={() => setEditingMember(null)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold">SELECT NEW ROLE</label>
                  <select
                    value={editingMember.roleId}
                    onChange={(e) => {
                      updateMemberRole(editingMember.id, e.target.value);
                      setEditingMember(null);
                    }}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
