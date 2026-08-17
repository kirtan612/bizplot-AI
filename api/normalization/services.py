"""
BizPilot AI - Core Phase 8 Data Normalization Workflow Service.
Orchestrates Raw Ingestion -> Schema Detection -> Type Normalization ->
Entity Resolution -> Duplicate Detection -> Canonical Persistence -> Lineage -> Data Quality Report.
"""

import os
import io
import pandas as pd
from uuid import UUID, uuid4
from datetime import datetime, date
from typing import Dict, Any, List, Optional, Tuple

from sqlalchemy import text
from sqlalchemy.orm import Session
from ml.data.extract import get_db_engine
from src.db.models.import_tracking import ImportJob
from src.db.models.master_data import Customer, Supplier, Product
from src.db.models.canonical import (
    CanonicalOrder,
    CanonicalOrderItem,
    CanonicalInvoice,
    CanonicalInvoiceItem,
    CanonicalPayment,
    CanonicalExpense,
    CanonicalBankTransaction,
    CanonicalEmployee,
    CanonicalTaxRecord,
    CanonicalDocument,
    SourceLineage,
    NormalizationJob,
    ReviewQueueItem
)
from api.ingestion.storage.raw_storage import RawStorage
from api.normalization.type_normalizer import (
    normalize_date,
    normalize_currency_amount,
    normalize_number,
    normalize_percentage,
    normalize_text
)
from api.normalization.schema_detector import detect_entity_schema
from api.normalization.entity_resolver import resolve_customer, resolve_supplier, normalize_entity_name
from api.normalization.lineage import record_lineage
from api.normalization.schemas import (
    NormalizationReport,
    MatchingConfidence,
    DataQualityState,
    NormalizationPreviewResponse,
    ColumnMappingPreview
)


def preview_ingestion_normalization(company_id: UUID, ingestion_id: str) -> NormalizationPreviewResponse:
    """Previews schema detection & sample normalized records for an ingestion job."""
    raw_st = RawStorage()
    content = raw_st.get_file(company_id, ingestion_id)
    if not content:
        raise ValueError(f"Ingestion file for job '{ingestion_id}' not found in raw storage.")

    # Try reading as DataFrame
    df = None
    try:
        df = pd.read_excel(io.BytesIO(content))
    except Exception:
        try:
            df = pd.read_csv(io.BytesIO(content))
        except Exception:
            pass

    if df is None or df.empty:
        return NormalizationPreviewResponse(
            ingestion_id=ingestion_id,
            detected_entity_type="Document",
            column_mappings=[],
            total_rows_previewed=0,
            sample_normalized_records=[]
        )

    headers = [str(col) for col in df.columns]
    entity_type, field_mapping, confidence_score = detect_entity_schema(headers)

    mappings_preview = []
    for hdr in headers:
        mapped = field_mapping.get(hdr, "unmapped")
        conf = MatchingConfidence.HIGH_CONFIDENCE if mapped != "unmapped" else MatchingConfidence.UNMATCHED
        mappings_preview.append(ColumnMappingPreview(
            source_column=hdr,
            mapped_canonical_field=mapped,
            confidence=conf,
            data_type="str"
        ))

    samples = []
    for idx, row in df.head(3).iterrows():
        sample_dict = {col: str(val) for col, val in row.to_dict().items()}
        samples.append(sample_dict)

    return NormalizationPreviewResponse(
        ingestion_id=ingestion_id,
        detected_entity_type=entity_type,
        column_mappings=mappings_preview,
        total_rows_previewed=len(df),
        sample_normalized_records=samples
    )


