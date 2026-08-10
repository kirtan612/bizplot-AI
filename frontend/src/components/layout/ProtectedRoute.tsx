import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/auth';
import { AccessRestrictedPage } from '../../pages/app/AccessRestrictedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessRestrictedPage requiredPermission={requiredPermission} />;
  }

  return <>{children}</>;
};
