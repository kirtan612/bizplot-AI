"""
BizPilot AI - Enterprise Audit Logger & Log Redaction System.
Records security and data events with automatic redaction of sensitive credentials.
"""

from uuid import UUID
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from src.db.models.audit import AuditLog

SENSITIVE_KEYS = {
    "password", "password_hash", "jwt", "token", "access_token",
    "refresh_token", "secret", "secret_key", "authorization",
    "credit_card", "cvv", "bank_account_number"
}


def redact_sensitive_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively redacts sensitive keys in metadata dictionaries."""
    if not isinstance(data, dict):
        return data

    redacted = {}
    for k, v in data.items():
        if k.lower() in SENSITIVE_KEYS:
            redacted[k] = "[REDACTED]"
        elif isinstance(v, dict):
            redacted[k] = redact_sensitive_dict(v)
        elif isinstance(v, list):
            redacted[k] = [redact_sensitive_dict(item) if isinstance(item, dict) else item for item in v]
        else:
            redacted[k] = v
    return redacted


def log_audit_event(
    db: Session,
    company_id: Optional[UUID],
    user_id: Optional[UUID],
    username: Optional[str],
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    status: str = "SUCCESS",
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> AuditLog:
    """
    Creates and persists a sanitized security audit record.
    Redacts sensitive fields before saving.
    """
    clean_metadata = redact_sensitive_dict(metadata or {})
    audit_entry = AuditLog(
        company_id=company_id,
        user_id=user_id,
        username=username,
        action=action.upper(),
        resource_type=resource_type.upper(),
        resource_id=str(resource_id) if resource_id else None,
        status=status.upper(),
        ip_address=ip_address,
        user_agent=user_agent,
        metadata_json=clean_metadata,
        timestamp=datetime.utcnow()
    )
    db.add(audit_entry)
    try:
        db.commit()
    except Exception:
        db.rollback()
    return audit_entry