def normalize_ingestion_job(company_id: UUID, ingestion_id: str) -> NormalizationReport:
    """
    Main Normalization Execution Engine.
    Transforms Phase 7 raw file into canonical database entities with idempotency and lineage tracking.
    """
    engine = get_db_engine()
    raw_st = RawStorage()

    with Session(engine) as session:
        # Check ImportJob Record for tenant isolation
        import_job = session.query(ImportJob).filter(
            ImportJob.id == ingestion_id,
            ImportJob.company_id == company_id
        ).first()

        if not import_job:
            raise ValueError(f"Ingestion job '{ingestion_id}' not found for organization.")

        # Idempotency Check: Existing Normalization Job
        norm_job = session.query(NormalizationJob).filter(
            NormalizationJob.company_id == company_id,
            NormalizationJob.ingestion_id == str(ingestion_id)
        ).first()

        if not norm_job:
            norm_job = NormalizationJob(
                company_id=company_id,
                ingestion_id=str(ingestion_id),
                status="PROCESSING",
                started_at=datetime.utcnow()
            )
            session.add(norm_job)
            session.commit()
        else:
            norm_job.status = "PROCESSING"
            norm_job.started_at = datetime.utcnow()
            session.commit()

        # Fetch Raw Data from Storage
        content = raw_st.get_file(company_id, str(ingestion_id))
        df = None
        if content:
            try:
                df = pd.read_excel(io.BytesIO(content))
            except Exception:
                try:
                    df = pd.read_csv(io.BytesIO(content))
                except Exception:
                    pass

        records_received = len(df) if df is not None else 1
        records_processed = 0
        records_created = 0
        records_updated = 0
        records_duplicates = 0
        records_skipped = 0
        records_review_required = 0
        records_failed = 0

        # Process Structured Data (Excel / CSV)
        if df is not None and not df.empty:
            headers = [str(col) for col in df.columns]
            entity_type, field_mapping, confidence_score = detect_entity_schema(headers)

            for idx, row in df.iterrows():
                records_processed += 1
                row_dict = row.to_dict()
                row_ref = f"ROW-{idx + 1}"

                # Extract Key Raw Values
                raw_inv_no = str(row_dict.get("Invoice_Number") or row_dict.get("invoice_no") or row_dict.get("Invoice No") or row_ref).strip()
                raw_cust_name = str(row_dict.get("Customer_Name") or row_dict.get("customer") or row_dict.get("Customer") or "").strip()
                raw_amount = row_dict.get("Amount") or row_dict.get("amount") or row_dict.get("Total") or 0.0
                raw_date = row_dict.get("Date") or row_dict.get("Invoice_Date") or row_dict.get("date")

                # 1. Type Normalization
                norm_dt, dt_status = normalize_date(raw_date)
                amount_val, currency, amt_status = normalize_currency_amount(raw_amount)

                # 2. Entity Resolution
                cust_obj = None
                cust_conf = MatchingConfidence.UNMATCHED
                if raw_cust_name:
                    cust_obj, cust_conf, conf_score = resolve_customer(session, str(company_id), raw_cust_name)

                    # Route Low Confidence Matches to Review Queue
                    if cust_conf == MatchingConfidence.MEDIUM_CONFIDENCE or conf_score < 0.70:
                        rev_item = ReviewQueueItem(
                            company_id=company_id,
                            ingestion_id=str(ingestion_id),
                            entity_type="Customer",
                            raw_data=row_dict,
                            confidence_score=conf_score,
                            match_candidates={"matched_customer_id": str(cust_obj.id) if cust_obj else None, "raw_name": raw_cust_name},
                            status="REQUIRES_REVIEW",
                            reason=f"Medium confidence customer match ({conf_score:.2f}) for '{raw_cust_name}'"
                        )
                        session.add(rev_item)
                        records_review_required += 1

                # 3. Duplicate Detection & Idempotency Enforcement
                existing_inv = session.query(CanonicalInvoice).filter(
                    CanonicalInvoice.company_id == company_id,
                    CanonicalInvoice.invoice_number == raw_inv_no
                ).first()

                if existing_inv:
                    records_duplicates += 1
                    records_updated += 1
                    existing_inv.total = amount_val
                    existing_inv.status = "PAID"
                    existing_inv.source_type = import_job.source_type
                    existing_inv.ingestion_id = str(ingestion_id)
                    record_lineage(
                        session=session,
                        company_id=company_id,
                        entity_type="Invoice",
                        entity_id=existing_inv.id,
                        source_type=import_job.source_type,
                        source_record_id=raw_inv_no,
                        ingestion_id=str(ingestion_id)
                    )
                else:
                    new_inv = CanonicalInvoice(
                        company_id=company_id,
                        external_reference=row_ref,
                        invoice_number=raw_inv_no,
                        invoice_type="SALE",
                        customer_id=cust_obj.id if cust_obj else None,
                        invoice_date=norm_dt if norm_dt else date.today(),
                        currency=currency,
                        subtotal=amount_val,
                        tax=round(amount_val * 0.18, 2),
                        total=round(amount_val * 1.18, 2),
                        status="PAID",
                        source_type=import_job.source_type,
                        ingestion_id=str(ingestion_id)
                    )
                    session.add(new_inv)
                    session.flush()

                    # Record Source Lineage
                    record_lineage(
                        session=session,
                        company_id=company_id,
                        entity_type="Invoice",
                        entity_id=new_inv.id,
                        source_type=import_job.source_type,
                        source_record_id=raw_inv_no,
                        ingestion_id=str(ingestion_id)
                    )

                    # Also create corresponding Canonical Order
                    new_order = CanonicalOrder(
                        company_id=company_id,
                        external_reference=row_ref,
                        order_number=f"ORD-{raw_inv_no}",
                        customer_id=cust_obj.id if cust_obj else None,
                        order_date=norm_dt if norm_dt else date.today(),
                        order_type="SALE",
                        total=round(amount_val * 1.18, 2),
                        source_type=import_job.source_type,
                        ingestion_id=str(ingestion_id)
                    )
                    session.add(new_order)
                    records_created += 1

        else:
            # Unstructured / Document Data (PDF, general documents)
            records_processed = 1
            new_doc = CanonicalDocument(
                company_id=company_id,
                ingestion_id=str(ingestion_id),
                source_type=import_job.source_type,
                file_name=import_job.source_type + "_doc.pdf",
                document_type="GENERAL_DOCUMENT",
                document_date=date.today(),
                status="PROCESSED",
                doc_metadata={"ingested_via": "Phase 7 Storage"}
            )
            session.add(new_doc)
            records_created += 1

        # Finalize Normalization Job Record
        norm_job.status = "COMPLETED"
        norm_job.records_received = records_received
        norm_job.records_processed = records_processed
        norm_job.records_created = records_created
        norm_job.records_updated = records_updated
        norm_job.records_skipped = records_skipped
        norm_job.records_failed = records_failed
        norm_job.completed_at = datetime.utcnow()
        session.commit()

        valid_pct = round((records_processed - records_failed) / records_received * 100.0, 1) if records_received > 0 else 100.0
        dup_pct = round(records_duplicates / records_received * 100.0, 1) if records_received > 0 else 0.0

        return NormalizationReport(
            job_id=str(norm_job.id),
            organization_id=str(company_id),
            ingestion_id=str(ingestion_id),
            status="COMPLETED",
            records_received=records_received,
            records_processed=records_processed,
            records_created=records_created,
            records_updated=records_updated,
            records_duplicates=records_duplicates,
            records_skipped=records_skipped,
            records_review_required=records_review_required,
            records_failed=records_failed,
            valid_pct=valid_pct,
            duplicate_pct=dup_pct,
            started_at=norm_job.started_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            completed_at=norm_job.completed_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            summary_message=f"Successfully normalized {records_processed}/{records_received} records into canonical BizPilot model."
        )


