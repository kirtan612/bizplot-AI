import React, { useState } from 'react';
import { Shield, Lock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { Permission, Role } from '../../types/auth';

export const RoleManagementPage: React.FC = () => {
  const { roles, updateRole } = useAuth();
  const { tokens: t } = useTheme();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-owner');
  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const allPermissionGroups: { category: string; perms: { key: Permission; label: string }[] }[] = [
    {
      category: 'Dashboard & Intelligence',
      perms: [
        { key: 'dashboard.view', label: 'View Main Command Center' },
        { key: 'ai.insights.view', label: 'View AI Executive Insights' },
        { key: 'ai.executive_center.view', label: 'Access AI Executive Center' },
        { key: 'ai.executive_room.view', label: 'Access Executive Room Boardroom' },
      ],
    },
    {
      category: 'Sales & Distribution',
      perms: [
        { key: 'sales.view', label: 'View Sales Orders' },
        { key: 'sales.create', label: 'Create New Sales Orders' },
        { key: 'sales.update', label: 'Modify Sales Orders' },
        { key: 'customers.view', label: 'View Customer Accounts' },
      ],
    },
    {
      category: 'Inventory & Procurement',
      perms: [
        { key: 'inventory.view', label: 'View Inventory SKUs' },
        { key: 'purchases.view', label: 'View Purchase Orders & Suppliers' },
        { key: 'invoices.view', label: 'View Invoices & Billing' },
        { key: 'expenses.view', label: 'View Expense Telemetry' },
      ],
    },
    {
      category: 'Finance & Governance',
      perms: [
        { key: 'finance.view', label: 'View Finance Telemetry' },
        { key: 'cashflow.view', label: 'View Cash Flow Projections' },
        { key: 'reports.view', label: 'View Reports Hub' },
        { key: 'users.view', label: 'Manage Team Members' },
        { key: 'roles.view', label: 'Manage Roles & Security Matrix' },
      ],
    },
  ];

  const handleTogglePermission = (permKey: Permission) => {
    if (!selectedRole || selectedRole.name === 'OWNER') return;

    let updated: Permission[];
    if (selectedRole.permissions.includes(permKey)) {
      updated = selectedRole.permissions.filter((p) => p !== permKey);
    } else {
      updated = [...selectedRole.permissions, permKey];
    }

    updateRole(selectedRole.id, {
      name: selectedRole.name,
      description: selectedRole.description,
      permissions: updated,
    });
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
              <Shield size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              SECURITY GOVERNANCE
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Roles & RBAC Permission Matrix
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Configure role-based access control policies across all modules and AI executive features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Roles List */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 28,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
          className="lg:col-span-1"
        >
          <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint }}>
            Configured Roles ({roles.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roles.map((r) => {
              const active = selectedRoleId === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    border: `1px solid ${active ? t.accent : t.border}`,
                    background: active ? t.accentSoft : t.card,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{r.name}</span>
                    {r.isSystemRole && <Lock size={12} color={t.textFaint} />}
                  </div>
                  <span style={{ fontSize: 11, color: t.textSub }}>{r.permissions.length} permissions</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Permission Matrix */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 28,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
          className="lg:col-span-3"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {selectedRole.name} Role Matrix
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: t.textSub }}>{selectedRole.description}</p>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: t.accentSoft, color: t.accent }}>
              {selectedRole.permissions.length} Active Grants
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {allPermissionGroups.map((group) => (
              <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint }}>{group.category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.perms.map((p) => {
                    const isGranted = selectedRole.permissions.includes(p.key);
                    return (
                      <div
                        key={p.key}
                        onClick={() => handleTogglePermission(p.key)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 16,
                          background: isGranted ? t.accentSoft : t.card,
                          border: `1px solid ${isGranted ? t.accent : t.border}`,
                          cursor: selectedRole.name === 'OWNER' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: 12.5, fontWeight: isGranted ? 600 : 400, color: isGranted ? t.text : t.textSub }}>
                          {p.label}
                        </span>
                        {isGranted && <Check size={14} color={t.accent} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
