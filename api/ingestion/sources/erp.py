"""
BizPilot AI - ERP Connector Abstraction.
Provides ERP API/Export interface and DEVELOPMENT CONNECTOR adapter.
"""

from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.sources.excel import ExcelIngestionSource


class ERPSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.ERP)
        self.excel_source = ExcelIngestionSource()

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        if filename.lower().endswith(('.xlsx', '.xls')):
            return self.excel_source.validate(content, filename)
        if not content:
            return False, "ERP payload is empty."
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        if filename.lower().endswith(('.xlsx', '.xls')):
            meta = self.excel_source.ingest(content, filename)
        else:
            meta = {"record_count": 0, "status": "COMPLETED"}

        meta["source_type"] = self.source_type.value
        meta["connector_mode"] = "DEVELOPMENT CONNECTOR"
        meta["erp_system"] = "SAP/Oracle/Custom ERP Connector"
        return meta
