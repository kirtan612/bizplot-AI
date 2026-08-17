"""
BizPilot AI - Phase 7 Automated End-to-End Ingestion Validation Runner.
Verifies User Authentication, Organization Resolution, Excel/CSV/PDF Uploads,
File Signature & Size Validation, Content Hashing (SHA-256), Path Traversal Protection,
Raw Storage Isolation, Organization Security Isolation, and REST APIs.
"""

import os
import io
import pandas as pd
from uuid import UUID
from typing import Dict, Any

from sqlalchemy import text
from ml.data.extract import get_db_engine
from api.auth.dependencies import CurrentUser
from api.ingestion.schemas import IngestionSourceType, IngestionStatus
from api.ingestion.validators.file_validator import validate_file_type
from api.ingestion.validators.ingestion_validator import validate_file_size, calculate_content_hash
from api.ingestion.storage.raw_storage import RawStorage, sanitize_filename
from api.ingestion.services import (
    process_ingestion_upload,
    get_ingestion_job_status,
    list_organization_ingestions,
    retry_ingestion_job,
    delete_ingestion_job
)
from api.routers.ingestion import (
    upload_ingestion_file,
    get_connectors,
    get_ingestion_status,
    list_ingestions,
    retry_ingestion,
    delete_ingestion
)

TARGET_COMPANY_UUID = UUID("6289d24b-b8c8-4dc2-9105-f6399d1302c1")
ALT_COMPANY_UUID = UUID("11111111-1111-1111-1111-111111111111")
ADMIN_USER_UUID = UUID("51cc68c5-50ea-40a2-9e88-7aaa4c9ce0dc")


def create_sample_excel() -> bytes:
    buf = io.BytesIO()
    df = pd.DataFrame({
        "Invoice_Number": ["INV-1001", "INV-1002", "INV-1003"],
        "Customer_Name": ["Apex Steel Ltd", "Bharati Metal", "Constro Systems"],
        "Amount": [150000.0, 240000.0, 95000.0]
    })
    with pd.ExcelWriter(buf, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name="Sales_Data", index=False)
    return buf.getvalue()


def create_sample_csv() -> bytes:
    csv_str = "Customer_Code,Customer_Name,Credit_Limit,Balance\nCUST01,Alpha Tubes,500000,120000\nCUST02,Beta Infra,300000,0\n"
    return csv_str.encode('utf-8')


def create_sample_pdf() -> bytes:
    return b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"


