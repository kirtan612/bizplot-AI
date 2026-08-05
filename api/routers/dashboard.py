"""
Dashboard FastAPI Router for BizPilot AI.
Endpoints:
  GET /api/dashboard/kpis            -> Real-time KPIs (Role-aware: Admin includes cash_position, Staff omits key)
  GET /api/dashboard/recent-activity -> Merged recent activity feed (Staff excludes Cashbook entries at query time)
"""

from typing import Union, List, Dict, Any
from decimal import Decimal
from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.db.models.master_data import Product, Supplier, Customer
from src.db.models.transactions import Purchase, Sale, Cashbook
from src.db.models.inventory import InventorySnapshot
from api.schemas.dashboard_schemas import AdminKPIResponse, StaffKPIResponse, RecentActivityItem
from api.auth.dependencies import get_db_session, get_current_user, CurrentUser

router = APIRouter()


@router.get(
    "/dashboard/kpis",
    response_model=Union[AdminKPIResponse, StaffKPIResponse],
    summary="Get real-time business KPIs (cash_position present for Admin, absent for Staff)"
)
def get_dashboard_kpis(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """
    Calculate live business KPIs for current tenant.
    Strips cash_position key entirely from response JSON for Staff role.
    """
    cid = current_user.company_id

    # 1. Total Active Products
    total_active_products = (
        db.query(func.count(Product.id))
        .filter(Product.company_id == cid, Product.active == True, Product.deleted_at == None)
        .scalar() or 0
    )

    # 2. Products Below Reorder Level (using latest snapshot per product)
    subq = (
        db.query(
            InventorySnapshot.product_id,
            func.max(InventorySnapshot.snapshot_date).label("max_date")
        )
        .filter(InventorySnapshot.company_id == cid, InventorySnapshot.deleted_at == None)
        .group_by(InventorySnapshot.product_id)
        .subquery()
    )
    products_below_reorder = (
        db.query(func.count(InventorySnapshot.id))
        .join(subq, (InventorySnapshot.product_id == subq.c.product_id) & (InventorySnapshot.snapshot_date == subq.c.max_date))
        .filter(InventorySnapshot.company_id == cid, InventorySnapshot.reorder_flag == True, InventorySnapshot.deleted_at == None)
        .scalar() or 0
    )

    # 3. Sales Last 30 Days
    max_sales_date = (
        db.query(func.max(Sale.sales_date))
        .filter(Sale.company_id == cid, Sale.deleted_at == None)
        .scalar()
    )
    anchor_sales_date = max_sales_date or date.today()
    start_sales_date = anchor_sales_date - timedelta(days=30)
    sales_last_30_days = (
        db.query(func.coalesce(func.sum(Sale.invoice_amount), 0))
        .filter(Sale.company_id == cid, Sale.sales_date >= start_sales_date, Sale.deleted_at == None)
        .scalar()
    )

    # 4. Purchases Last 30 Days
    max_pur_date = (
        db.query(func.max(Purchase.purchase_date))
        .filter(Purchase.company_id == cid, Purchase.deleted_at == None)
        .scalar()
    )
    anchor_pur_date = max_pur_date or date.today()
    start_pur_date = anchor_pur_date - timedelta(days=30)
    purchases_last_30_days = (
        db.query(func.coalesce(func.sum(Purchase.invoice_amount), 0))
        .filter(Purchase.company_id == cid, Purchase.purchase_date >= start_pur_date, Purchase.deleted_at == None)
        .scalar()
    )

    is_admin = (current_user.role.lower() == "admin")

    if is_admin:
        # 5. Cash Position (Admin Only)
        latest_cashbook = (
            db.query(Cashbook)
            .filter(Cashbook.company_id == cid, Cashbook.deleted_at == None)
            .order_by(Cashbook.entry_date.desc(), Cashbook.created_at.desc())
            .first()
        )
        cash_position = Decimal(str(latest_cashbook.closing_balance)) if latest_cashbook else Decimal("0.00")

        return AdminKPIResponse(
            total_active_products=total_active_products,
            products_below_reorder=products_below_reorder,
            sales_last_30_days=Decimal(str(sales_last_30_days)),
            purchases_last_30_days=Decimal(str(purchases_last_30_days)),
            cash_position=cash_position,
        )
    else:
        # Staff Role - cash_position key omitted entirely
        return StaffKPIResponse(
            total_active_products=total_active_products,
            products_below_reorder=products_below_reorder,
            sales_last_30_days=Decimal(str(sales_last_30_days)),
            purchases_last_30_days=Decimal(str(purchases_last_30_days)),
        )


@router.get(
    "/dashboard/recent-activity",
    response_model=List[RecentActivityItem],
    summary="Get merged recent activity feed (Cashbook entries excluded for Staff)"
)
def get_recent_activity(
    limit: int = Query(20, ge=1, le=100, description="Max items to return in merged feed"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """
    Retrieve merged recent Purchases, Sales, and Cashbook entries.
    Cashbook entries are omitted at the query level for Staff role.
    """
    cid = current_user.company_id
    is_admin = (current_user.role.lower() == "admin")

    # Fetch top purchases
    purchases = (
        db.query(Purchase)
        .filter(Purchase.company_id == cid, Purchase.deleted_at == None)
        .order_by(Purchase.purchase_date.desc(), Purchase.created_at.desc())
        .limit(limit)
        .all()
    )

    # Fetch top sales
    sales = (
        db.query(Sale)
        .filter(Sale.company_id == cid, Sale.deleted_at == None)
        .order_by(Sale.sales_date.desc(), Sale.created_at.desc())
        .limit(limit)
        .all()
    )

    activities: List[RecentActivityItem] = []

    for p in purchases:
        activities.append(RecentActivityItem(
            activity_type="purchase",
            activity_id=p.id,
            reference_number=p.invoice_number,
            activity_date=p.purchase_date,
            party_name=p.supplier_code,
            amount=Decimal(str(p.invoice_amount)),
            details=f"Product {p.product_code} | Qty {p.quantity_pcs} pcs | Status: {p.payment_status}"
        ))

    for s in sales:
        activities.append(RecentActivityItem(
            activity_type="sale",
            activity_id=s.id,
            reference_number=s.invoice_number,
            activity_date=s.sales_date,
            party_name=s.customer_code,
            amount=Decimal(str(s.invoice_amount)),
            details=f"Product {s.product_code} | Qty {s.quantity_pcs} pcs | Status: {s.payment_status}"
        ))

    # Fetch Cashbook entries ONLY if Admin
    if is_admin:
        cashbook_entries = (
            db.query(Cashbook)
            .filter(Cashbook.company_id == cid, Cashbook.deleted_at == None)
            .order_by(Cashbook.entry_date.desc(), Cashbook.created_at.desc())
            .limit(limit)
            .all()
        )
        for c in cashbook_entries:
            activities.append(RecentActivityItem(
                activity_type="cashbook",
                activity_id=c.id,
                reference_number=c.voucher_number,
                activity_date=c.entry_date,
                party_name=c.party_name,
                amount=Decimal(str(c.amount)),
                details=f"{c.transaction_type} via {c.payment_mode} | {c.narration}"
            ))

    # Sort merged feed by activity_date descending
    activities.sort(key=lambda x: x.activity_date, reverse=True)
    return activities[:limit]
