export type Permission =
  | 'dashboard.view'
  | 'customers.view'
  | 'customers.create'
  | 'customers.update'
  | 'customers.delete'
  | 'sales.view'
  | 'sales.create'
  | 'sales.update'
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.update'
  | 'purchases.view'
  | 'purchases.create'
  | 'purchases.update'
  | 'invoices.view'
  | 'invoices.create'
  | 'invoices.update'
  | 'invoices.delete'
  | 'expenses.view'
  | 'expenses.create'
  | 'expenses.update'
  | 'finance.view'
  | 'finance.create'
  | 'finance.update'
  | 'cashflow.view'
  | 'reports.view'
  | 'reports.finance.view'
  | 'reports.sales.view'
  | 'employees.view'
  | 'employees.create'
  | 'employees.update'
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.update'
  | 'company.settings'
  | 'ai.insights.view'
  | 'ai.insights.create'
  | 'ai.executive_center.view'
  | 'ai.executive_room.view'
  | 'ai.ceo.view'
  | 'ai.cfo.view'
  | 'ai.coo.view'
  | 'ai.cmo.view'
  | 'ai.cto.view'
  | 'ai.hr.view'
  | 'ai.legal.view'
  | 'ai.supply.view'
  | 'ai.sales.view'
  | 'ai.bi.view';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  status?: 'Active' | 'Invited' | 'Deactivated';
  lastActive?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  size: string;
  inviteCode: string;
  logo?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: 'OWNER' | 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE' | string;
  description: string;
  isSystemRole: boolean;
  permissions: Permission[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  department: string;
  status: 'Active' | 'Invited' | 'Deactivated';
  lastActive: string;
  customPermissions?: Permission[];
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  role: Role | null;
  permissions: Permission[];
  teamMembers: TeamMember[];
  roles: Role[];
  isAuthenticated: boolean;
}

export interface InviteMemberPayload {
  email: string;
  name: string;
  department: string;
  roleId: string;
  customPermissions?: Permission[];
}

export interface CreateCompanyPayload {
  fullName: string;
  workEmail: string;
  password: string;
  companyName: string;
  companyType: string;
  companySize: string;
}

export interface JoinCompanyPayload {
  fullName: string;
  workEmail: string;
  password: string;
  inviteCode: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: Permission[];
}
