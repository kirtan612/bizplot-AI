"""
BizPilot AI - AI Executive Data Access Boundary & Context Minimizer.
Enforces User -> Organization -> Role Permission -> Allowed Data -> Executive Context -> LLM scoping.
"""

from uuid import UUID
from typing import Dict, Any, List
from fastapi import HTTPException, status

from api.auth.dependencies import CurrentUser
from api.security.permissions import has_permission


def enforce_ai_context_authorization(user: CurrentUser, required_permission: str = "executives.view") -> None:
    """Verifies that authenticated user has required role permission to access AI Context."""
    if not has_permission(user.role, required_permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: AI Executive context requires permission '{required_permission}'."
        )


def minimize_ai_context(raw_context: Dict[str, Any], user: CurrentUser) -> Dict[str, Any]:
    """
    Minimizes and filters AI Executive context based on user role permissions.
    Prevents unauthorized data (e.g. bank transactions for non-finance users) from reaching LLM context.
    """
    minimized = {
        "company_id": str(user.company_id),
        "requested_by_user": user.username,
        "user_role": user.role,
        "summary": raw_context.get("summary", {})
    }

    # Include Finance Context only if user has finance permission
    if has_permission(user.role, "invoices.view") or has_permission(user.role, "bank.view"):
        minimized["financial_metrics"] = raw_context.get("financial_metrics", {})
    else:
        minimized["financial_metrics"] = {"status": "RESTRICTED", "message": "Role unauthorized for financial data"}

    # Include Operations Context only if user has operations permission
    if has_permission(user.role, "inventory.view") or has_permission(user.role, "orders.view"):
        minimized["operations_metrics"] = raw_context.get("operations_metrics", {})
    else:
        minimized["operations_metrics"] = {"status": "RESTRICTED", "message": "Role unauthorized for operational data"}

    # Include Marketing Context if user has marketing permission
    if has_permission(user.role, "customers.view"):
        minimized["marketing_metrics"] = raw_context.get("marketing_metrics", {})

    return minimized
