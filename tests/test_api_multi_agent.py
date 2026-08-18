"""
BizPilot AI - Automated Integration Test Suite for Phase 12 Advanced Multi-Agent Intelligence.
Tests CFO/COO/CMO/CEO agents, Capability Matrix, Controlled Tools, Multi-Agent Orchestrator,
Conflict Detection, Meeting Lifecycle, and FastAPI Endpoints.
"""

import pytest
from uuid import UUID
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.executives.capabilities import AGENT_CAPABILITY_MATRIX, verify_agent_permission
from api.executives.agents import CFOAgent, COOAgent, CMOAgent, CEOAgent

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


def test_agent_capability_matrix():
    """Verify backend capability matrix rules for CFO, COO, CMO, and CEO."""
    assert verify_agent_permission("CFO", "financial_sql") is True
    assert verify_agent_permission("CFO", "cashflow_ml") is True
    assert verify_agent_permission("CMO", "cashflow_ml") is False
    assert verify_agent_permission("COO", "operational_documents") is True


def test_agent_analysis_outputs():
    """Verify CFO, COO, CMO, and CEO agent outputs generate structured findings and recommendations."""
    cfo = CFOAgent()
    coo = COOAgent()
    cmo = CMOAgent()
    ceo = CEOAgent()

    cfo_out = cfo.analyze_context({"structured_metrics": {"total_invoices_issued": 150}, "ml_predictions": {"net_cashflow_forecast": 500000}})
    coo_out = coo.analyze_context({"structured_metrics": {"active_orders": 25, "fulfillment_rate_pct": 98.5}})
    cmo_out = cmo.analyze_context({"structured_metrics": {"overall_churn_rate_pct": 2.1, "retention_probability_pct": 97.9}})
    ceo_out = ceo.synthesize_executive_outputs(cfo_out, coo_out, cmo_out)

    assert cfo_out.agent_role == "CFO"
    assert coo_out.agent_role == "COO"
    assert cmo_out.agent_role == "CMO"
    assert ceo_out.agent_role == "CEO"
    assert len(ceo_out.recommendations) > 0


def test_multi_agent_query_api(client, auth_headers):
    """Verify POST /api/v1/executives/query endpoint."""
    resp = client.post(
        "/api/v1/executives/query",
        headers=auth_headers,
        json={"query": "Why did profit decline last month?", "mode": "MULTI_AGENT"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "COMPLETED"
    assert "ceo_synthesis" in data
    assert "conflicts" in data


def test_executive_meeting_api(client, auth_headers):
    """Verify POST /api/v1/executives/meetings and GET /api/v1/executives/meetings endpoints."""
    # Create meeting
    post_resp = client.post(
        "/api/v1/executives/meetings",
        headers=auth_headers,
        json={"query": "Quarterly Business Review Session", "mode": "EXECUTIVE_REVIEW"}
    )
    assert post_resp.status_code == 200
    meeting_data = post_resp.json()
    meeting_id = meeting_data["meeting_id"]

    # List meetings
    list_resp = client.get("/api/v1/executives/meetings", headers=auth_headers)
    assert list_resp.status_code == 200
    meetings = list_resp.json()
    assert len(meetings) > 0

    # Get findings
    find_resp = client.get(f"/api/v1/executives/meetings/{meeting_id}/findings", headers=auth_headers)
    assert find_resp.status_code == 200
    findings = find_resp.json()
    assert len(findings) > 0

    # Get recommendations
    rec_resp = client.get(f"/api/v1/executives/meetings/{meeting_id}/recommendations", headers=auth_headers)
    assert rec_resp.status_code == 200
    recs = rec_resp.json()
    assert len(recs) > 0
