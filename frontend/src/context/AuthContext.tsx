import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Permission,
  User,
  Organization,
  Role,
  TeamMember,
  AuthState,
  InviteMemberPayload,
  CreateCompanyPayload,
  JoinCompanyPayload,
  CreateRolePayload,
} from '../types/auth';

const ALL_PERMISSIONS: Permission[] = [
  'dashboard.view',
  'customers.view',
  'customers.create',
  'customers.update',
  'customers.delete',
  'sales.view',
  'sales.create',
  'sales.update',
  'inventory.view',
  'inventory.create',
  'inventory.update',
  'purchases.view',
  'purchases.create',
  'purchases.update',
  'invoices.view',
  'invoices.create',
  'invoices.update',
  'invoices.delete',
  'expenses.view',
  'expenses.create',
  'expenses.update',
  'finance.view',
  'finance.create',
  'finance.update',
  'cashflow.view',
  'reports.view',
  'reports.finance.view',
  'reports.sales.view',
  'employees.view',
  'employees.create',
  'employees.update',
  'users.view',
  'users.create',
  'users.update',
  'users.delete',
  'roles.view',
  'roles.create',
  'roles.update',
  'company.settings',
  'ai.insights.view',
  'ai.insights.create',
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'role-owner',
    name: 'OWNER',
    description: 'Full organization access and administrative control over billing, team, and security.',
    isSystemRole: true,
    permissions: ALL_PERMISSIONS,
  },
  {
    id: 'role-manager',
    name: 'MANAGER',
    description: 'Management access for sales, operations, customer accounts, inventory, and analytics.',
    isSystemRole: true,
    permissions: [
      'dashboard.view',
      'customers.view',
      'customers.create',
      'customers.update',
      'sales.view',
      'sales.create',
      'sales.update',
      'inventory.view',
      'inventory.create',
      'inventory.update',
      'purchases.view',
      'purchases.create',
      'purchases.update',
      'reports.view',
      'reports.sales.view',
      'employees.view',
      'ai.insights.view',
      'ai.insights.create',
    ],
  },
  {
    id: 'role-accountant',
    name: 'ACCOUNTANT',
    description: 'Finance, ledgers, invoices, cashflow forecasting, tax reconciliation, and financial reports.',
    isSystemRole: true,
    permissions: [
      'dashboard.view',
      'invoices.view',
      'invoices.create',
      'invoices.update',
      'expenses.view',
      'expenses.create',
      'expenses.update',
      'finance.view',
      'finance.create',
      'finance.update',
      'cashflow.view',
      'reports.view',
      'reports.finance.view',
    ],
  },
  {
    id: 'role-employee',
    name: 'EMPLOYEE',
    description: 'Restricted operational access required for assigned daily tasks and order processing.',
    isSystemRole: true,
    permissions: [
      'dashboard.view',
      'customers.view',
      'sales.view',
      'inventory.view',
      'ai.insights.view',
    ],
  },
];

const INITIAL_ORG: Organization = {
  id: 'org-apl-apollo',
  name: 'APL Apollo Steel Distribution Ltd.',
  type: 'Steel & Metal Infrastructure Distribution',
  size: '51-200 Employees',
  inviteCode: 'BIZ-APL-8842',
  createdAt: '2025-01-15',
};

const INITIAL_USER: User = {
  id: 'usr-owner-01',
  name: 'Vikramaditya Shah',
  email: 'v.shah@aplapollo.com',
  department: 'Executive Board',
  status: 'Active',
  lastActive: 'Just now',
};

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'usr-owner-01',
    name: 'Vikramaditya Shah',
    email: 'v.shah@aplapollo.com',
    roleId: 'role-owner',
    roleName: 'OWNER',
    department: 'Executive Board',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'usr-mgr-02',
    name: 'Ananya Deshmukh',
    email: 'a.deshmukh@aplapollo.com',
    roleId: 'role-manager',
    roleName: 'MANAGER',
    department: 'Sales & Operations',
    status: 'Active',
    lastActive: '12m ago',
  },
  {
    id: 'usr-acc-03',
    name: 'Rajesh Mehta',
    email: 'r.mehta@aplapollo.com',
    roleId: 'role-accountant',
    roleName: 'ACCOUNTANT',
    department: 'Treasury & Finance',
    status: 'Active',
    lastActive: '45m ago',
  },
  {
    id: 'usr-emp-04',
    name: 'Saurabh Patel',
    email: 's.patel@aplapollo.com',
    roleId: 'role-employee',
    roleName: 'EMPLOYEE',
    department: 'Warehouse Logistics',
    status: 'Active',
    lastActive: '2h ago',
  },
  {
    id: 'usr-inv-05',
    name: 'Pooja Verma',
    email: 'p.verma@aplapollo.com',
    roleId: 'role-accountant',
    roleName: 'ACCOUNTANT',
    department: 'GST Reconciliation',
    status: 'Invited',
    lastActive: 'Pending accept',
  },
];

