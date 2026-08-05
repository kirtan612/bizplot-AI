"""
Transaction Register FastAPI Router for BizPilot AI.
Endpoints:
  GET /api/purchases
  GET /api/purchases/{purchase_id}
  GET /api/sales
  GET /api/sales/{sales_id}
  GET /api/cashbook          (ADMIN ONLY)
  GET /api/cashbook/{voucher_id} (ADMIN ONLY)
"""

from typing import Optional, Dict, Any
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.db.models.transactions import Purchase, Sale, Cashbook
from src.schemas.purchase_register import PurchaseRegisterModel
from src.schemas.sales_register import SalesRegisterModel
from src.schemas.cashbook import CashbookModel
from api.schemas.pagination import PaginatedResponse, build_paginated_response
from api.auth.dependencies import get_db_session, get_current_user, require_role, CurrentUser

router = APIRouter()


# ==========================================
# Helper Converters
# ==========================================

def transform_purchase(p: Purchase) -> Dict[str, Any]:
    """Convert Purchase ORM instance to PurchaseRegisterModel dictionary."""
    return {
        "purchase_id": p.id,
        "invoice_number": p.invoice_number,
        "purchase_date": p.purchase_date,
        "supplier_id": p.supplier_id,
        "supplier_code": p.supplier_code,
        "product_id": p.product_id,
        "product_code": p.product_code,
        "quantity_pcs": p.quantity_pcs,
        "total_weight_kg": p.total_weight_kg,
        "unit_price_per_kg": p.unit_price_per_kg,
        "taxable_value": p.taxable_value,
        "is_interstate": p.is_interstate,
        "cgst_rate": p.cgst_rate,
        "cgst_amount": p.cgst_amount,
        "sgst_rate": p.sgst_rate,
        "sgst_amount": p.sgst_amount,
        "igst_rate": p.igst_rate,
        "igst_amount": p.igst_amount,
        "total_gst": p.total_gst,
        "invoice_amount": p.invoice_amount,
        "payment_status": p.payment_status,
        "payment_due_date": p.payment_due_date,
        "created_at": p.created_at,
        "updated_at": p.updated_at,
    }


def transform_sale(s: Sale) -> Dict[str, Any]:
    """Convert Sale ORM instance to SalesRegisterModel dictionary."""
    return {
        "sales_id": s.id,
        "invoice_number": s.invoice_number,
        "sales_date": s.sales_date,
        "customer_id": s.customer_id,
        "customer_code": s.customer_code,
        "product_id": s.product_id,
        "product_code": s.product_code,
        "quantity_pcs": s.quantity_pcs,
        "total_weight_kg": s.total_weight_kg,
        "unit_price_per_kg": s.unit_price_per_kg,
        "taxable_value": s.taxable_value,
        "is_interstate": s.is_interstate,
        "cgst_rate": s.cgst_rate,
        "cgst_amount": s.cgst_amount,
        "sgst_rate": s.sgst_rate,
        "sgst_amount": s.sgst_amount,
        "igst_rate": s.igst_rate,
        "igst_amount": s.igst_amount,
        "total_gst": s.total_gst,
        "invoice_amount": s.invoice_amount,
        "payment_status": s.payment_status,
        "payment_due_date": s.payment_due_date,
        "created_at": s.created_at,
        "updated_at": s.updated_at,
    }


def transform_cashbook(c: Cashbook) -> Dict[str, Any]:
    """Convert Cashbook ORM instance to CashbookModel dictionary."""
    return {
        "entry_id": c.id,
        "entry_date": c.entry_date,
        "voucher_number": c.voucher_number,
        "transaction_type": c.transaction_type,
        "party_type": c.party_type,
        "party_id": c.party_id,
        "party_name": c.party_name,
        "payment_mode": c.payment_mode,
        "amount": c.amount,
        "reference_invoice_number": c.reference_invoice_number,
        "opening_balance": c.opening_balance,
        "closing_balance": c.closing_balance,
        "narration": c.narration,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
    }


# ==========================================
# Purchases Endpoints
# ==========================================

