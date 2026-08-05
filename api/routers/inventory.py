"""
Inventory FastAPI Router for BizPilot AI.
Endpoints:
  GET /api/inventory/current              -> Latest stock snapshot per product
  GET /api/inventory/{product_id}/history -> Historical stock ledger for a product SKU
"""

from typing import Optional, Dict, Any
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.db.models.inventory import InventorySnapshot
from src.schemas.inventory import InventoryModel
from api.schemas.pagination import PaginatedResponse, build_paginated_response
from api.auth.dependencies import get_db_session, get_current_user, CurrentUser

router = APIRouter()


def transform_inventory(inv: InventorySnapshot) -> Dict[str, Any]:
    """Convert InventorySnapshot ORM object to InventoryModel dictionary."""
    return {
        "inventory_id": inv.id,
        "snapshot_date": inv.snapshot_date,
        "product_id": inv.product_id,
        "product_code": inv.product_code,
        "opening_qty_pcs": inv.opening_qty_pcs,
        "opening_weight_kg": inv.opening_weight_kg,
        "purchased_qty_pcs": inv.purchased_qty_pcs,
        "purchased_weight_kg": inv.purchased_weight_kg,
        "sold_qty_pcs": inv.sold_qty_pcs,
        "sold_weight_kg": inv.sold_weight_kg,
        "closing_qty_pcs": inv.closing_qty_pcs,
        "closing_weight_kg": inv.closing_weight_kg,
        "unit_cost_per_kg": inv.unit_cost_per_kg,
        "inventory_valuation": inv.inventory_valuation,
        "reorder_level_pcs": inv.reorder_level_pcs,
        "reorder_flag": inv.reorder_flag,
        "created_at": inv.created_at,
        "updated_at": inv.updated_at,
    }


@router.get(
    "/inventory/current",
    response_model=PaginatedResponse[InventoryModel],
    summary="List latest inventory snapshots per product"
)
def list_current_inventory(
    product_id: Optional[UUID] = Query(None, description="Filter by specific product ID"),
    reorder_flag_only: Optional[bool] = Query(None, description="Filter products below reorder level"),
    search: Optional[str] = Query(None, description="Search term for product_code"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve the latest stock snapshot per product for the user's company."""
    # Subquery to find max snapshot_date per product for this company
    subq = (
        db.query(
            InventorySnapshot.product_id,
            func.max(InventorySnapshot.snapshot_date).label("max_date")
        )
        .filter(InventorySnapshot.company_id == current_user.company_id, InventorySnapshot.deleted_at == None)
        .group_by(InventorySnapshot.product_id)
        .subquery()
    )

    query = (
        db.query(InventorySnapshot)
        .join(
            subq,
            (InventorySnapshot.product_id == subq.c.product_id) &
            (InventorySnapshot.snapshot_date == subq.c.max_date)
        )
        .filter(InventorySnapshot.company_id == current_user.company_id, InventorySnapshot.deleted_at == None)
    )

    if product_id:
        query = query.filter(InventorySnapshot.product_id == product_id)
    if reorder_flag_only is not None:
        query = query.filter(InventorySnapshot.reorder_flag == reorder_flag_only)
    if search:
        query = query.filter(InventorySnapshot.product_code.ilike(f"%{search}%"))

    query = query.order_by(InventorySnapshot.product_code.asc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_inventory)


@router.get(
    "/inventory/{product_id}/history",
    response_model=PaginatedResponse[InventoryModel],
    summary="Get historical inventory stock ledger for a product SKU"
)
def get_inventory_history(
    product_id: UUID,
    date_from: Optional[date] = Query(None, description="Start snapshot date filter (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="End snapshot date filter (YYYY-MM-DD)"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve historical stock snapshots for a specific product ID."""
    query = db.query(InventorySnapshot).filter(
        InventorySnapshot.company_id == current_user.company_id,
        InventorySnapshot.product_id == product_id,
        InventorySnapshot.deleted_at == None
    )

    if date_from:
        query = query.filter(InventorySnapshot.snapshot_date >= date_from)
    if date_to:
        query = query.filter(InventorySnapshot.snapshot_date <= date_to)

    query = query.order_by(InventorySnapshot.snapshot_date.desc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_inventory)
