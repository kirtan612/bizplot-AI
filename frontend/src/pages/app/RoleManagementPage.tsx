import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Copy, Trash2, Edit, Check, X, Sparkles, Lock, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Permission, Role } from '../../types/auth';

const AVAILABLE_PERMISSIONS: { group: string; items: { id: Permission; label: string }[] }[] = [
  {
    group: 'DASHBOARD & AI',
    items: [
      { id: 'dashboard.view', label: 'View Dashboard' },
      { id: 'ai.insights.view', label: 'View AI Predictive Telemetry' },
      { id: 'ai.insights.create', label: 'Execute AI Analyst Queries' },
    ],
  },
  {
    group: 'FINANCE & CASH FLOW',
    items: [
      { id: 'finance.view', label: 'View Financial Ledgers' },
      { id: 'finance.create', label: 'Create Financial Journal' },
      { id: 'finance.update', label: 'Edit Ledger Postings' },
      { id: 'cashflow.view', label: 'View Cashflow Projections' },
    ],
  },
  {
    group: 'INVOICING & EXPENSES',
    items: [
      { id: 'invoices.view', label: 'View Invoices' },
      { id: 'invoices.create', label: 'Create Invoices' },
      { id: 'invoices.update', label: 'Update Invoices' },
      { id: 'invoices.delete', label: 'Delete Invoices' },
      { id: 'expenses.view', label: 'View Expense Claims' },
      { id: 'expenses.create', label: 'Create Expenses' },
    ],
  },
  {
    group: 'CUSTOMERS & SALES',
    items: [
      { id: 'customers.view', label: 'View Customer Accounts' },
      { id: 'customers.create', label: 'Create Customers' },
      { id: 'customers.update', label: 'Update Customers' },
      { id: 'sales.view', label: 'View Sales Telemetry' },
      { id: 'sales.create', label: 'Create Sales Orders' },
    ],
  },
  {
    group: 'INVENTORY & PURCHASES',
    items: [
      { id: 'inventory.view', label: 'View Inventory SKUs' },
      { id: 'inventory.create', label: 'Add Inventory Items' },
      { id: 'purchases.view', label: 'View Purchase Orders' },
      { id: 'purchases.create', label: 'Create Purchase Orders' },
    ],
  },
  {
    group: 'GOVERNANCE & REPORTS',
    items: [
      { id: 'reports.view', label: 'View Reports Hub' },
      { id: 'reports.finance.view', label: 'View Financial Audit Reports' },
      { id: 'reports.sales.view', label: 'View Sales Telemetry Reports' },
      { id: 'users.view', label: 'View Team Members' },
      { id: 'users.create', label: 'Invite Team Members' },
      { id: 'roles.view', label: 'View Roles & Security Settings' },
    ],
  },
];

