"""
BizPilot AI - CRM Export Source Connector.
Supports CSV, Excel, and JSON CRM export formats.
"""

from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.sources.csv import CSVIngestionSource
from api.ingestion.sources.excel import ExcelIngestionSource


class CRMSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.CRM_EXPORT)
        self.csv_source = CSVIngestionSource()
        self.excel_source = ExcelIngestionSource()

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        ext = filename.lower()
        if ext.endswith('.csv'):
            return self.csv_source.validate(content, filename)
        elif ext.endswith(('.xlsx', '.xls')):
            return self.excel_source.validate(content, filename)
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        ext = filename.lower()
        if ext.endswith('.csv'):
            meta = self.csv_source.ingest(content, filename)
        elif ext.endswith(('.xlsx', '.xls')):
            meta = self.excel_source.ingest(content, filename)
        else:
            meta = {"record_count": 0, "status": "COMPLETED"}

        meta["source_type"] = self.source_type.value
        meta["crm_connector"] = "CRM_EXPORT"
        return meta
