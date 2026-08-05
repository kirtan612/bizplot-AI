"""
Master Data FastAPI Router for BizPilot AI.
Endpoints:
  GET /api/products
  GET /api/products/{product_id}
  GET /api/suppliers
  GET /api/suppliers/{supplier_id}
  GET /api/customers
  GET /api/customers/{customer_id}
  GET /api/company
"""

from typing import Optional, Union, List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from src.db.models.master_data import Product, Supplier, Customer, CompanyMaster
from src.schemas.product_master import ProductMasterModel
from src.schemas.company_master import CompanyMasterModel
from api.schemas.master_data_schemas import (
    SupplierAdminResponse,
    SupplierStaffResponse,
    CustomerAdminResponse,
    CustomerStaffResponse,
)
from api.schemas.pagination import PaginatedResponse, build_paginated_response
from api.auth.dependencies import get_db_session, get_current_user, CurrentUser

router = APIRouter()


# ==========================================
# Helper Converters
# ==========================================

def transform_product(prod: Product) -> Dict[str, Any]:
    """Convert Product ORM instance to ProductMasterModel dictionary."""
    return {
        "product_id": prod.id,
        "product_code": prod.product_code,
        "brand": prod.brand,
        "category": prod.category,
        "shape": prod.shape,
        "size": prod.size,
        "weight_class": prod.weight_class,
        "weight_per_meter": prod.weight_per_meter,
        "length": prod.length,
        "gst": prod.gst,
        "hsn_code": prod.hsn_code,
        "standard_ref": prod.standard_ref,
        "active": prod.active,
        "created_at": prod.created_at,
        "updated_at": prod.updated_at,
    }


def transform_supplier(supp: Supplier, is_staff: bool = False) -> Dict[str, Any]:
    """Convert Supplier ORM instance to Admin or Staff dictionary."""
    d = {
        "supplier_id": supp.id,
        "supplier_code": supp.supplier_code,
        "supplier_name": supp.supplier_name,
        "supplier_tier": supp.supplier_tier,
        "address_line1": supp.address_line1,
        "address_line2": supp.address_line2,
        "city": supp.city,
        "state": supp.state,
        "pincode": supp.pincode,
        "gstin": supp.gstin,
        "pan": supp.pan,
        "contact_person": supp.contact_person,
        "contact_phone": supp.contact_phone,
        "contact_email": supp.contact_email,
        "brands_supplied": supp.brands_supplied or [],
        "categories_supplied": supp.categories_supplied or [],
        "active": supp.active,
        "onboarding_date": supp.onboarding_date,
        "created_at": supp.created_at,
        "updated_at": supp.updated_at,
    }
    if not is_staff:
        d["credit_period_days"] = supp.credit_period_days
    return d


def transform_customer(cust: Customer, is_staff: bool = False) -> Dict[str, Any]:
    """Convert Customer ORM instance to Admin or Staff dictionary."""
    d = {
        "customer_id": cust.id,
        "customer_code": cust.customer_code,
        "customer_name": cust.customer_name,
        "customer_type": cust.customer_type,
        "address_line1": cust.address_line1,
        "address_line2": cust.address_line2,
        "city": cust.city,
        "state": cust.state,
        "pincode": cust.pincode,
        "gst_registered": cust.gst_registered,
        "gstin": cust.gstin,
        "pan": cust.pan,
        "contact_person": cust.contact_person,
        "contact_phone": cust.contact_phone,
        "contact_email": cust.contact_email,
        "payment_behavior_tier": cust.payment_behavior_tier,
        "active": cust.active,
        "onboarding_date": cust.onboarding_date,
        "created_at": cust.created_at,
        "updated_at": cust.updated_at,
    }
    if not is_staff:
        d["credit_limit"] = cust.credit_limit
        d["credit_period_days"] = cust.credit_period_days
    return d


def transform_company(comp: CompanyMaster) -> Dict[str, Any]:
    """Convert CompanyMaster ORM instance to CompanyMasterModel dictionary."""
    return {
        "company_id": comp.company_id,
        "company_code": comp.company_code,
        "legal_name": comp.legal_name,
        "trade_name": comp.trade_name,
        "company_type": comp.company_type,
        "address_line1": comp.address_line1,
        "address_line2": comp.address_line2,
        "city": comp.city,
        "state": comp.state,
        "pincode": comp.pincode,
        "gstin": comp.gstin,
        "pan": comp.pan,
        "cin": comp.cin,
        "contact_person": comp.contact_person,
        "contact_phone": comp.contact_phone,
        "contact_email": comp.contact_email,
        "financial_year_start": comp.financial_year_start,
        "current_fy": comp.current_fy,
        "opening_balance_date": comp.opening_balance_date,
        "bank_name": comp.bank_name,
        "bank_account_number": comp.bank_account_number,
        "bank_ifsc": comp.bank_ifsc,
        "created_at": comp.created_at,
        "updated_at": comp.updated_at,
    }


# ==========================================
# Products Endpoints
# ==========================================

