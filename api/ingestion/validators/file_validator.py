"""
BizPilot AI - File Type & Signature Validation Service.
Validates file extension, MIME type, and magic signature byte patterns.
"""

import os
import logging
from typing import Tuple, List

logger = logging.getLogger(__name__)

# Allowed initial extension mappings
ALLOWED_EXTENSIONS = {
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".csv": "text/csv",
    ".pdf": "application/pdf",
    ".json": "application/json",
}

MAGIC_SIGNATURES = {
    "pdf": [b"%PDF"],
    "xlsx_zip": [b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08"],
    "xls": [b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"],
}


def validate_file_type(filename: str, content: bytes) -> Tuple[bool, str, str]:
    """
    Validates file extension, magic byte pattern, and determines source file category.
    Returns (is_valid, category_or_error, mime_type).
    """
    if not content or len(content) == 0:
        return False, "File is empty (0 bytes).", "application/octet-stream"

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension '{ext}'. Allowed extensions: {list(ALLOWED_EXTENSIONS.keys())}", "application/octet-stream"

    expected_mime = ALLOWED_EXTENSIONS[ext]

    # Validate Magic Signature Bytes
    if ext == ".pdf":
        if not any(content.startswith(sig) for sig in MAGIC_SIGNATURES["pdf"]):
            return False, "Invalid PDF file signature. File header does not match %PDF.", expected_mime
        return True, "PDF", expected_mime

    elif ext == ".xlsx":
        if not any(content.startswith(sig) for sig in MAGIC_SIGNATURES["xlsx_zip"]):
            return False, "Invalid Excel XLSX file signature. File is corrupted or misnamed.", expected_mime
        return True, "EXCEL", expected_mime

    elif ext == ".xls":
        if not any(content.startswith(sig) for sig in MAGIC_SIGNATURES["xls"]):
            return False, "Invalid Excel XLS file signature. File is corrupted or misnamed.", expected_mime
        return True, "EXCEL", expected_mime

    elif ext == ".csv":
        # Check that content is printable text/bytes
        try:
            sample = content[:4096].decode('utf-8', errors='ignore')
            if '\0' in sample:
                return False, "Invalid CSV file: contains null binary bytes.", expected_mime
        except Exception:
            pass
        return True, "CSV", expected_mime

    elif ext == ".json":
        return True, "JSON", expected_mime

    return True, "FILE_UPLOAD", expected_mime
