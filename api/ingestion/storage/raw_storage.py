"""
BizPilot AI - Raw Storage Abstraction Layer.
Manages secure organization-isolated raw file storage with path traversal protection.
"""

import os
import re
import shutil
import logging
from pathlib import Path
from uuid import UUID
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

# Base storage directory (configurable via env)
STORAGE_BASE_DIR = Path(os.getenv("RAW_STORAGE_DIR", "storage/raw")).resolve()


def sanitize_filename(filename: str) -> str:
    """Sanitize user-provided filename to protect against path traversal."""
    filename = os.path.basename(filename)
    filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    if not filename or filename in ('.', '..'):
        filename = "ingested_file.bin"
    return filename


class RawStorage:
    """Organization-isolated raw file storage manager."""

    def __init__(self, base_dir: Path = STORAGE_BASE_DIR):
        self.base_dir = base_dir.resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def get_organization_dir(self, company_id: UUID) -> Path:
        """Returns isolated directory path for an organization."""
        org_dir = (self.base_dir / str(company_id)).resolve()
        # Verify no path traversal outside base_dir
        if not str(org_dir).startswith(str(self.base_dir)):
            raise ValueError("Path traversal attempt detected.")
        org_dir.mkdir(parents=True, exist_ok=True)
        return org_dir

    def get_ingestion_dir(self, company_id: UUID, ingestion_id: str) -> Path:
        """Returns isolated directory path for a specific ingestion job."""
        org_dir = self.get_organization_dir(company_id)
        ing_dir = (org_dir / str(ingestion_id)).resolve()
        if not str(ing_dir).startswith(str(org_dir)):
            raise ValueError("Path traversal attempt detected in ingestion_id.")
        ing_dir.mkdir(parents=True, exist_ok=True)
        return ing_dir

    def store(self, company_id: UUID, ingestion_id: str, filename: str, content: bytes) -> Tuple[str, str]:
        """
        Securely stores raw bytes under storage/raw/{company_id}/{ingestion_id}/{safe_filename}.
        Returns (relative_storage_path, safe_filename).
        """
        safe_name = sanitize_filename(filename)
        ing_dir = self.get_ingestion_dir(company_id, ingestion_id)
        file_path = (ing_dir / safe_name).resolve()

        if not str(file_path).startswith(str(ing_dir)):
            raise ValueError("Path traversal attempt detected in filename.")

        with open(file_path, "wb") as f:
            f.write(content)

        rel_path = file_path.relative_to(self.base_dir).as_posix()
        logger.info(f"Raw storage saved: {rel_path} ({len(content)} bytes)")
        return rel_path, safe_name

    def retrieve(self, company_id: UUID, ingestion_id: str, safe_filename: str) -> bytes:
        """Retrieves raw content bytes for an organization file."""
        safe_name = sanitize_filename(safe_filename)
        ing_dir = self.get_ingestion_dir(company_id, ingestion_id)
        file_path = (ing_dir / safe_name).resolve()

        if not file_path.exists() or not str(file_path).startswith(str(ing_dir)):
            raise FileNotFoundError(f"File not found or access denied for company {company_id}")

        with open(file_path, "rb") as f:
            return f.read()

    def delete(self, company_id: UUID, ingestion_id: str) -> bool:
        """Deletes raw storage folder for an ingestion job."""
        try:
            ing_dir = self.get_ingestion_dir(company_id, ingestion_id)
            if ing_dir.exists():
                shutil.rmtree(ing_dir)
                return True
        except Exception as e:
            logger.error(f"Error deleting raw storage for job {ingestion_id}: {e}")
        return False

    def exists(self, company_id: UUID, ingestion_id: str) -> bool:
        """Checks if raw storage directory exists for job."""
        org_dir = self.get_organization_dir(company_id)
        ing_dir = (org_dir / str(ingestion_id)).resolve()
        return ing_dir.exists() and str(ing_dir).startswith(str(org_dir))
