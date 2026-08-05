"""
FastAPI Dashboard Router Integration Tests (tests/test_api_dashboard.py).
Tests against target PostgreSQL database.
"""

import os
import sys
# pyrefly: ignore [missing-import]
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


def test_dashboard_kpis_admin_vs_staff(client, admin_token, staff_token):
    """
    Test GET /api/dashboard/kpis role-awareness:
      - Admin response MUST contain 'cash_position' key.
      - Staff response MUST COMPLETELY OMIT 'cash_position' key.
    """
    # 1. Admin Request
    admin_resp = client.get("/api/dashboard/kpis", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 200
    admin_data = admin_resp.json()
    assert "total_active_products" in admin_data
    assert "cash_position" in admin_data

    # 2. Staff Request
    staff_resp = client.get("/api/dashboard/kpis", headers={"Authorization": f"Bearer {staff_token}"})
    assert staff_resp.status_code == 200
    staff_data = staff_resp.json()
    assert "total_active_products" in staff_data
    assert "cash_position" not in staff_data  # Literally absent from JSON object!


def test_dashboard_recent_activity_admin_vs_staff(client, admin_token, staff_token):
    """
    Test GET /api/dashboard/recent-activity merged feed:
      - Admin feed contains Cashbook entries.
      - Staff feed COMPLETELY EXCLUDES Cashbook entries.
    """
    # 1. Admin Request
    admin_resp = client.get("/api/dashboard/recent-activity?limit=20", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 200
    admin_feed = admin_resp.json()
    assert len(admin_feed) > 0
    activity_types_admin = {item["activity_type"] for item in admin_feed}
    assert "cashbook" in activity_types_admin

    # 2. Staff Request
    staff_resp = client.get("/api/dashboard/recent-activity?limit=20", headers={"Authorization": f"Bearer {staff_token}"})
    assert staff_resp.status_code == 200
    staff_feed = staff_resp.json()
    assert len(staff_feed) > 0
    activity_types_staff = {item["activity_type"] for item in staff_feed}
    assert "cashbook" not in activity_types_staff  # Zero cashbook items for Staff!
