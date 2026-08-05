"""
FastAPI AI Predictions Routers Integration Tests (tests/test_api_predictions.py).
Verifies runtime 503 Service Unavailable behavior and check_model_availability isolation.
"""

import os
import sys
import uuid
# pyrefly: ignore [missing-import]
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.main import app
from api.services.model_registry import check_model_availability

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


def test_model_availability_check_isolation():
    """Test check_model_availability returns False when model files do not exist."""
    is_avail = check_model_availability("price_prediction", product_id=uuid.uuid4())
    assert is_avail is False


def test_price_prediction_returns_503(client, admin_token):
    """Test GET /api/predictions/price/{product_id} returns HTTP 503 Service Unavailable."""
    dummy_product_id = str(uuid.uuid4())
    response = client.get(f"/api/predictions/price/{dummy_product_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "unavailable"
    assert data["model_name"] == "price_prediction"
    assert data["product_id"] == dummy_product_id


def test_demand_prediction_returns_503(client, staff_token):
    """Test GET /api/predictions/demand/{product_id} returns HTTP 503 Service Unavailable."""
    dummy_product_id = str(uuid.uuid4())
    response = client.get(f"/api/predictions/demand/{dummy_product_id}", headers={"Authorization": f"Bearer {staff_token}"})
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "unavailable"
    assert data["model_name"] == "demand_forecasting"
    assert data["product_id"] == dummy_product_id


def test_anomalies_returns_503(client, admin_token):
    """Test GET /api/anomalies returns HTTP 503 Service Unavailable."""
    response = client.get("/api/anomalies", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "unavailable"
    assert data["model_name"] == "anomaly_detection"


def test_models_metadata_admin_vs_staff(client, admin_token, staff_token):
    """
    Test GET /api/models/metadata RBAC:
      - Admin: returns 503 (Model registry unavailable)
      - Staff: returns 403 Forbidden
    """
    # 1. Staff Request -> 403 Forbidden
    staff_resp = client.get("/api/models/metadata", headers={"Authorization": f"Bearer {staff_token}"})
    assert staff_resp.status_code == 403

    # 2. Admin Request -> 503 Service Unavailable
    admin_resp = client.get("/api/models/metadata", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 503
    assert admin_resp.json()["status"] == "unavailable"
