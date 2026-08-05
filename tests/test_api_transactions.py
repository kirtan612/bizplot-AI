"""
FastAPI Transaction Register Routers Integration Tests (tests/test_api_transactions.py).
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


def test_list_purchases(client, admin_token):
    """Test GET /api/purchases returns paginated purchase invoices."""
    response = client.get("/api/purchases?page=1&page_size=5", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3219
    assert len(data["items"]) == 5
    assert "invoice_number" in data["items"][0]


def test_list_sales(client, staff_token):
    """Test GET /api/sales allowed for Staff role."""
    response = client.get("/api/sales?page=1&page_size=5", headers={"Authorization": f"Bearer {staff_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5559
    assert len(data["items"]) == 5


def test_cashbook_admin_access_allowed(client, admin_token):
    """Test GET /api/cashbook succeeds for Admin role (200 OK)."""
    response = client.get("/api/cashbook?page=1&page_size=5", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 8467
    assert len(data["items"]) == 5


def test_cashbook_staff_access_forbidden(client, staff_token):
    """Test GET /api/cashbook returns 403 Forbidden for Staff role."""
    response = client.get("/api/cashbook", headers={"Authorization": f"Bearer {staff_token}"})
    assert response.status_code == 403
    assert "Forbidden" in response.json()["detail"]


def test_cashbook_unauthenticated_forbidden(client):
    """Test GET /api/cashbook without token returns 401 Unauthorized."""
    response = client.get("/api/cashbook")
    assert response.status_code == 401
