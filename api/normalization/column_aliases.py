"""
BizPilot AI - Controlled Column Aliases Mapping Catalog.
Provides deterministic mappings for column headers across Excel, CSV, CRM, Tally, and ERP exports.
"""

from typing import Dict, List, Optional

COLUMN_ALIASES: Dict[str, List[str]] = {
    "customer_name": [
        "customer_name", "customer", "client", "client_name", "party_name",
        "party", "account_name", "buyer_name", "debtor_name"
    ],
    "supplier_name": [
        "supplier_name", "supplier", "vendor", "vendor_name", "seller_name",
        "creditor_name", "party_supplier"
    ],
    "invoice_number": [
        "invoice_number", "invoice_no", "inv_no", "bill_no", "bill_number",
        "invoice_id", "voucher_no", "document_no"
    ],
    "order_number": [
        "order_number", "order_no", "order_id", "po_no", "po_number",
        "so_no", "so_number", "order_ref"
    ],
    "date": [
        "date", "invoice_date", "order_date", "txn_date", "transaction_date",
        "sales_date", "purchase_date", "entry_date", "doc_date"
    ],
    "amount": [
        "amount", "total", "total_amount", "invoice_amount", "grand_total",
        "net_amount", "taxable_value", "subtotal", "val"
    ],
    "sku": [
        "sku", "product_code", "item_code", "part_no", "product_sku",
        "item_sku", "material_code"
    ],
    "product_name": [
        "product_name", "product", "item_name", "item_description",
        "description", "particulars"
    ],
    "quantity": [
        "quantity", "qty", "quantity_pcs", "pieces", "count", "units"
    ],
    "unit_price": [
        "unit_price", "price", "rate", "unit_rate", "rate_per_kg", "price_per_unit"
    ],
    "gstin": [
        "gstin", "gst_no", "gst_number", "gst_id", "tax_id"
    ],
    "email": [
        "email", "contact_email", "email_address", "client_email"
    ],
    "phone": [
        "phone", "mobile", "contact_phone", "phone_number", "telephone"
    ],
    "city": [
        "city", "town", "location"
    ],
    "state": [
        "state", "province", "region"
    ]
}


def find_canonical_field(header_name: str) -> Optional[str]:
    """Finds matching canonical field for a raw header string."""
    clean_hdr = header_name.strip().lower().replace(" ", "_").replace(".", "").replace("-", "_")
    for canonical_field, aliases in COLUMN_ALIASES.items():
        if clean_hdr in aliases:
            return canonical_field
    return None
