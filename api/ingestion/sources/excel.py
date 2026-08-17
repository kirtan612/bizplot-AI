"""
BizPilot AI - Excel Ingestion Source Processor.
Reads Excel workbooks (.xlsx, .xls), inspects sheet names, row/column counts, and headers.
"""

import io
import pandas as pd
from typing import Tuple, Dict, Any, List
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType, IngestionSheetMetadata
from api.ingestion.validators.file_validator import validate_file_type


class ExcelIngestionSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.EXCEL)

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        valid, msg, _ = validate_file_type(filename, content)
        if not valid:
            return False, msg
        try:
            excel_file = pd.ExcelFile(io.BytesIO(content))
            if not excel_file.sheet_names:
                return False, "Excel workbook contains no sheets."
        except Exception as e:
            return False, f"Failed to parse Excel workbook: {str(e)}"
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        excel_file = pd.ExcelFile(io.BytesIO(content))
        sheets_info: List[Dict[str, Any]] = []
        total_rows = 0

        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            rows = len(df)
            cols = len(df.columns)
            headers = [str(c) for c in df.columns[:20]]
            total_rows += rows

            sheets_info.append(IngestionSheetMetadata(
                name=sheet_name,
                rows=rows,
                columns=cols,
                headers=headers
            ).model_dump())

        return {
            "source_type": self.source_type.value,
            "sheets": sheets_info,
            "total_sheets": len(sheets_info),
            "record_count": total_rows,
            "status": "COMPLETED"
        }
