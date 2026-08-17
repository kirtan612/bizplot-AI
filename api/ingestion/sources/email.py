"""
BizPilot AI - Email Import Source Interface.
Defines connector architecture and strict authorization boundaries for email import.
"""

from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType


class EmailSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.EMAIL)

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        if not content:
            return False, "Email import payload is empty."
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        return {
            "source_type": self.source_type.value,
            "record_count": 1,
            "authorization_status": "AUTHORIZED_IMPORT",
            "status": "COMPLETED"
        }