@router.get("/products", response_model=PaginatedResponse[ProductMasterModel], summary="List products for current company")
def list_products(
    brand: Optional[str] = Query(None, description="Filter by product brand"),
    category: Optional[str] = Query(None, description="Filter by category (GI, MS, GP)"),
    shape: Optional[str] = Query(None, description="Filter by sectional shape (Round, Square, Rectangle)"),
    weight_class: Optional[str] = Query(None, description="Filter by weight class (Light, Medium, Heavy)"),
    active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search term for product_code, size, or brand"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated products for the user's company."""
    query = db.query(Product).filter(Product.company_id == current_user.company_id, Product.deleted_at == None)

    if brand:
        query = query.filter(Product.brand == brand)
    if category:
        query = query.filter(Product.category == category)
    if shape:
        query = query.filter(Product.shape == shape)
    if weight_class:
        query = query.filter(Product.weight_class == weight_class)
    if active is not None:
        query = query.filter(Product.active == active)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Product.product_code.ilike(search_fmt),
                Product.size.ilike(search_fmt),
                Product.brand.ilike(search_fmt)
            )
        )

    query = query.order_by(Product.product_code.asc())
    return build_paginated_response(query, page=page, page_size=page_size, transform_item_func=transform_product)


@router.get("/products/{product_id}", response_model=ProductMasterModel, summary="Get single product by ID")
def get_product(
    product_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single product by ID for current company."""
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.company_id == current_user.company_id,
        Product.deleted_at == None
    ).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    return transform_product(product)


# ==========================================
# Suppliers Endpoints
# ==========================================

@router.get(
    "/suppliers",
    response_model=PaginatedResponse[Union[SupplierAdminResponse, SupplierStaffResponse]],
    summary="List suppliers for current company (credit fields stripped for Staff)"
)
def list_suppliers(
    brand_supplied: Optional[str] = Query(None, description="Filter by brand supplied"),
    state: Optional[str] = Query(None, description="Filter by state"),
    search: Optional[str] = Query(None, description="Search term for code or supplier_name"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated suppliers for current company with role-based field stripping."""
    query = db.query(Supplier).filter(Supplier.company_id == current_user.company_id, Supplier.deleted_at == None)

    if brand_supplied:
        query = query.filter(func.json_contains(Supplier.brands_supplied, f'"{brand_supplied}"') if hasattr(func, "json_contains") else Supplier.brands_supplied.contains([brand_supplied]))
    if state:
        query = query.filter(Supplier.state == state)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Supplier.supplier_code.ilike(search_fmt),
                Supplier.supplier_name.ilike(search_fmt)
            )
        )

    query = query.order_by(Supplier.supplier_code.asc())
    is_staff = (current_user.role.lower() == "staff")
    return build_paginated_response(
        query,
        page=page,
        page_size=page_size,
        transform_item_func=lambda s: transform_supplier(s, is_staff=is_staff)
    )


@router.get(
    "/suppliers/{supplier_id}",
    response_model=Union[SupplierAdminResponse, SupplierStaffResponse],
    summary="Get single supplier by ID (credit fields stripped for Staff)"
)
def get_supplier(
    supplier_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single supplier by ID for current company with role-based field stripping."""
    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id,
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at == None
    ).first()
    if not supplier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")

    is_staff = (current_user.role.lower() == "staff")
    return transform_supplier(supplier, is_staff=is_staff)


# ==========================================
# Customers Endpoints
# ==========================================

@router.get(
    "/customers",
    response_model=PaginatedResponse[Union[CustomerAdminResponse, CustomerStaffResponse]],
    summary="List customers for current company (credit fields stripped for Staff)"
)
def list_customers(
    customer_type: Optional[str] = Query(None, description="Filter by customer_type"),
    state: Optional[str] = Query(None, description="Filter by state"),
    search: Optional[str] = Query(None, description="Search term for code or customer_name"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve paginated customers for current company with role-based field stripping."""
    query = db.query(Customer).filter(Customer.company_id == current_user.company_id, Customer.deleted_at == None)

    if customer_type:
        query = query.filter(Customer.customer_type == customer_type)
    if state:
        query = query.filter(Customer.state == state)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Customer.customer_code.ilike(search_fmt),
                Customer.customer_name.ilike(search_fmt)
            )
        )

    query = query.order_by(Customer.customer_code.asc())
    is_staff = (current_user.role.lower() == "staff")
    return build_paginated_response(
        query,
        page=page,
        page_size=page_size,
        transform_item_func=lambda c: transform_customer(c, is_staff=is_staff)
    )


@router.get(
    "/customers/{customer_id}",
    response_model=Union[CustomerAdminResponse, CustomerStaffResponse],
    summary="Get single customer by ID (credit fields stripped for Staff)"
)
def get_customer(
    customer_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve a single customer by ID for current company with role-based field stripping."""
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at == None
    ).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    is_staff = (current_user.role.lower() == "staff")
    return transform_customer(customer, is_staff=is_staff)


# ==========================================
# Company Endpoint
# ==========================================

@router.get("/company", response_model=CompanyMasterModel, summary="Get master record for current company")
def get_company(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieve the single master record for the user's company."""
    company = db.query(CompanyMaster).filter(
        CompanyMaster.company_id == current_user.company_id,
        CompanyMaster.deleted_at == None
    ).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company master record not found")

    return transform_company(company)
