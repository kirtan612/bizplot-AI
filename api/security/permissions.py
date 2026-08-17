"""
BizPilot AI - Role-Based Access Control (RBAC) & Permission Matrix.
Defines explicit permissions for Owner, Admin, Finance, Operations, Marketing, Employee, and Viewer roles.
"""

from typing import Dict, List, Set, Union
from fastapi import Depends, HTTPException, status
from api.auth.dependencies import get_current_user, CurrentUser

# Explicit Permission Matrix Definition
ROLE_PERMISSIONS: Dict[str, Set[str]] = {
    "owner": {"*"},  # Full administrative access
    "admin": {"*"},  # Full administrative access
    "finance": {
        "dashboard.view", "invoices.view", "invoices.create", "invoices.edit",
        "payments.view", "payments.create", "expenses.view", "expenses.create",
        "bank.view", "bank.create", "tax.view", "tax.create",
        "ai.insights.view", "ai.cfo.view", "ai.cfo.consult", "executives.view"
    },
    "operations": {
        "dashboard.view", "inventory.view", "inventory.edit", "products.view", "products.create",
        "orders.view", "orders.create", "suppliers.view", "suppliers.create",
        "purchases.view", "purchases.create", "ai.coo.view", "ai.coo.consult", "executives.view"
    },
    "marketing": {
        "dashboard.view", "customers.view", "customers.create", "sales.view",
        "ai.cmo.view", "ai.cmo.consult", "executives.view"
    },
    "employee": {
        "dashboard.view", "profile.view", "customers.view", "products.view"
    },
    "viewer": {
        "dashboard.view", "customers.view", "products.view",
        "executives.view"
    }
}


def has_permission(user_role: str, required_permission: str) -> bool:
    """Checks if a user role possesses the required permission string."""
    role = user_role.lower()
    allowed = ROLE_PERMISSIONS.get(role, set())
    if "*" in allowed:
        return True
    if required_permission in allowed:
        return True
    # Wildcard prefix check (e.g. invoices.*)
    parts = required_permission.split(".")
    if len(parts) == 2 and f"{parts[0]}.*" in allowed:
        return True
    return False


def require_permission(required_permission: str):
    """
    FastAPI dependency enforcing granular Role-Based Access Control (RBAC).
    Raises 403 Forbidden if user's role lacks required permission.
    """
    def permission_checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if not has_permission(current_user.role, required_permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Action requires permission '{required_permission}' which role '{current_user.role}' lacks."
            )
        return current_user

    return permission_checker