interface AuthContextValue extends AuthState {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  createCompany: (payload: CreateCompanyPayload) => Promise<boolean>;
  joinCompany: (payload: JoinCompanyPayload) => Promise<boolean>;
  acceptInvitation: (code: string, name: string, pass: string) => Promise<boolean>;
  signOut: () => void;
  inviteMember: (payload: InviteMemberPayload) => void;
  updateMemberRole: (memberId: string, roleId: string, customPermissions?: Permission[]) => void;
  toggleMemberStatus: (memberId: string) => void;
  createCustomRole: (payload: CreateRolePayload) => void;
  updateRole: (roleId: string, payload: CreateRolePayload) => void;
  deleteRole: (roleId: string) => void;
  switchDemoRole: (roleName: 'OWNER' | 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE') => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [organization, setOrganization] = useState<Organization | null>(INITIAL_ORG);
  const [role, setRole] = useState<Role | null>(DEFAULT_ROLES[0]); // Default OWNER
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [permissions, setPermissions] = useState<Permission[]>(ALL_PERMISSIONS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Recalculate effective permissions whenever user, role, or team member custom permissions change
  useEffect(() => {
    if (!role) {
      setPermissions([]);
      return;
    }
    const currentMember = teamMembers.find((m) => m.id === user?.id);
    if (currentMember?.customPermissions && currentMember.customPermissions.length > 0) {
      setPermissions(currentMember.customPermissions);
    } else {
      setPermissions(role.permissions);
    }
  }, [role, user, teamMembers]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  };

  const signIn = async (email: string): Promise<boolean> => {
    // Check if user belongs to team
    const found = teamMembers.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const assignedRole = roles.find((r) => r.id === found.roleId) || DEFAULT_ROLES[3];
      setUser({
        id: found.id,
        name: found.name,
        email: found.email,
        department: found.department,
        status: 'Active',
        lastActive: 'Just now',
      });
      setRole(assignedRole);
      setIsAuthenticated(true);
      return true;
    }

    // Default fallback sign in as Owner
    setUser(INITIAL_USER);
    setRole(DEFAULT_ROLES[0]);
    setOrganization(INITIAL_ORG);
    setIsAuthenticated(true);
    return true;
  };

  const createCompany = async (payload: CreateCompanyPayload): Promise<boolean> => {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: payload.companyName,
      type: payload.companyType,
      size: payload.companySize,
      inviteCode: `BIZ-${payload.companyName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: payload.fullName,
      email: payload.workEmail,
      department: 'Executive Board',
      status: 'Active',
      lastActive: 'Just now',
    };

    const ownerRole = DEFAULT_ROLES[0]; // First creator is ALWAYS OWNER

    const ownerTeamMember: TeamMember = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleId: ownerRole.id,
      roleName: ownerRole.name,
      department: 'Executive Board',
      status: 'Active',
      lastActive: 'Just now',
    };

    setOrganization(newOrg);
    setUser(newUser);
    setRole(ownerRole);
    setTeamMembers([ownerTeamMember]);
    setIsAuthenticated(true);
    return true;
  };

  const joinCompany = async (payload: JoinCompanyPayload): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: payload.fullName,
      email: payload.workEmail,
      department: 'Operations',
      status: 'Active',
      lastActive: 'Just now',
    };

    const employeeRole = DEFAULT_ROLES[3]; // Standard EMPLOYEE role assigned initially

    const newTeamMember: TeamMember = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleId: employeeRole.id,
      roleName: employeeRole.name,
      department: 'Operations',
      status: 'Active',
      lastActive: 'Just now',
    };

    setUser(newUser);
    setRole(employeeRole);
    setTeamMembers((prev) => [...prev, newTeamMember]);
    setIsAuthenticated(true);
    return true;
  };

  const acceptInvitation = async (code: string, name: string): Promise<boolean> => {
    if (user) {
      setUser({ ...user, name, status: 'Active', lastActive: 'Just now' });
    }
    setIsAuthenticated(true);
    return true;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const inviteMember = (payload: InviteMemberPayload) => {
    const assignedRole = roles.find((r) => r.id === payload.roleId) || DEFAULT_ROLES[3];
    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      roleId: assignedRole.id,
      roleName: assignedRole.name,
      department: payload.department,
      status: 'Invited',
      lastActive: 'Invitation Sent',
      customPermissions: payload.customPermissions,
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const updateMemberRole = (memberId: string, roleId: string, customPermissions?: Permission[]) => {
    const assignedRole = roles.find((r) => r.id === roleId) || DEFAULT_ROLES[3];
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              roleId: assignedRole.id,
              roleName: assignedRole.name,
              customPermissions: customPermissions || m.customPermissions,
            }
          : m
      )
    );

    // If current user modified their own role
    if (memberId === user?.id) {
      setRole(assignedRole);
    }
  };

  const toggleMemberStatus = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, status: m.status === 'Active' ? 'Deactivated' : 'Active' }
          : m
      )
    );
  };

  const createCustomRole = (payload: CreateRolePayload) => {
    const newRole: Role = {
      id: `role-custom-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      isSystemRole: false,
      permissions: payload.permissions,
    };
    setRoles((prev) => [...prev, newRole]);
  };

  const updateRole = (roleId: string, payload: CreateRolePayload) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? { ...r, name: payload.name, description: payload.description, permissions: payload.permissions }
          : r
      )
    );
  };

  const deleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId && !r.isSystemRole));
  };

  const switchDemoRole = (roleName: 'OWNER' | 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE') => {
    const targetRole = roles.find((r) => r.name === roleName) || DEFAULT_ROLES[0];
    setRole(targetRole);
    if (user) {
      setUser({
        ...user,
        name:
          roleName === 'OWNER'
            ? 'Vikramaditya Shah'
            : roleName === 'MANAGER'
            ? 'Ananya Deshmukh'
            : roleName === 'ACCOUNTANT'
            ? 'Rajesh Mehta'
            : 'Saurabh Patel',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        role,
        permissions,
        teamMembers,
        roles,
        isAuthenticated,
        hasPermission,
        hasAnyPermission,
        signIn,
        createCompany,
        joinCompany,
        acceptInvitation,
        signOut,
        inviteMember,
        updateMemberRole,
        toggleMemberStatus,
        createCustomRole,
        updateRole,
        deleteRole,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
