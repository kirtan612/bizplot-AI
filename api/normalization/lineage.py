"""
BizPilot AI - Source Lineage Tracking Helper.
Records exact audit trace connecting Canonical Business Record -> Ingestion Job -> Raw File.
"""

from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from src.db.models.canonical import SourceLineage


def record_lineage(
    session: Session,
    company_id: UUID,
    entity_type: str,
    entity_id: UUID,
    source_type: str,
    source_record_id: str,
    ingestion_id: str,
    content_hash: Optional[str] = None
) -> SourceLineage:
    """Records source lineage entry in database."""
    lineage = SourceLineage(
        company_id=company_id,
        entity_type=entity_type,
        entity_id=entity_id,
        source_type=source_type,
        source_record_id=str(source_record_id),
        ingestion_id=str(ingestion_id),
        content_hash=content_hash
    )
    session.add(lineage)
    return lineage
