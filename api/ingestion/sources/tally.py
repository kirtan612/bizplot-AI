"""
BizPilot AI - Tally Connector Abstraction.
Provides Tally XML/Excel import interface and DEVELOPMENT CONNECTOR adapter.
"""

from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.sources.excel import ExcelIngestionSource


class TallySource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.TALLY)
        self.excel_source = ExcelIngestionSource()

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        if filename.lower().endswith(('.xlsx', '.xls')):
            return self.excel_source.validate(content, filename)
        if not content:
            return False, "Tally payload is empty."
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        if filename.lower().endswith(('.xlsx', '.xls')):
            meta = self.excel_source.ingest(content, filename)
        else:
            meta = {"record_count": 0, "status": "COMPLETED"}

        meta["source_type"] = self.source_type.value
        meta["connector_mode"] = "DEVELOPMENT CONNECTOR"
        meta["tally_integration"] = "XML_EXCEL_IMPORT"
        return meta
