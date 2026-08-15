import React, { useState } from 'react';
import {
  UserPlus,
  Shield,
  X,
  Search,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { Permission, TeamMember } from '../../types/auth';

export const TeamManagementPage: React.FC = () => {
  const { teamMembers, roles, inviteMember, toggleMemberStatus, hasPermission } = useAuth();
  const { tokens: t } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showInviteModal, setShowInviteModal] = useState(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Banner */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
        className="flex-col sm:flex-row"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UsersRound size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              ORGANIZATION GOVERNANCE
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Team & User Permissions
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Manage organization members, assign dynamic roles, and configure granular permissions.
          </p>
        </div>

        {hasPermission('users.create') && (
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              background: t.dark,
              color: t.darkText,
              border: 'none',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <UserPlus size={15} />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: t.textFaint, display: 'block' }}>TOTAL MEMBERS</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{teamMembers.length}</span>
        </div>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: t.textFaint, display: 'block' }}>ACTIVE USERS</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: t.ok, fontFamily: "'Manrope', sans-serif" }}>
            {teamMembers.filter((m) => m.status === 'Active').length}
          </span>
        </div>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: t.textFaint, display: 'block' }}>PENDING INVITATIONS</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: t.warn, fontFamily: "'Manrope', sans-serif" }}>
            {teamMembers.filter((m) => m.status === 'Invited').length}
          </span>
        </div>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: t.textFaint, display: 'block' }}>ROLES CONFIGURED</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: t.accent, fontFamily: "'Manrope', sans-serif" }}>{roles.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, background: t.card, padding: 14, borderRadius: 999, border: `1px solid ${t.border}` }} className="flex-col sm:flex-row">
        <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
          <Search size={14} color={t.textFaint} style={{ position: 'absolute', left: 14, top: 11 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, email, role..."
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 999,
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              fontSize: 12.5,
              color: t.text,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textSub }}>
          <span>DEPARTMENT:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              color: t.text,
              borderRadius: 999,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="ALL">All Departments</option>
            <option value="Executive Board">Executive Board</option>
            <option value="Sales & Operations">Sales & Operations</option>
            <option value="Treasury & Finance">Treasury & Finance</option>
            <option value="Warehouse Logistics">Warehouse Logistics</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 22, overflowX: 'auto' }}>
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}`, color: t.textFaint }}>
              <th className="pb-3 font-semibold">MEMBER</th>
              <th className="pb-3 font-semibold">DEPARTMENT</th>
              <th className="pb-3 font-semibold">ROLE</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold">LAST ACTIVE</th>
              <th className="pb-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td className="py-3.5">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.accent, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'Manrope', sans-serif" }}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: t.text, display: 'block', fontFamily: "'Manrope', sans-serif" }}>{member.name}</span>
                      <span style={{ fontSize: 11, color: t.textFaint }}>{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5" style={{ color: t.textSub }}>{member.department}</td>
                <td className="py-3.5">
                  <span style={{ padding: '3px 10px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontWeight: 600, fontSize: 11 }}>
                    {member.roleName}
                  </span>
                </td>
                <td className="py-3.5">
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: member.status === 'Active' ? t.ok : t.warn, background: t.accentSoft }}>
                    {member.status}
                  </span>
                </td>
                <td className="py-3.5 text-slate-500 font-mono text-[11px]" style={{ color: t.textFaint }}>{member.lastActive}</td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => toggleMemberStatus(member.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 12, fontWeight: 600 }}
                  >
                    {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, width: 440, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.textSub }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: t.textFaint, display: 'block', marginBottom: 4 }}>FULL NAME</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Vikramaditya Shah"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, color: t.text, fontSize: 12.5, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: t.textFaint, display: 'block', marginBottom: 4 }}>WORK EMAIL</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, color: t.text, fontSize: 12.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, color: t.textSub, fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: 999, background: t.dark, color: t.darkText, border: 'none', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