@router.get("/purchases", response_model=PaginatedResponse[PurchaseRegisterModel], summary="List purchase transactions")
def list_purchases(
    date_from: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    supplier_id: Optional[UUID] = Query(None, description="Filter by supplier ID"),
    product_id: Optional[UUID] = Query(None, description="Filter by product ID"),
    payment_status: Optional[str] = Query(None, description="Filter by payment status (Paid, Pending, Overdue)"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated purchase invoices for current company."""
    query = db.query(Purchase).filter(Purchase.company_id == current_user.company_id, Purchase.deleted_at == None)

    if date_from:
        query = query.filter(Purchase.purchase_date >= date_from)
    if date_to:
        query = query.filter(Purchase.purchase_date <= date_to)
    if supplier_id:
        query = query.filter(Purchase.supplier_id == supplier_id)
    if product_id:
        query = query.filter(Purchase.product_id == product_id)
    if payment_status:
        query = query.filter(Purchase.payment_status == payment_status)

    query = query.order_by(Purchase.purchase_date.desc(), Purchase.invoice_number.desc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_purchase)


@router.get("/purchases/{purchase_id}", response_model=PurchaseRegisterModel, summary="Get single purchase by ID")
def get_purchase(
    purchase_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single purchase invoice by ID for current company."""
    purchase = db.query(Purchase).filter(
        Purchase.id == purchase_id,
        Purchase.company_id == current_user.company_id,
        Purchase.deleted_at == None
    ).first()
    if not purchase:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase invoice not found")

    return transform_purchase(purchase)


# ==========================================
# Sales Endpoints
# ==========================================

@router.get("/sales", response_model=PaginatedResponse[SalesRegisterModel], summary="List sales transactions")
def list_sales(
    date_from: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    customer_id: Optional[UUID] = Query(None, description="Filter by customer ID"),
    product_id: Optional[UUID] = Query(None, description="Filter by product ID"),
    payment_status: Optional[str] = Query(None, description="Filter by payment status (Paid, Pending, Overdue)"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated sales invoices for current company."""
    query = db.query(Sale).filter(Sale.company_id == current_user.company_id, Sale.deleted_at == None)

    if date_from:
        query = query.filter(Sale.sales_date >= date_from)
    if date_to:
        query = query.filter(Sale.sales_date <= date_to)
    if customer_id:
        query = query.filter(Sale.customer_id == customer_id)
    if product_id:
        query = query.filter(Sale.product_id == product_id)
    if payment_status:
        query = query.filter(Sale.payment_status == payment_status)

    query = query.order_by(Sale.sales_date.desc(), Sale.invoice_number.desc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_sale)


@router.get("/sales/{sales_id}", response_model=SalesRegisterModel, summary="Get single sale by ID")
def get_sale(
    sales_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single sales invoice by ID for current company."""
    sale = db.query(Sale).filter(
        Sale.id == sales_id,
        Sale.company_id == current_user.company_id,
        Sale.deleted_at == None
    ).first()
    if not sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sales invoice not found")

    return transform_sale(sale)


# ==========================================
# Cashbook Endpoints (ADMIN ONLY)
# ==========================================

@router.get(
    "/cashbook",
    response_model=PaginatedResponse[CashbookModel],
    summary="List cashbook entries (ADMIN ONLY)"
)
def list_cashbook(
    date_from: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    transaction_type: Optional[str] = Query(None, description="Filter by transaction type (Receipt, Payment)"),
    payment_mode: Optional[str] = Query(None, description="Filter by payment mode (Cash, NEFT, Cheque, UPI)"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(require_role(["admin", "Admin"])),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated cashbook entries for current company. Restrict to Admin role."""
    query = db.query(Cashbook).filter(Cashbook.company_id == current_user.company_id, Cashbook.deleted_at == None)

    if date_from:
        query = query.filter(Cashbook.entry_date >= date_from)
    if date_to:
        query = query.filter(Cashbook.entry_date <= date_to)
    if transaction_type:
        query = query.filter(Cashbook.transaction_type == transaction_type)
    if payment_mode:
        query = query.filter(Cashbook.payment_mode == payment_mode)

    query = query.order_by(Cashbook.entry_date.desc(), Cashbook.voucher_number.desc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_cashbook)


@router.get(
    "/cashbook/{voucher_id}",
    response_model=CashbookModel,
    summary="Get single cashbook entry by ID or voucher_number (ADMIN ONLY)"
)
def get_cashbook_entry(
    voucher_id: str,
    current_user: CurrentUser = Depends(require_role(["admin", "Admin"])),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single cashbook entry by UUID or voucher_number. Restrict to Admin role."""
    query = db.query(Cashbook).filter(Cashbook.company_id == current_user.company_id, Cashbook.deleted_at == None)

    try:
        uuid_val = UUID(voucher_id)
        entry = query.filter(Cashbook.id == uuid_val).first()
    except ValueError:
        entry = query.filter(Cashbook.voucher_number == voucher_id).first()

    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cashbook entry not found")

    return transform_cashbook(entry)
