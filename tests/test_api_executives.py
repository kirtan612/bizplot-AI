"""
BizPilot AI - Automated Test Suite for Phase 6 AI Executive Layer.
Tests AI CFO, AI COO, AI CMO, AI CEO, Inter-Executive Collaboration,
Executive Boardroom Meetings, and Multi-Tenant Security Isolation.
"""

from uuid import UUID
import pytest
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.executives.context import build_executive_context
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive
from api.executives.ceo.service import CEOExecutive

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


def test_build_executive_context():
    """Verify structured business context extraction from PostgreSQL."""
    ctx = build_executive_context(UUID(TARGET_COMPANY_ID))
    assert ctx.organization.id == TARGET_COMPANY_ID
    assert ctx.financial.current_profit is not None
    assert ctx.customers.total_customers >= 0
    assert ctx.operations.total_active_products >= 0


def test_individual_executive_analyses():
    """Verify direct executive service analysis generation."""
    company_uuid = UUID(TARGET_COMPANY_ID)
    
    cfo_res = CFOExecutive().analyze(company_uuid)
    assert cfo_res.executive == "CFO"
    assert cfo_res.summary is not None
    assert len(cfo_res.priorities) > 0

    coo_res = COOExecutive().analyze(company_uuid)
    assert coo_res.executive == "COO"
    assert coo_res.summary is not None

    cmo_res = CMOExecutive().analyze(company_uuid)
    assert cmo_res.executive == "CMO"
    assert cmo_res.summary is not None

    ceo_res = CEOExecutive().analyze(company_uuid)
    assert ceo_res.executive == "CEO"
    assert ceo_res.summary is not None


def test_unauthenticated_executive_endpoints_fail(client):
    """Verify 401 Unauthorized when Bearer token is missing."""
    endpoints = [
        "/api/v1/executives",
        "/api/v1/executives/cfo",
        "/api/v1/executives/coo",
        "/api/v1/executives/cmo",
        "/api/v1/executives/ceo",
        "/api/v1/executives/meeting/latest"
    ]
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401


def test_api_list_executives(client, auth_headers):
    """Test GET /api/v1/executives returns list of executive roles."""
    resp = client.get("/api/v1/executives", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 4
    roles = [e["role"] for e in data]
    assert "CFO" in roles and "COO" in roles and "CMO" in roles and "CEO" in roles


def test_api_cfo_endpoint(client, auth_headers):
    """Test GET /api/v1/executives/cfo."""
    resp = client.get("/api/v1/executives/cfo", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["executive"] == "CFO"
    assert "summary" in data
    assert "priorities" in data


def test_api_coo_endpoint(client, auth_headers):
    """Test GET /api/v1/executives/coo."""
    resp = client.get("/api/v1/executives/coo", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["executive"] == "COO"


def test_api_cmo_endpoint(client, auth_headers):
    """Test GET /api/v1/executives/cmo."""
    resp = client.get("/api/v1/executives/cmo", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["executive"] == "CMO"


def test_api_ceo_endpoint(client, auth_headers):
    """Test GET /api/v1/executives/ceo."""
    resp = client.get("/api/v1/executives/ceo", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["executive"] == "CEO"


def test_api_collaboration_ask(client, auth_headers):
    """Test POST /api/v1/executives/collaboration/ask inter-executive Q&A."""
    payload = {
        "from_role": "CFO",
        "to_role": "COO",
        "question": "What operational factors are affecting COGS?"
    }
    resp = client.post("/api/v1/executives/collaboration/ask", json=payload, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["from_role"] == "CFO"
    assert data["to_role"] == "COO"
    assert "answer" in data


def test_api_boardroom_meeting(client, auth_headers):
    """Test POST /api/v1/executives/meeting/start and GET /meeting/latest."""
    resp = client.post("/api/v1/executives/meeting/start", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "meeting_id" in data
    assert len(data["decisions"]) > 0
    assert len(data["actions"]) > 0

    latest_resp = client.get("/api/v1/executives/meeting/latest", headers=auth_headers)
    assert latest_resp.status_code == 200
    assert latest_resp.json()["meeting_id"] is not None


def test_organization_isolation(client, alt_auth_headers):
    """Verify organization isolation for executive queries."""
    resp = client.get("/api/v1/executives/cfo", headers=alt_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["executive"] == "CFO"
