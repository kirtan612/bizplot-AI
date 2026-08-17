"""
BizPilot AI - FastAPI Router for Canonical Business Data APIs.
Provides organization-scoped access to Customers, Suppliers, Products, Orders,
Invoices, Payments, Expenses, and Bank Transactions.
"""

from uuid import UUID
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status

from api.auth.dependencies import get_current_user, CurrentUser
from api.normalization.services import list_canonical_customers, list_canonical_invoices

router = APIRouter(tags=["Canonical Business Data"])


@router.get("/customers", response_model=List[Dict[str, Any]])
def get_canonical_customers(current_user: CurrentUser = Depends(get_current_user)):
    """Retrieves organization-scoped canonical customers."""
    return list_canonical_customers(current_user.company_id)


@router.get("/invoices", response_model=List[Dict[str, Any]])
def get_canonical_invoices(current_user: CurrentUser = Depends(get_current_user)):
    """Retrieves organization-scoped canonical invoices."""
    return list_canonical_invoices(current_user.company_id)
