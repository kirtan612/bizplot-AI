"""
BizPilot AI - PDF Ingestion Source Processor.
Extracts PDF page count, metadata, and inspects text extractability.
Flags scanned PDFs with OCR_REQUIRED status if text extraction produces minimal output.
"""

import io
from typing import Tuple, Dict, Any
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType
from api.ingestion.validators.file_validator import validate_file_type

try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


class PDFIngestionSource(BaseIngestionSource):
    def __init__(self):
        super().__init__(IngestionSourceType.PDF)

    def validate(self, content: bytes, filename: str) -> Tuple[bool, str]:
        valid, msg, _ = validate_file_type(filename, content)
        if not valid:
            return False, msg
        if not HAS_PYPDF:
            # Fallback signature check if pypdf is not installed
            if not content.startswith(b"%PDF"):
                return False, "Invalid PDF header signature."
            return True, ""

        try:
            reader = pypdf.PdfReader(io.BytesIO(content))
            if len(reader.pages) == 0:
                return False, "PDF contains 0 pages."
        except Exception as e:
            return False, f"Failed to parse PDF document: {str(e)}"

        return True, ""

    def ingest(self, content: bytes, filename: str) -> Dict[str, Any]:
        num_pages = 0
        extracted_text = ""
        is_scanned = False

        if HAS_PYPDF:
            try:
                reader = pypdf.PdfReader(io.BytesIO(content))
                num_pages = len(reader.pages)
                page_texts = []
                for p in reader.pages:
                    txt = p.extract_text() or ""
                    page_texts.append(txt)

                full_text = "\n".join(page_texts).strip()
                extracted_text = full_text[:1000]  # Store preview snippet
                avg_chars_per_page = len(full_text) / max(1, num_pages)
                if avg_chars_per_page < 10:
                    is_scanned = True
            except Exception:
                is_scanned = True
        else:
            num_pages = 1

        status = "OCR_REQUIRED" if is_scanned else "COMPLETED"

        return {
            "source_type": self.source_type.value,
            "num_pages": num_pages,
            "record_count": num_pages,
            "text_extracted": not is_scanned,
            "text_preview": extracted_text[:200] if not is_scanned else "",
            "status": status
        }
