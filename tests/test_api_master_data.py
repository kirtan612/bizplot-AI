"""
FastAPI Master Data Routers Integration Tests (tests/test_api_master_data.py).
Tests against target PostgreSQL database.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.main import app

ADMIN_USERNAME = "admin_demo"
ADMIN_PASSWORD = "AdminDemo123!"

STAFF_USERNAME = "staff_demo"
STAFF_PASSWORD = "StaffDemo123!"


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    resp = client.post("/api/auth/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    return resp.json()["access_token"]


@pytest.fixture
def staff_token(client):
    resp = client.post("/api/auth/login", json={"username": STAFF_USERNAME, "password": STAFF_PASSWORD})
    return resp.json()["access_token"]


def test_list_products_paginated(client, admin_token):
    """Test GET /api/products returns paginated response envelope."""
    response = client.get("/api/products?page=1&page_size=10", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert data["total"] == 140
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert len(data["items"]) == 10
    first_item = data["items"][0]
    assert "product_code" in first_item
    assert "brand" in first_item


def test_list_products_filtered(client, admin_token):
    """Test GET /api/products filtering by brand."""
    response = client.get("/api/products?brand=APL%20Apollo", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    items = response.json()["items"]
    assert len(items) > 0
    assert all(item["brand"] == "APL Apollo" for item in items)


def test_suppliers_role_stripping_admin_vs_staff(client, admin_token, staff_token):
    """
    Test GET /api/suppliers role stripping:
      - Admin response MUST contain 'credit_period_days'
      - Staff response MUST NOT contain 'credit_period_days'
    """
    # 1. Admin Request
    admin_resp = client.get("/api/suppliers", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 200
    admin_item = admin_resp.json()["items"][0]
    assert "credit_period_days" in admin_item

    # 2. Staff Request
    staff_resp = client.get("/api/suppliers", headers={"Authorization": f"Bearer {staff_token}"})
    assert staff_resp.status_code == 200
    staff_item = staff_resp.json()["items"][0]
    assert "credit_period_days" not in staff_item


def test_customers_role_stripping_admin_vs_staff(client, admin_token, staff_token):
    """
    Test GET /api/customers role stripping:
      - Admin response MUST contain 'credit_limit' and 'credit_period_days'
      - Staff response MUST NOT contain 'credit_limit' or 'credit_period_days'
    """
    # 1. Admin Request
    admin_resp = client.get("/api/customers", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 200
    admin_item = admin_resp.json()["items"][0]
    assert "credit_limit" in admin_item
    assert "credit_period_days" in admin_item

    # 2. Staff Request
    staff_resp = client.get("/api/customers", headers={"Authorization": f"Bearer {staff_token}"})
    assert staff_resp.status_code == 200
    staff_item = staff_resp.json()["items"][0]
    assert "credit_limit" not in staff_item
    assert "credit_period_days" not in staff_item


def test_get_company_master(client, admin_token):
    """Test GET /api/company returns single master record for current tenant."""
    response = client.get("/api/company", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    comp = response.json()
    assert comp["company_code"] == "COMP-001"
    assert "legal_name" in comp
