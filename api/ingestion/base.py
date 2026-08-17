"""
BizPilot AI - Base Ingestion Source Abstract Contract.
Defines standard interface for all enterprise ingestion sources (Excel, CSV, PDF, Bank, CRM, Email, ERP, Tally, GST).
"""

from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any
from api.ingestion.schemas import IngestionSourceType


class BaseIngestionSource(ABC):
    """Abstract base class for all enterprise ingestion sources in BizPilot AI."""

    def __init__(self, source_type: IngestionSourceType):
        self.source_type = source_type

    @abstractmethod
    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        """Validate raw bytes, structure, signature, and encoding for source."""
        pass

    @abstractmethod
    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        """
        Extract raw metadata (sheets, row count, column count, text status) without canonical normalization.
        Returns metadata dict.
        """
        pass
