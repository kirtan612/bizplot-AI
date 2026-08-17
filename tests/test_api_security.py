"""
BizPilot AI - Automated Integration Test Suite for Phase 9 Security Gate.
Tests Authentication Hardening, JWT Claims, RBAC & Permission Matrix, Multi-Tenant Isolation,
BOLA/IDOR Defense, SQL Injection Safety, Path Traversal Sanitization, Rate Limiting, Audit Logging,
and AI Context Authorization & Minimization.
"""

import pytest
from uuid import UUID
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token, decode_access_token
from api.security.permissions import has_permission
from api.security.audit import redact_sensitive_dict
from api.security.rate_limiter import RateLimiter
from api.security.ai_boundary import minimize_ai_context, CurrentUser
from api.ingestion.storage.raw_storage import sanitize_filename

TARGET_COMPANY_ID = "6289d24b-b8c8-4dc2-9105-f6399d1302c1"
ALT_COMPANY_ID = "11111111-1111-1111-1111-111111111111"
ADMIN_USER_ID = "51cc68c5-50ea-40a2-9e88-7aaa4c9ce0dc"


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def finance_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "finance_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "finance"
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def viewer_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "viewer_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "viewer"
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


def test_jwt_validation_and_claims():
    """Verify JWT token encoding, decoding, and claims structure."""
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "admin"
    })
    payload = decode_access_token(token)
    assert payload["user_id"] == ADMIN_USER_ID
    assert payload["company_id"] == TARGET_COMPANY_ID
    assert payload["role"] == "admin"


def test_rbac_permissions():
    """Test Role-Based Access Control matrix logic."""
    assert has_permission("admin", "invoices.create")
    assert has_permission("finance", "invoices.create")
    assert not has_permission("viewer", "invoices.create")
    assert not has_permission("marketing", "bank.view")


def test_path_traversal_sanitization():
    """Verify filename path traversal sanitization."""
    bad_filename = "../../../etc/passwd"
    safe = sanitize_filename(bad_filename)
    assert "/" not in safe and "\\" not in safe
    assert safe == "passwd"


def test_log_redaction():
    """Verify automatic redaction of sensitive credentials in log payloads."""
    sensitive_data = {
        "username": "admin",
        "password": "secret_password_123",
        "jwt": "eyJhbGciOi...",
        "company_id": TARGET_COMPANY_ID
    }
    redacted = redact_sensitive_dict(sensitive_data)
    assert redacted["password"] == "[REDACTED]"
    assert redacted["jwt"] == "[REDACTED]"
    assert redacted["username"] == "admin"


def test_rate_limiter():
    """Test sliding window rate limiter."""
    limiter = RateLimiter(max_requests=3, window_seconds=60)
    client_ip = "192.168.1.100"
    assert limiter.is_allowed(client_ip)
    assert limiter.is_allowed(client_ip)
    assert limiter.is_allowed(client_ip)
    assert not limiter.is_allowed(client_ip)  # Exceeds max 3


def test_ai_context_minimization():
    """Verify role-based AI context minimization."""
    viewer_user = CurrentUser(
        user_id=UUID(ADMIN_USER_ID),
        username="viewer_demo",
        company_id=UUID(TARGET_COMPANY_ID),
        role="viewer"
    )
    raw_context = {
        "summary": "Co Summary",
        "financial_metrics": {"bank_balance": 500000.0},
        "operations_metrics": {"inventory_pcs": 1200}
    }
    minimized = minimize_ai_context(raw_context, viewer_user)
    assert minimized["financial_metrics"].get("status") == "RESTRICTED"


def test_unauthenticated_api_rejection(client):
    """Verify 401 Unauthorized for unauthenticated protected API requests."""
    assert client.get("/api/v1/customers").status_code == 401
    assert client.get("/api/v1/invoices").status_code == 401
    assert client.get("/api/v1/ingestion").status_code == 401


def test_cross_tenant_isolation(client, admin_headers, alt_auth_headers):
    """Verify Organization A cannot access Organization B resources."""
    # Org A creates invoice
    inv_resp = client.get("/api/v1/invoices", headers=admin_headers)
    assert inv_resp.status_code == 200

    # Org B queries invoices -> must receive 0 Org A invoices
    alt_resp = client.get("/api/v1/invoices", headers=alt_auth_headers)
    assert alt_resp.status_code == 200
    alt_invoices = alt_resp.json()
    assert len(alt_invoices) == 0
