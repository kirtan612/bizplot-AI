import React from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/auth';

interface PermissionGateProps {
  /** Single permission required to render children */
  permission?: Permission;
  /** Alternative: render if user has ANY of these permissions */
  anyOf?: Permission[];
  /** Alternative: render if user has ALL of these permissions */
  allOf?: Permission[];
  /** Content to render when permission is denied (defaults to nothing) */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative permission gate.
 * Wraps children and only renders them if the current user
 * has the required permission(s). Use instead of inline
 * `hasPermission()` calls for cleaner JSX.
 *
 * Usage:
 *   <PermissionGate permission="finance.view">
 *     <FinanceWidget />
 *   </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission } = useAuth();

  let allowed = true;

  if (permission) {
    allowed = hasPermission(permission);
  } else if (anyOf && anyOf.length > 0) {
    allowed = hasAnyPermission(anyOf);
  } else if (allOf && allOf.length > 0) {
    allowed = allOf.every((p) => hasPermission(p));
  }

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};
