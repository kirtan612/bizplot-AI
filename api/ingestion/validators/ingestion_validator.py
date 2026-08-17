"""
BizPilot AI - Ingestion Size, Duplicate, and Security Validator.
Enforces configurable size limits, calculates SHA-256 content hashes,
and checks for duplicate ingestions per tenant.
"""

import os
import hashlib
import logging
from uuid import UUID
from typing import Tuple, Optional
from sqlalchemy import text
from ml.data.extract import get_db_engine
from api.ingestion.schemas import DuplicatePolicy

logger = logging.getLogger(__name__)

# Configurable MAX_UPLOAD_SIZE_MB (default: 50MB)
DEFAULT_MAX_UPLOAD_SIZE_MB = float(os.getenv("MAX_UPLOAD_SIZE_MB", "50.0"))


def calculate_content_hash(content: bytes) -> str:
    """Calculates SHA-256 hash for file byte content."""
    sha256 = hashlib.sha256()
    sha256.update(content)
    return sha256.hexdigest()


def validate_file_size(content_bytes: bytes, max_mb: float = DEFAULT_MAX_UPLOAD_SIZE_MB) -> Tuple[bool, str]:
    """Validates file size against configured limit in megabytes."""
    size_bytes = len(content_bytes)
    max_bytes = int(max_mb * 1024 * 1024)
    if size_bytes > max_bytes:
        size_mb = size_bytes / (1024 * 1024)
        return False, f"File size ({size_mb:.2f} MB) exceeds maximum configured limit of {max_mb:.1f} MB."
    return True, ""


def check_duplicate_ingestion(
    company_id: UUID, 
    content_hash: str, 
    policy: DuplicatePolicy = DuplicatePolicy.REJECT
) -> Tuple[bool, Optional[str]]:
    """
    Checks if a file with identical SHA-256 hash has already been ingested for company_id.
    Returns (is_duplicate, existing_job_id_or_none).
    """
    engine = get_db_engine()
    query = text("""
        SELECT ij.id 
        FROM import_files f
        JOIN import_jobs ij ON f.import_job_id = ij.id
        WHERE ij.company_id = :cid 
          AND f.checksum = :hash 
          AND ij.deleted_at IS NULL
        LIMIT 1
    """)
    with engine.connect() as conn:
        row = conn.execute(query, {"cid": str(company_id), "hash": content_hash}).fetchone()
        if row:
            existing_job_id = str(row[0])
            logger.info(f"Duplicate ingestion detected for company {company_id}: hash={content_hash[:8]}... job={existing_job_id}")
            return True, existing_job_id

    return False, None