export const RoleManagementPage: React.FC = () => {
  const { roles, teamMembers, createCustomRole, updateRole, deleteRole, hasPermission } = useAuth();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [roleName, setRoleName] = useState('Sales Manager');
  const [roleDesc, setRoleDesc] = useState('Manages customer accounts, sales orders, and sales performance reports.');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([
    'customers.view',
    'customers.create',
    'customers.update',
    'sales.view',
    'sales.create',
    'sales.update',
    'reports.sales.view',
  ]);

  const handleTogglePerm = (perm: Permission) => {
    if (selectedPerms.includes(perm)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== perm));
    } else {
      setSelectedPerms([...selectedPerms, perm]);
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      updateRole(editingRole.id, {
        name: roleName,
        description: roleDesc,
        permissions: selectedPerms,
      });
    } else {
      createCustomRole({
        name: roleName,
        description: roleDesc,
        permissions: selectedPerms,
      });
    }
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleDuplicate = (roleToDup: Role) => {
    setRoleName(`${roleToDup.name} (Copy)`);
    setRoleDesc(`Custom copy of ${roleToDup.name} role.`);
    setSelectedPerms([...roleToDup.permissions]);
    setEditingRole(null);
    setShowRoleModal(true);
  };

  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold uppercase">
              RBAC GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Role & Security Configuration
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Configure system default roles or construct custom roles with granular permission mappings.
          </p>
        </div>

        {hasPermission('roles.create') && (
          <button
            onClick={() => {
              setEditingRole(null);
              setRoleName('Custom Role');
              setRoleDesc('Custom role description...');
              setSelectedPerms(['dashboard.view']);
              setShowRoleModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-purple-400 transition-all shadow-lg flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </button>
        )}
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((roleItem) => {
          const membersWithRole = teamMembers.filter((m) => m.roleId === roleItem.id || m.roleName === roleItem.name);
          return (
            <motion.div
              key={roleItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#0A0A0A] border border-[#222222] p-6 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white tracking-tight">{roleItem.name}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {roleItem.isSystemRole ? (
                      <span className="px-2.5 py-0.5 rounded bg-[#161616] text-neutral-400 border border-[#2A2A2A] text-[10px] font-mono font-bold">
                        SYSTEM DEFAULT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold">
                        CUSTOM ROLE
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded bg-[#121212] text-cyan-400 border border-[#242424] text-[10px] font-mono">
                      {membersWithRole.length} Users
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                  {roleItem.description}
                </p>

                {/* Permissions Pills */}
                <div className="space-y-2 pt-2 border-t border-[#161616]">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase block">
                    PERMISSIONS GRANTED ({roleItem.permissions.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {roleItem.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 rounded bg-[#141414] border border-[#252525] text-[10px] font-mono text-neutral-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#161616] flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => handleDuplicate(roleItem)}
                  className="flex items-center space-x-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>

                <div className="flex items-center space-x-2">
                  {!roleItem.isSystemRole && hasPermission('roles.update') && (
                    <button
                      onClick={() => {
                        setEditingRole(roleItem);
                        setRoleName(roleItem.name);
                        setRoleDesc(roleItem.description);
                        setSelectedPerms([...roleItem.permissions]);
                        setShowRoleModal(true);
                      }}
                      className="px-3 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-purple-400 hover:text-white cursor-pointer"
                    >
                      Edit
                    </button>
                  )}

                  {!roleItem.isSystemRole && hasPermission('roles.update') && membersWithRole.length === 0 && (
                    <button
                      onClick={() => deleteRole(roleItem.id)}
                      className="p-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 hover:bg-rose-900 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CREATE / EDIT CUSTOM ROLE MODAL */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-[#262626] rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {editingRole ? `Edit Custom Role: ${editingRole.name}` : 'Create Custom Organization Role'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Define role title and explicitly select module permissions
                  </p>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1 rounded-lg bg-[#141414] text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-6 font-mono text-xs">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">ROLE NAME</label>
                    <input
                      type="text"
                      required
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. Sales Manager"
                      className="w-full bg-[#121212] border border-[#262626] focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">ROLE DESCRIPTION</label>
                    <input
                      type="text"
                      required
                      value={roleDesc}
                      onChange={(e) => setRoleDesc(e.target.value)}
                      placeholder="Describe what members holding this role are responsible for..."
                      className="w-full bg-[#121212] border border-[#262626] focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Permissions Selector Matrix */}
                <div className="space-y-4 pt-4 border-t border-[#1C1C1C]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">
                      ASSIGNED PERMISSION IDENTIFIERS
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold">
                      {selectedPerms.length} Permissions Active
                    </span>
                  </div>

                  <div className="space-y-4 bg-[#0F0F0F] p-4 rounded-xl border border-[#222222]">
                    {AVAILABLE_PERMISSIONS.map((group) => (
                      <div key={group.group} className="space-y-2">
                        <span className="text-neutral-400 font-bold block text-[11px] border-b border-[#1C1C1C] pb-1">
                          {group.group}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {group.items.map((item) => {
                            const isChecked = selectedPerms.includes(item.id);
                            return (
                              <label
                                key={item.id}
                                className={`flex items-center space-x-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-purple-950/40 border-purple-800/60 text-white'
                                    : 'bg-[#141414] border-[#222222] text-neutral-400 hover:text-neutral-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePerm(item.id)}
                                  className="rounded bg-[#1A1A1A] border-[#333333] text-purple-500"
                                />
                                <span className="truncate">{item.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1C1C1C]">
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#141414] text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold uppercase tracking-wider hover:bg-purple-400 cursor-pointer"
                  >
                    Save Custom Role
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
