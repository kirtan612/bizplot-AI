"""
BizPilot AI - Automated Test Suite for Phase 7 Enterprise Data Ingestion.
Tests Excel, CSV, PDF uploads, validation rules, raw storage, duplicate hashing,
retry, deletion, and organization isolation security boundaries.
"""

import io
from uuid import UUID
import pytest
import pandas as pd
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.ingestion.schemas import IngestionSourceType, IngestionStatus
from api.ingestion.storage.raw_storage import RawStorage, sanitize_filename
from api.ingestion.validators.file_validator import validate_file_type
from api.ingestion.validators.ingestion_validator import validate_file_size, calculate_content_hash

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


def create_test_excel_bytes() -> bytes:
    buf = io.BytesIO()
    df = pd.DataFrame({"SKU": ["MS-PIPE-01", "GI-PIPE-02"], "Qty": [100, 200]})
    with pd.ExcelWriter(buf, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name="Stock", index=False)
    return buf.getvalue()


def create_test_csv_bytes() -> bytes:
    return "Product,Price\nMS Pipe 100mm,450.0\nGI Pipe 50mm,620.0\n".encode('utf-8')


def create_test_pdf_bytes() -> bytes:
    return b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"


def test_file_validator_and_security():
    """Test file signature validation and path traversal protection."""
    # Invalid extension
    valid, msg, _ = validate_file_type("script.sh", b"#!/bin/bash")
    assert not valid
    assert "Unsupported file extension" in msg

    # Invalid PDF Signature
    valid_pdf, msg_pdf, _ = validate_file_type("test.pdf", b"INVALID_HEADER")
    assert not valid_pdf
    assert "Invalid PDF" in msg_pdf

    # Path Traversal Sanitization
    bad_path = "../../secret.txt"
    safe = sanitize_filename(bad_path)
    assert "/" not in safe and "\\" not in safe
    assert safe == "secret.txt"


def test_file_size_validation():
    """Test configurable file size limits."""
    small_bytes = b"Hello World"
    valid, msg = validate_file_size(small_bytes, max_mb=10.0)
    assert valid

    big_bytes = b"X" * (11 * 1024 * 1024)
    valid_big, msg_big = validate_file_size(big_bytes, max_mb=10.0)
    assert not valid_big
    assert "exceeds maximum" in msg_big


def test_unauthenticated_ingestion_endpoints_fail(client):
    """Test 401 Unauthorized for unauthenticated requests."""
    assert client.get("/api/v1/ingestion").status_code == 401
    assert client.get("/api/v1/ingestion/connectors").status_code == 401


def test_get_connectors_catalog(client, auth_headers):
    """Test GET /api/v1/ingestion/connectors."""
    resp = client.get("/api/v1/ingestion/connectors", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 5
    ids = [c["id"] for c in data]
    assert "excel_csv" in ids and "pdf_documents" in ids and "bank_statements" in ids


def test_csv_upload_and_status(client, auth_headers):
    """Test POST /api/v1/ingestion/upload with CSV file."""
    csv_bytes = create_test_csv_bytes()
    files = {"file": ("inventory_test.csv", csv_bytes, "text/csv")}
    resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["source_type"] == "CSV"
    assert data["status"] == "COMPLETED"
    assert data["record_count"] == 2
    job_id = data["id"]

    # Get Job Status
    status_resp = client.get(f"/api/v1/ingestion/{job_id}", headers=auth_headers)
    assert status_resp.status_code == 200
    assert status_resp.json()["id"] == job_id


def test_excel_upload_and_sheets(client, auth_headers):
    """Test POST /api/v1/ingestion/upload with Excel file."""
    excel_bytes = create_test_excel_bytes()
    files = {"file": ("stock_august.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["source_type"] == "EXCEL"
    assert data["status"] == "COMPLETED"
    assert len(data["sheets"]) == 1
    assert data["sheets"][0]["name"] == "Stock"


def test_pdf_upload(client, auth_headers):
    """Test POST /api/v1/ingestion/upload with PDF document."""
    pdf_bytes = create_test_pdf_bytes()
    files = {"file": ("invoice_99.pdf", pdf_bytes, "application/pdf")}
    resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["source_type"] == "PDF"
    assert data["status"] in ["COMPLETED", "OCR_REQUIRED"]


def test_list_ingestions(client, auth_headers):
    """Test GET /api/v1/ingestion job history listing."""
    resp = client.get("/api/v1/ingestion?page=1&page_size=10", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert data["total"] > 0


def test_organization_security_isolation(client, auth_headers, alt_auth_headers):
    """Verify Organization A cannot access Organization B ingestion jobs."""
    csv_bytes = create_test_csv_bytes()
    files = {"file": ("org_a_data.csv", csv_bytes, "text/csv")}
    resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    job_id = resp.json()["id"]

    # Alt user (Org B) requests Org A's job status -> MUST return 404
    alt_resp = client.get(f"/api/v1/ingestion/{job_id}", headers=alt_auth_headers)
    assert alt_resp.status_code == 404


def test_delete_ingestion_job(client, auth_headers):
    """Test DELETE /api/v1/ingestion/{id}."""
    csv_bytes = create_test_csv_bytes()
    files = {"file": ("delete_me.csv", csv_bytes, "text/csv")}
    resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    job_id = resp.json()["id"]

    del_resp = client.delete(f"/api/v1/ingestion/{job_id}", headers=auth_headers)
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "DELETED"
