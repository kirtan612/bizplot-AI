"""
FastAPI Auth Router Integration Tests (tests/test_api_auth.py).
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


def test_login_success_admin(client):
    """Test successful login for admin_demo user."""
    response = client.post("/api/auth/login", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "admin"
    assert data["expires_in"] == 3600


def test_login_success_staff(client):
    """Test successful login for staff_demo user."""
    response = client.post("/api/auth/login", json={
        "username": STAFF_USERNAME,
        "password": STAFF_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "staff"


def test_login_incorrect_password(client):
    """Test login failure with incorrect password returns 401 Unauthorized."""
    response = client.post("/api/auth/login", json={
        "username": ADMIN_USERNAME,
        "password": "wrong_password_123"
    })
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_get_me_authenticated(client):
    """Test GET /api/auth/me returns identity for authenticated user."""
    token = client.post("/api/auth/login", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }).json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    me = response.json()
    assert me["username"] == ADMIN_USERNAME
    assert me["role"] == "admin"
    assert "company_id" in me
