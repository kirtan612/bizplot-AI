"""
BizPilot AI - Ingestion Source Registry.
Central lookup registry for all enterprise data sources.
"""

from typing import Dict, Optional, List
from api.ingestion.base import BaseIngestionSource
from api.ingestion.schemas import IngestionSourceType, ConnectorStatusInfo
from api.ingestion.sources.excel import ExcelIngestionSource
from api.ingestion.sources.csv import CSVIngestionSource
from api.ingestion.sources.pdf import PDFIngestionSource
from api.ingestion.sources.bank import BankStatementSource
from api.ingestion.sources.crm import CRMSource
from api.ingestion.sources.email import EmailSource
from api.ingestion.sources.erp import ERPSource
from api.ingestion.sources.tally import TallySource
from api.ingestion.sources.gst import GSTSource


class IngestionSourceRegistry:
    """Registry managing enterprise source processors."""

    def __init__(self):
        self._sources: Dict[IngestionSourceType, BaseIngestionSource] = {
            IngestionSourceType.EXCEL: ExcelIngestionSource(),
            IngestionSourceType.CSV: CSVIngestionSource(),
            IngestionSourceType.PDF: PDFIngestionSource(),
            IngestionSourceType.BANK_STATEMENT: BankStatementSource(),
            IngestionSourceType.CRM_EXPORT: CRMSource(),
            IngestionSourceType.EMAIL: EmailSource(),
            IngestionSourceType.ERP: ERPSource(),
            IngestionSourceType.TALLY: TallySource(),
            IngestionSourceType.GST: GSTSource(),
            IngestionSourceType.FILE_UPLOAD: ExcelIngestionSource(),
        }

    def get_source(self, source_type: IngestionSourceType) -> BaseIngestionSource:
        """Retrieves source processor instance for given type."""
        source = self._sources.get(source_type)
        if not source:
            # Default to Excel if unknown
            return self._sources[IngestionSourceType.EXCEL]
        return source

    def detect_source_type(self, filename: str) -> IngestionSourceType:
        """Infers initial source type from filename extension or pattern."""
        lower = filename.lower()
        if "bank" in lower or "statement" in lower:
            return IngestionSourceType.BANK_STATEMENT
        elif "gst" in lower or "gstr" in lower:
            return IngestionSourceType.GST
        elif "tally" in lower:
            return IngestionSourceType.TALLY
        elif "crm" in lower:
            return IngestionSourceType.CRM_EXPORT
        elif lower.endswith(('.xlsx', '.xls')):
            return IngestionSourceType.EXCEL
        elif lower.endswith('.csv'):
            return IngestionSourceType.CSV
        elif lower.endswith('.pdf'):
            return IngestionSourceType.PDF
        return IngestionSourceType.FILE_UPLOAD

    def get_connector_catalog(self) -> List[ConnectorStatusInfo]:
        """Returns enterprise connector status catalog."""
        return [
            ConnectorStatusInfo(
                id="excel_csv",
                name="Excel & CSV Data Import",
                category="Files & Documents",
                source_type=IngestionSourceType.EXCEL,
                status="CONNECTED",
                description="Direct file import for Excel (.xlsx, .xls) and CSV sales, inventory, and ledger files.",
                is_live=True
            ),
            ConnectorStatusInfo(
                id="pdf_documents",
                name="PDF Invoices & Documents",
                category="Files & Documents",
                source_type=IngestionSourceType.PDF,
                status="CONNECTED",
                description="Secure PDF document text extraction and scanned document OCR detection.",
                is_live=True
            ),
            ConnectorStatusInfo(
                id="bank_statements",
                name="Bank Statement Ingestion",
                category="Banking & Treasury",
                source_type=IngestionSourceType.BANK_STATEMENT,
                status="CONNECTED",
                description="Ingest bank statement feeds (CSV, Excel, PDF) with debit/credit balance detection.",
                is_live=True
            ),
            ConnectorStatusInfo(
                id="gst_tax",
                name="GST / Tax Compliance Portal",
                category="Government & Tax",
                source_type=IngestionSourceType.GST,
                status="DEVELOPMENT CONNECTOR",
                description="File-import pathway for GSTR-1, GSTR-3B, ITC, and E-way bill records.",
                is_live=False
            ),
            ConnectorStatusInfo(
                id="tally_erp",
                name="Tally Prime / ERP Connector",
                category="Accounting & ERP",
                source_type=IngestionSourceType.TALLY,
                status="DEVELOPMENT CONNECTOR",
                description="Tally XML / Excel ledger export connector abstraction.",
                is_live=False
            ),
            ConnectorStatusInfo(
                id="crm_export",
                name="CRM Leads & Customers",
                category="Sales & Marketing",
                source_type=IngestionSourceType.CRM_EXPORT,
                status="AVAILABLE",
                description="Import customer distributor relationships, lead history, and sales pipelines.",
                is_live=True
            ),
            ConnectorStatusInfo(
                id="email_import",
                name="Email Communications Feed",
                category="Communications",
                source_type=IngestionSourceType.EMAIL,
                status="COMING SOON",
                description="OAuth-authorized mailbox ingestion for distributor invoice confirmation emails.",
                is_live=False
            ),
        ]


registry = IngestionSourceRegistry()