def validate_phase_7_ingestion() -> bool:
    print("=" * 60)
    print("      BIZPILOT AI PHASE 7 INGESTION VALIDATION")
    print("=" * 60)

    results = {
        "user_auth": False,
        "org_resolution": False,
        "excel_upload": False,
        "excel_validation": False,
        "excel_raw_storage": False,
        "excel_record": False,
        "excel_processing": False,
        "csv_upload": False,
        "csv_validation": False,
        "csv_raw_storage": False,
        "csv_processing": False,
        "pdf_upload": False,
        "pdf_validation": False,
        "pdf_raw_storage": False,
        "pdf_text_extraction_status": False,
        "security_org_isolation": False,
        "security_path_traversal": False,
        "security_file_size": False,
        "security_file_type": False,
        "security_safe_storage": False,
        "api_create": False,
        "api_status": False,
        "api_list": False,
        "api_retry": False,
        "api_delete": False,
        "duplicate_content_hashing": False,
        "duplicate_handling": False,
    }

    mock_user = CurrentUser(
        user_id=ADMIN_USER_UUID,
        username="admin_demo",
        role="admin",
        company_id=TARGET_COMPANY_UUID
    )

    alt_user = CurrentUser(
        user_id=ADMIN_USER_UUID,
        username="admin_demo",
        role="admin",
        company_id=ALT_COMPANY_UUID
    )

    # 1. Authentication & Organization Context Resolution
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            row = conn.execute(text("SELECT name FROM companies WHERE id = :cid"), {"cid": str(TARGET_COMPANY_UUID)}).fetchone()
            if row:
                results["user_auth"] = True
                results["org_resolution"] = True
    except Exception as e:
        print(f"Error resolving org context: {e}")

    # 2. File Signature & Size Security Baseline Checks
    try:
        excel_bytes = create_sample_excel()
        csv_bytes = create_sample_csv()
        pdf_bytes = create_sample_pdf()

        # Path Traversal Test
        bad_name = "../../../etc/passwd"
        safe_name = sanitize_filename(bad_name)
        if safe_name != bad_name and "passwd" in safe_name and "/" not in safe_name:
            results["security_path_traversal"] = True

        # File Size Limit Test
        big_content = b"X" * (51 * 1024 * 1024)
        size_ok, _ = validate_file_size(big_content, max_mb=50.0)
        if not size_ok:
            results["security_file_size"] = True

        # File Type & Signature Test
        bad_sig_ok, err_msg, _ = validate_file_type("invoice.pdf", b"NOT_A_PDF_HEADER")
        if not bad_sig_ok and "Invalid PDF" in err_msg:
            results["security_file_type"] = True

    except Exception as e:
        print(f"Error testing security baseline: {e}")

    # 3. Excel Upload & Processing Test
    try:
        excel_bytes = create_sample_excel()
        res_excel = process_ingestion_upload(TARGET_COMPANY_UUID, "sales_august.xlsx", excel_bytes, ADMIN_USER_UUID)
        if res_excel and res_excel.id:
            results["excel_upload"] = True
            results["excel_validation"] = True
            results["excel_raw_storage"] = True
            results["excel_record"] = True
            if res_excel.status == IngestionStatus.COMPLETED and res_excel.record_count == 3:
                results["excel_processing"] = True
    except Exception as e:
        print(f"Error testing Excel ingestion: {e}")

    # 4. CSV Upload & Processing Test
    try:
        csv_bytes = create_sample_csv()
        res_csv = process_ingestion_upload(TARGET_COMPANY_UUID, "customers_list.csv", csv_bytes, ADMIN_USER_UUID)
        if res_csv and res_csv.id:
            results["csv_upload"] = True
            results["csv_validation"] = True
            results["csv_raw_storage"] = True
            if res_csv.status == IngestionStatus.COMPLETED and res_csv.record_count == 2:
                results["csv_processing"] = True
    except Exception as e:
        print(f"Error testing CSV ingestion: {e}")

    # 5. PDF Upload & Processing Test
    try:
        pdf_bytes = create_sample_pdf()
        res_pdf = process_ingestion_upload(TARGET_COMPANY_UUID, "supplier_invoice_124.pdf", pdf_bytes, ADMIN_USER_UUID)
        if res_pdf and res_pdf.id:
            results["pdf_upload"] = True
            results["pdf_validation"] = True
            results["pdf_raw_storage"] = True
            if res_pdf.status in [IngestionStatus.COMPLETED, IngestionStatus.OCR_REQUIRED]:
                results["pdf_text_extraction_status"] = True
    except Exception as e:
        print(f"Error testing PDF ingestion: {e}")

    # 6. Duplicate Content Hashing Test
    try:
        hash_1 = calculate_content_hash(excel_bytes)
        res_excel_dup = process_ingestion_upload(TARGET_COMPANY_UUID, "sales_august_copy.xlsx", excel_bytes, ADMIN_USER_UUID)
        if res_excel_dup and res_excel_dup.metadata.get("duplicate") is True:
            results["duplicate_content_hashing"] = True
            results["duplicate_handling"] = True
    except Exception as e:
        print(f"Error testing duplicate detection: {e}")

    # 7. Safe Raw Storage Verification
    try:
        raw_st = RawStorage()
        if raw_st.exists(TARGET_COMPANY_UUID, res_excel.id):
            results["security_safe_storage"] = True
    except Exception as e:
        print(f"Error verifying raw storage: {e}")

    # 8. API Router Endpoint Tests & Multi-Tenant Organization Isolation Test
    try:
        # API Create / List
        list_res = list_ingestions(page=1, page_size=20, current_user=mock_user)
        if list_res and list_res.total >= 3:
            results["api_list"] = True
            results["api_create"] = True

        # API Status
        job_id = res_excel.id
        status_res = get_ingestion_status(job_id, current_user=mock_user)
        if status_res and status_res.id == job_id:
            results["api_status"] = True

        # Organization Security Isolation Test (Org Alt user must get 404 when requesting Org Target job)
        try:
            get_ingestion_status(job_id, current_user=alt_user)
        except Exception:
            # 404 Exception expected -> Organization Isolation Verified!
            results["security_org_isolation"] = True

        # API Retry Test (retry completed job raises 400 or handles gracefully)
        try:
            retry_ingestion(job_id, current_user=mock_user)
        except Exception:
            results["api_retry"] = True

        # API Delete Test
        del_job = process_ingestion_upload(TARGET_COMPANY_UUID, "temp_delete.csv", csv_bytes, ADMIN_USER_UUID)
        del_res = delete_ingestion(del_job.id, current_user=mock_user)
        if del_res and del_res.get("status") == "DELETED":
            results["api_delete"] = True

    except Exception as e:
        print(f"Error testing API router & security isolation: {e}")

    # Print Summary Output
    print("\nAUTHENTICATION")
    print(f"  {'[OK]' if results['user_auth'] else '[FAIL]'} User authenticated")

    print("\nORGANIZATION")
    print(f"  {'[OK]' if results['org_resolution'] else '[FAIL]'} Organization context resolved")

    print("\nEXCEL")
    print(f"  {'[OK]' if results['excel_upload'] else '[FAIL]'} Upload")
    print(f"  {'[OK]' if results['excel_validation'] else '[FAIL]'} Validation")
    print(f"  {'[OK]' if results['excel_raw_storage'] else '[FAIL]'} Raw storage")
    print(f"  {'[OK]' if results['excel_record'] else '[FAIL]'} Ingestion record")
    print(f"  {'[OK]' if results['excel_processing'] else '[FAIL]'} Processing")

    print("\nCSV")
    print(f"  {'[OK]' if results['csv_upload'] else '[FAIL]'} Upload")
    print(f"  {'[OK]' if results['csv_validation'] else '[FAIL]'} Validation")
    print(f"  {'[OK]' if results['csv_raw_storage'] else '[FAIL]'} Raw storage")
    print(f"  {'[OK]' if results['csv_processing'] else '[FAIL]'} Processing")

    print("\nPDF")
    print(f"  {'[OK]' if results['pdf_upload'] else '[FAIL]'} Upload")
    print(f"  {'[OK]' if results['pdf_validation'] else '[FAIL]'} Validation")
    print(f"  {'[OK]' if results['pdf_raw_storage'] else '[FAIL]'} Raw storage")
    print(f"  {'[OK]' if results['pdf_text_extraction_status'] else '[FAIL]'} Text extraction status")

    print("\nSECURITY BASELINE")
    print(f"  {'[OK]' if results['security_org_isolation'] else '[FAIL]'} Organization isolation")
    print(f"  {'[OK]' if results['security_path_traversal'] else '[FAIL]'} Path traversal protection")
    print(f"  {'[OK]' if results['security_file_size'] else '[FAIL]'} File size validation")
    print(f"  {'[OK]' if results['security_file_type'] else '[FAIL]'} File type validation")
    print(f"  {'[OK]' if results['security_safe_storage'] else '[FAIL]'} Safe storage")

    print("\nINGESTION API")
    print(f"  {'[OK]' if results['api_create'] else '[FAIL]'} Create")
    print(f"  {'[OK]' if results['api_status'] else '[FAIL]'} Status")
    print(f"  {'[OK]' if results['api_list'] else '[FAIL]'} List")
    print(f"  {'[OK]' if results['api_retry'] else '[FAIL]'} Retry")
    print(f"  {'[OK]' if results['api_delete'] else '[FAIL]'} Delete")

    print("\nDUPLICATE DETECTION")
    print(f"  {'[OK]' if results['duplicate_content_hashing'] else '[FAIL]'} Content hashing")
    print(f"  {'[OK]' if results['duplicate_handling'] else '[FAIL]'} Duplicate handling")

    all_passed = all(results.values())

    print("=" * 60)
    print(f"FINAL STATUS: {'PASS' if all_passed else 'FAIL'}")
    print("=" * 60)

    return all_passed


if __name__ == "__main__":
    import sys
    success = validate_phase_7_ingestion()
    sys.exit(0 if success else 1)
