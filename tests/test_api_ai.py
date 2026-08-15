"""
BizPilot AI - Automated Test Suite for Phase 4 AI Model Serving & REST APIs.
Tests authentication, multi-tenant organization isolation, retention predictions,
profit forecasts, cashflow liquidity risk, executive insights, and recommendations.
"""

from uuid import UUID
import pytest
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.services.ai_model_loader import is_model_available, load_model

TARGET_COMPANY_ID = "6289d24b-b8c8-4dc2-9105-f6399d1302c1"
ALT_COMPANY_ID = "11111111-1111-1111-1111-111111111111"
ADMIN_USER_ID = "51cc68c5-50ea-40a2-9e88-7aaa4c9ce0dc"


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def alt_auth_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": ALT_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


def test_ai_models_preloaded():
    """Verify all Phase 3 production models are available and loadable in memory."""
    for key in ["retention", "profit", "cashflow"]:
        assert is_model_available(key) is True
        model, meta = load_model(key)
        assert model is not None
        assert meta.get("status") in ["production", "candidate"]


def test_unauthenticated_requests_fail(client):
    """Verify 401 Unauthorized when Bearer token is missing."""
    endpoints = [
        "/api/v1/ai/retention/overview",
        "/api/v1/ai/profit/forecast",
        "/api/v1/ai/cashflow/forecast",
        "/api/v1/ai/insights",
        "/api/v1/ai/recommendations"
    ]
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401


def test_retention_overview_api(client, auth_headers):
    """Test GET /api/v1/ai/retention/overview returns valid schema and real counts."""
    resp = client.get("/api/v1/ai/retention/overview", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_customers"] > 0
    assert "high_risk_count" in data
    assert "overall_churn_rate_pct" in data
    assert "model" in data
    assert data["model"]["version"] == "1.0"


def test_retention_customers_list_api(client, auth_headers):
    """Test GET /api/v1/ai/retention/customers with risk filter and pagination."""
    resp = client.get("/api/v1/ai/retention/customers?page=1&page_size=10", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] > 0
    assert len(data["items"]) <= 10
    assert "churn_probability" in data["items"][0]
    assert "risk_level" in data["items"][0]


def test_retention_customer_detail_api(client, auth_headers):
    """Test GET /api/v1/ai/retention/customers/{customer_id} for valid customer detail."""
    overview_resp = client.get("/api/v1/ai/retention/overview", headers=auth_headers)
    cust_id = overview_resp.json()["high_risk_customers"][0]["customer_id"]

    resp = client.get(f"/api/v1/ai/retention/customers/{cust_id}", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["customer_id"] == cust_id
    assert 0.0 <= data["churn_probability"] <= 1.0
    assert data["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert len(data["top_factors"]) > 0
    assert len(data["recommendation"]) > 0


def test_retention_customer_detail_not_found(client, auth_headers):
    """Test 404 Not Found for non-existent or unauthorized customer ID."""
    random_uuid = "99999999-9999-9999-9999-999999999999"
    resp = client.get(f"/api/v1/ai/retention/customers/{random_uuid}", headers=auth_headers)
    assert resp.status_code == 404


def test_profit_forecast_api(client, auth_headers):
    """Test GET /api/v1/ai/profit/forecast returns next-month profit prediction."""
    resp = client.get("/api/v1/ai/profit/forecast", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert "predicted_profit" in data
    assert "change_percentage" in data
    assert data["risk_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert len(data["top_drivers"]) > 0


def test_profit_drivers_api(client, auth_headers):
    """Test GET /api/v1/ai/profit/drivers returns model-important feature drivers."""
    resp = client.get("/api/v1/ai/profit/drivers", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "importance" in data[0]


def test_cashflow_forecast_api(client, auth_headers):
    """Test GET /api/v1/ai/cashflow/forecast returns next-month liquidity forecast."""
    resp = client.get("/api/v1/ai/cashflow/forecast?min_threshold=40000000.0", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert "predicted_cash" in data
    assert "risk_level" in data
    assert len(data["recommendations"]) > 0


def test_cashflow_risk_api(client, auth_headers):
    """Test GET /api/v1/ai/cashflow/risk returns detailed liquidity risk analysis."""
    resp = client.get("/api/v1/ai/cashflow/risk", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert "projected_deficit" in data
    assert data["min_cash_threshold"] == 40000000.0


def test_ai_insights_api(client, auth_headers):
    """Test GET /api/v1/ai/insights returns combined executive summary."""
    resp = client.get("/api/v1/ai/insights", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "financial" in data
    assert "cashflow" in data
    assert "customers" in data
    assert data["priority"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


def test_ai_recommendations_api(client, auth_headers):
    """Test GET /api/v1/ai/recommendations returns prioritized actions with sources."""
    resp = client.get("/api/v1/ai/recommendations", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_count"] > 0
    assert len(data["recommendations"]) > 0
    assert "source" in data["recommendations"][0]


def test_organization_isolation(client, alt_auth_headers):
    """Test multi-tenant organization isolation: Org B receives 0 customers or controlled response."""
    resp = client.get("/api/v1/ai/retention/overview", headers=alt_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_customers"] == 0
    assert data["high_risk_count"] == 0
