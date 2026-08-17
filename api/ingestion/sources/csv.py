"""
BizPilot AI - CSV Ingestion Source Processor.
Inspects CSV files with encoding detection, header detection, row count, column count, and malformed row detection.
"""

import io
import csv
from typing import Tuple, Dict, Any, List
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType, IngestionSheetMetadata
from api.ingestion.validators.file_validator import validate_file_type


class CSVIngestionSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.CSV)

    def _detect_encoding(self, content: bytes) -> str:
        """Detect encoding (utf-8, latin1, utf-8-sig)."""
        for enc in ['utf-8', 'utf-8-sig', 'latin1', 'cp1252']:
            try:
                content.decode(enc)
                return enc
            except UnicodeDecodeError:
                continue
        return 'latin1'

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        valid, msg, _ = validate_file_type(filename, content)
        if not valid:
            return False, msg
        encoding = self._detect_encoding(content)
        try:
            text_data = content.decode(encoding)
            reader = csv.reader(io.StringIO(text_data))
            first_row = next(reader, None)
            if first_row is None:
                return False, "CSV file is empty."
        except Exception as e:
            return False, f"Failed to parse CSV file: {str(e)}"
        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        encoding = self._detect_encoding(content)
        text_data = content.decode(encoding, errors='ignore')
        reader = list(csv.reader(io.StringIO(text_data)))

        if not reader:
            return {
                "source_type": self.source_type.value,
                "sheets": [],
                "record_count": 0,
                "status": "COMPLETED",
                "encoding": encoding
            }

        headers = [str(h) for h in reader[0]]
        num_cols = len(headers)
        data_rows = reader[1:]
        num_rows = len(data_rows)

        # Basic malformed check
        malformed_count = sum(1 for row in data_rows if len(row) != num_cols)

        sheet = IngestionSheetMetadata(
            name="CSV_Data",
            rows=num_rows,
            columns=num_cols,
            headers=headers[:20]
        ).model_dump()

        return {
            "source_type": self.source_type.value,
            "sheets": [sheet],
            "record_count": num_rows,
            "encoding": encoding,
            "malformed_rows": malformed_count,
            "status": "COMPLETED"
        }
