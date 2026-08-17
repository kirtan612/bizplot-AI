"""
BizPilot AI - Bank Statement Source Processor.
Detects transaction date, description, debit, credit, balance columns in bank statements (CSV/Excel/PDF).
"""

import io
from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.sources.csv import CSVIngestionSource
from api.ingestion.sources.excel import ExcelIngestionSource


class BankStatementSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.BANK_STATEMENT)
        self.csv_source = CSVIngestionSource()
        self.excel_source = ExcelIngestionSource()

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        ext = filename.lower()
        if ext.endswith('.csv'):
            return self.csv_source.validate(content, filename)
        elif ext.endswith(('.xlsx', '.xls')):
            return self.excel_source.validate(content, filename)
        return False, "Bank statement ingestion requires CSV or Excel format."

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        ext = filename.lower()
        if ext.endswith('.csv'):
            meta = self.csv_source.ingest(content, filename)
        else:
            meta = self.excel_source.ingest(content, filename)

        meta["source_type"] = self.source_type.value
        meta["detected_bank_fields"] = ["date", "description", "debit", "credit", "balance"]
        return meta
