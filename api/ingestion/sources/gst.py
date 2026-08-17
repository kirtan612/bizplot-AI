"""
BizPilot AI - GST / Tax Source Connector Abstraction.
Handles GSTR-1, GSTR-3B, ITC, and E-way bill file import pathways.
"""

from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.sources.excel import ExcelIngestionSource
from api.ingestion.sources.csv import CSVIngestionSource


class GSTSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.GST)
        self.excel_source = ExcelIngestionSource()
        self.csv_source = CSVIngestionSource()

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        ext = filename.lower()
        if ext.endswith(('.xlsx', '.xls')):
            return self.excel_source.validate(content, filename)
        elif ext.endswith('.csv'):
            return self.csv_source.validate(content, filename)
        if not content:
            return False, "GST payload is empty."
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        ext = filename.lower()
        if ext.endswith(('.xlsx', '.xls')):
            meta = self.excel_source.ingest(content, filename)
        elif ext.endswith('.csv'):
            meta = self.csv_source.ingest(content, filename)
        else:
            meta = {"record_count": 0, "status": "COMPLETED"}

        meta["source_type"] = self.source_type.value
        meta["gst_categories"] = ["GSTR-1", "GSTR-3B", "ITC", "E-way bills"]
        meta["connector_mode"] = "DEVELOPMENT CONNECTOR"
        return meta
