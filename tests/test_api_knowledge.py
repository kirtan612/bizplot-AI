"""
BizPilot AI - Automated Integration Test Suite for Phase 10 Company Knowledge Layer.
Tests Knowledge Profile, Knowledge Items, Build Pipeline, Relationships, Conflicts,
Health Summary, KnowledgeProvider Abstraction, and Multi-Tenant Isolation.
"""

import pytest
from uuid import UUID
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.knowledge.provider import KnowledgeProvider
from api.knowledge.services import (
    get_or_create_company_profile,
    build_company_knowledge,
    get_knowledge_summary,
    get_knowledge_health,
    resolve_knowledge_conflict,
)

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
        "username": "alt_demo",
        "company_id": ALT_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


def test_company_knowledge_summary_api(client, auth_headers):
    """Verify GET /api/v1/knowledge/summary endpoint."""
    resp = client.get("/api/v1/knowledge/summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_knowledge_items" in data
    assert "company_name" in data


def test_company_knowledge_health_api(client, auth_headers):
    """Verify GET /api/v1/knowledge/health endpoint."""
    resp = client.get("/api/v1/knowledge/health", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_health_score" in data
    assert data["overall_health_score"] > 0


def test_company_profile_api(client, auth_headers):
    """Verify GET /api/v1/knowledge/profile endpoint."""
    resp = client.get("/api/v1/knowledge/profile", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["company_id"] == TARGET_COMPANY_ID


def test_knowledge_build_trigger(client, auth_headers):
    """Verify POST /api/v1/knowledge/build endpoint."""
    resp = client.post("/api/v1/knowledge/build", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] in ["COMPLETED", "PROCESSING"]


def test_knowledge_conflicts_api(client, auth_headers):
    """Verify GET /api/v1/knowledge/conflicts endpoint."""
    resp = client.get("/api/v1/knowledge/conflicts", headers=auth_headers)
    assert resp.status_code == 200
    conflicts = resp.json()
    assert isinstance(conflicts, list)


def test_knowledge_provider_rag_readiness():
    """Verify KnowledgeProvider abstraction raises NotImplementedError on semantic_search."""
    from src.db.models.auth import User
    from api.auth.dependencies import CurrentUser

    dummy_user = CurrentUser(
        user_id=UUID(ADMIN_USER_ID),
        username="admin_demo",
        company_id=UUID(TARGET_COMPANY_ID),
        role="admin"
    )
    # We pass None as DB for testing method signature
    provider = KnowledgeProvider(None, dummy_user)
    with pytest.raises(NotImplementedError):
        provider.semantic_search("test query")


def test_tenant_isolation(client, auth_headers, alt_auth_headers):
    """Verify Organization A cannot access Organization B knowledge resources."""
    resp_a = client.get("/api/v1/knowledge/summary", headers=auth_headers)
    assert resp_a.status_code == 200
    data_a = resp_a.json()

    resp_b = client.get("/api/v1/knowledge/summary", headers=alt_auth_headers)
    assert resp_b.status_code == 200
    data_b = resp_b.json()

    assert data_a["company_id"] == TARGET_COMPANY_ID
    assert data_b["company_id"] == ALT_COMPANY_ID
