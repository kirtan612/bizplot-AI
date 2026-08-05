"""
FastAPI Inventory Router Integration Tests (tests/test_api_inventory.py).
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


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    resp = client.post("/api/auth/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    return resp.json()["access_token"]


def test_list_current_inventory(client, admin_token):
    """Test GET /api/inventory/current returns paginated latest snapshot per product."""
    response = client.get("/api/inventory/current?page=1&page_size=10", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert data["total"] == 140
    assert len(data["items"]) == 10
    first_item = data["items"][0]
    assert "product_code" in first_item
    assert "reorder_flag" in first_item


def test_inventory_history_for_product(client, admin_token):
    """Test GET /api/inventory/{product_id}/history returns stock ledger history."""
    # First get a valid product_id
    current_resp = client.get("/api/inventory/current?page=1&page_size=1", headers={"Authorization": f"Bearer {admin_token}"})
    product_id = current_resp.json()["items"][0]["product_id"]

    history_resp = client.get(f"/api/inventory/{product_id}/history?page=1&page_size=10", headers={"Authorization": f"Bearer {admin_token}"})
    assert history_resp.status_code == 200
    hist_data = history_resp.json()
    assert hist_data["total"] > 0
    assert all(item["product_id"] == product_id for item in hist_data["items"])