def list_canonical_customers(company_id: UUID) -> List[Dict[str, Any]]:
    """Retrieves organization-scoped canonical customers."""
    engine = get_db_engine()
    with Session(engine) as session:
        custs = session.query(Customer).filter(Customer.company_id == company_id).all()
        return [
            {
                "id": str(c.id),
                "customer_code": c.customer_code,
                "customer_name": c.customer_name,
                "customer_type": c.customer_type,
                "city": c.city,
                "state": c.state,
                "gstin": c.gstin,
                "credit_limit": float(c.credit_limit),
                "active": c.active
            }
            for c in custs
        ]


def list_canonical_invoices(company_id: UUID) -> List[Dict[str, Any]]:
    """Retrieves organization-scoped canonical invoices."""
    engine = get_db_engine()
    with Session(engine) as session:
        invs = session.query(CanonicalInvoice).filter(CanonicalInvoice.company_id == company_id).all()
        return [
            {
                "id": str(i.id),
                "invoice_number": i.invoice_number,
                "invoice_type": i.invoice_type,
                "customer_id": str(i.customer_id) if i.customer_id else None,
                "invoice_date": str(i.invoice_date),
                "currency": i.currency,
                "subtotal": float(i.subtotal),
                "tax": float(i.tax),
                "total": float(i.total),
                "status": i.status,
                "source_type": i.source_type,
                "ingestion_id": i.ingestion_id
            }
            for i in invs
        ]
