"""
BizPilot AI - Ingestion Core Service.
Orchestrates raw storage, file validation, SHA-256 duplicate detection,
database tracking (import_jobs/import_files/import_logs), and source processing.
"""

import uuid
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from uuid import UUID
from sqlalchemy import text
from ml.data.extract import get_db_engine

from api.ingestion.schemas import (
    IngestionSourceType,
    IngestionStatus,
    IngestionJobResponse,
    IngestionListResponse,
    IngestionSheetMetadata,
    DuplicatePolicy,
    ConnectorStatusInfo
)
from api.ingestion.storage.raw_storage import RawStorage
from api.ingestion.validators.file_validator import validate_file_type
from api.ingestion.validators.ingestion_validator import (
    validate_file_size,
    calculate_content_hash,
    check_duplicate_ingestion
)
from api.ingestion.registry import registry

logger = logging.getLogger(__name__)
raw_storage = RawStorage()


def process_ingestion_upload(
    company_id: UUID,
    filename: str,
    content: bytes,
    user_id: Optional[UUID] = None,
    override_source_type: Optional[str] = None
) -> IngestionJobResponse:
    """
    Main ingestion handler: validates, stores raw file, calculates SHA-256,
    tracks job in PostgreSQL, executes source processor, and updates status.
    """
    engine = get_db_engine()
    now_dt = datetime.utcnow()
    created_at_str = now_dt.strftime("%Y-%m-%d %H:%M:%S UTC")

    # 1. Validate File Size
    size_ok, size_err = validate_file_size(content)
    if not size_ok:
        raise ValueError(size_err)

    # 2. Validate File Signature & MIME Type
    sig_ok, sig_type_or_err, mime = validate_file_type(filename, content)
    if not sig_ok:
        raise ValueError(sig_type_or_err)

    # Detect or override source type
    if override_source_type:
        try:
            stype = IngestionSourceType(override_source_type.upper())
        except Exception:
            stype = registry.detect_source_type(filename)
    else:
        stype = registry.detect_source_type(filename)

    # 3. Calculate Content Hash (SHA-256)
    content_hash = calculate_content_hash(content)

    # 4. Check Duplicate Ingestion
    is_dup, existing_id = check_duplicate_ingestion(company_id, content_hash)
    if is_dup:
        logger.info(f"Duplicate file uploaded for company {company_id}, hash={content_hash[:8]}")

    # 5. Create Ingestion Job ID
    ingestion_id = str(uuid.uuid4())

    # 6. Store Raw File Securely (Path Traversal Protection & Org Isolation)
    rel_storage_path, safe_filename = raw_storage.store(company_id, ingestion_id, filename, content)

    # 7. Create Job Record in PostgreSQL (import_jobs, import_files, import_logs)
    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO import_jobs (id, company_id, status, source_type, started_at, created_at, created_by)
                VALUES (:id, :cid, :status, :stype, :now, :now, :uby)
            """),
            {
                "id": ingestion_id,
                "cid": str(company_id),
                "status": "PROCESSING",
                "stype": stype.value,
                "now": now_dt,
                "uby": str(user_id) if user_id else None
            }
        )
        conn.execute(
            text("""
                INSERT INTO import_files (id, import_job_id, filename, row_count, checksum, created_at)
                VALUES (:fid, :jid, :fname, :rc, :chk, :now)
            """),
            {
                "fid": str(uuid.uuid4()),
                "jid": ingestion_id,
                "fname": filename,
                "rc": 0,
                "chk": content_hash,
                "now": now_dt
            }
        )
        conn.execute(
            text("""
                INSERT INTO import_logs (id, import_job_id, level, message, created_at)
                VALUES (:lid, :jid, 'INFO', :msg, :now)
            """),
            {
                "lid": str(uuid.uuid4()),
                "jid": ingestion_id,
                "msg": f"Ingestion started for {filename} ({len(content)} bytes, hash={content_hash[:8]})",
                "now": now_dt
            }
        )
        conn.commit()

    # 8. Execute Source Processor
    processor = registry.get_source(stype)
    try:
        proc_result = processor.ingest(content, filename)
        final_status = proc_result.get("status", "COMPLETED")
        record_count = proc_result.get("record_count", 0)
        sheets_data = proc_result.get("sheets", [])

        # Update Job Status in DB
        finished_dt = datetime.utcnow()
        with engine.connect() as conn:
            conn.execute(
                text("""
                    UPDATE import_jobs 
                    SET status = :st, finished_at = :fdt, updated_at = :fdt
                    WHERE id = :jid
                """),
                {"st": final_status, "fdt": finished_dt, "jid": ingestion_id}
            )
            conn.execute(
                text("""
                    UPDATE import_files 
                    SET row_count = :rc 
                    WHERE import_job_id = :jid
                """),
                {"rc": record_count, "jid": ingestion_id}
            )
            conn.execute(
                text("""
                    INSERT INTO import_logs (id, import_job_id, level, message, created_at)
                    VALUES (:lid, :jid, 'INFO', :msg, :now)
                """),
                {
                    "lid": str(uuid.uuid4()),
                    "jid": ingestion_id,
                    "msg": f"Ingestion completed with status {final_status}. Records: {record_count}",
                    "now": finished_dt
                }
            )
            conn.commit()

        sheets_objs = [IngestionSheetMetadata(**s) if isinstance(s, dict) else s for s in sheets_data]

        return IngestionJobResponse(
            id=ingestion_id,
            organization_id=str(company_id),
            source_type=stype,
            source_name=stype.value,
            status=IngestionStatus(final_status),
            file_name=filename,
            file_size_bytes=len(content),
            content_hash=content_hash,
            record_count=record_count,
            sheets=sheets_objs,
            started_at=created_at_str,
            completed_at=finished_dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
            created_at=created_at_str,
            metadata={"storage_path": rel_storage_path, "duplicate": is_dup}
        )

    except Exception as e:
        logger.error(f"Ingestion failed for job {ingestion_id}: {e}")
        finished_dt = datetime.utcnow()
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE import_jobs SET status = 'FAILED', finished_at = :fdt WHERE id = :jid"),
                {"fdt": finished_dt, "jid": ingestion_id}
            )
            conn.execute(
                text("INSERT INTO import_logs (id, import_job_id, level, message, created_at) VALUES (:lid, :jid, 'ERROR', :msg, :now)"),
                {"lid": str(uuid.uuid4()), "jid": ingestion_id, "msg": str(e), "now": finished_dt}
            )
            conn.commit()

        return IngestionJobResponse(
            id=ingestion_id,
            organization_id=str(company_id),
            source_type=stype,
            source_name=stype.value,
            status=IngestionStatus.FAILED,
            file_name=filename,
            file_size_bytes=len(content),
            content_hash=content_hash,
            record_count=0,
            sheets=[],
            created_at=created_at_str,
            error_message=str(e),
            metadata={"storage_path": rel_storage_path}
        )


def get_ingestion_job_status(company_id: UUID, ingestion_id: str) -> IngestionJobResponse:
    """Retrieves ingestion job details by ID, enforcing strict tenant isolation."""
    engine = get_db_engine()
    query = text("""
        SELECT ij.id, ij.company_id, ij.status, ij.source_type, ij.started_at, ij.finished_at, ij.created_at,
               f.filename, f.row_count, f.checksum
        FROM import_jobs ij
        LEFT JOIN import_files f ON f.import_job_id = ij.id
        WHERE ij.id = :jid AND ij.company_id = :cid AND ij.deleted_at IS NULL
    """)
    with engine.connect() as conn:
        row = conn.execute(query, {"jid": ingestion_id, "cid": str(company_id)}).fetchone()
        if not row:
            raise KeyError(f"Ingestion job '{ingestion_id}' not found for company.")

        stype = IngestionSourceType(row[3]) if row[3] in IngestionSourceType.__members__ else IngestionSourceType.FILE_UPLOAD
        status = IngestionStatus(row[2]) if row[2] in IngestionStatus.__members__ else IngestionStatus.PROCESSING

        return IngestionJobResponse(
            id=str(row[0]),
            organization_id=str(row[1]),
            source_type=stype,
            source_name=stype.value,
            status=status,
            file_name=row[7] or "uploaded_file",
            file_size_bytes=0,
            content_hash=row[9],
            record_count=row[8] or 0,
            sheets=[],
            started_at=str(row[4]) if row[4] else None,
            completed_at=str(row[5]) if row[5] else None,
            created_at=str(row[6]),
            metadata={}
        )


def list_organization_ingestions(company_id: UUID, page: int = 1, page_size: int = 20) -> IngestionListResponse:
    """Retrieves paginated ingestion job history for company_id."""
    engine = get_db_engine()
    offset = (page - 1) * page_size

    count_query = text("SELECT COUNT(*) FROM import_jobs WHERE company_id = :cid AND deleted_at IS NULL")
    list_query = text("""
        SELECT ij.id, ij.company_id, ij.status, ij.source_type, ij.created_at, f.filename, f.row_count, f.checksum
        FROM import_jobs ij
        LEFT JOIN import_files f ON f.import_job_id = ij.id
        WHERE ij.company_id = :cid AND ij.deleted_at IS NULL
        ORDER BY ij.created_at DESC
        LIMIT :limit OFFSET :offset
    """)

    with engine.connect() as conn:
        total = conn.execute(count_query, {"cid": str(company_id)}).scalar() or 0
        rows = conn.execute(list_query, {"cid": str(company_id), "limit": page_size, "offset": offset}).fetchall()

        items = []
        for r in rows:
            stype = IngestionSourceType(r[3]) if r[3] in IngestionSourceType.__members__ else IngestionSourceType.FILE_UPLOAD
            status = IngestionStatus(r[2]) if r[2] in IngestionStatus.__members__ else IngestionStatus.PROCESSING
            items.append(IngestionJobResponse(
                id=str(r[0]),
                organization_id=str(r[1]),
                source_type=stype,
                source_name=stype.value,
                status=status,
                file_name=r[5] or "uploaded_file",
                file_size_bytes=0,
                content_hash=r[7],
                record_count=r[6] or 0,
                created_at=str(r[4]),
                metadata={}
            ))

        return IngestionListResponse(
            total=total,
            page=page,
            page_size=page_size,
            items=items
        )


def retry_ingestion_job(company_id: UUID, ingestion_id: str) -> IngestionJobResponse:
    """Retries a recoverable ingestion job for company_id."""
    job = get_ingestion_job_status(company_id, ingestion_id)
    if job.status not in [IngestionStatus.FAILED, IngestionStatus.CANCELLED]:
        raise ValueError(f"Job {ingestion_id} is in state {job.status.value} and cannot be retried.")

    engine = get_db_engine()
    now_dt = datetime.utcnow()
    with engine.connect() as conn:
        conn.execute(
            text("UPDATE import_jobs SET status = 'PROCESSING', updated_at = :now WHERE id = :jid AND company_id = :cid"),
            {"now": now_dt, "jid": ingestion_id, "cid": str(company_id)}
        )
        conn.execute(
            text("INSERT INTO import_logs (id, import_job_id, level, message, created_at) VALUES (:lid, :jid, 'INFO', 'Retry initiated', :now)"),
            {"lid": str(uuid.uuid4()), "jid": ingestion_id, "now": now_dt}
        )
        conn.commit()

    return get_ingestion_job_status(company_id, ingestion_id)


def delete_ingestion_job(company_id: UUID, ingestion_id: str) -> bool:
    """Soft-deletes job record and removes raw storage folder."""
    job = get_ingestion_job_status(company_id, ingestion_id)
    engine = get_db_engine()
    now_dt = datetime.utcnow()

    with engine.connect() as conn:
        conn.execute(
            text("UPDATE import_jobs SET deleted_at = :now WHERE id = :jid AND company_id = :cid"),
            {"now": now_dt, "jid": ingestion_id, "cid": str(company_id)}
        )
        conn.commit()

    raw_storage.delete(company_id, ingestion_id)
    return True
