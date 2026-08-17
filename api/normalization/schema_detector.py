"""
BizPilot AI - Raw Data Schema & Entity Type Detector.
Inspects raw headers and data structures to determine canonical entity type.
"""

from typing import List, Dict, Tuple, Any
from api.normalization.column_aliases import find_canonical_field


def detect_entity_schema(headers: List[str]) -> Tuple[str, Dict[str, str], float]:
    """
    Detects canonical entity type from list of headers.
    Returns (target_entity_type, field_mapping_dict, confidence_score).
    """
    canonical_mapped = {}
    for hdr in headers:
        field = find_canonical_field(hdr)
        if field:
            canonical_mapped[hdr] = field

    mapped_fields = set(canonical_mapped.values())

    # Decision Matrix
    if "invoice_number" in mapped_fields and ("customer_name" in mapped_fields or "supplier_name" in mapped_fields):
        confidence = 0.95 if "amount" in mapped_fields else 0.85
        return "Invoice", canonical_mapped, confidence

    if "order_number" in mapped_fields and ("customer_name" in mapped_fields or "amount" in mapped_fields):
        return "Order", canonical_mapped, 0.90

    if "customer_name" in mapped_fields and ("email" in mapped_fields or "phone" in mapped_fields or "gstin" in mapped_fields):
        return "Customer", canonical_mapped, 0.90

    if "supplier_name" in mapped_fields and ("gstin" in mapped_fields or "phone" in mapped_fields):
        return "Supplier", canonical_mapped, 0.90

    if "sku" in mapped_fields or "product_name" in mapped_fields:
        return "Product", canonical_mapped, 0.85

    if "amount" in mapped_fields and ("date" in mapped_fields or "invoice_number" in mapped_fields):
        return "Invoice", canonical_mapped, 0.75

    # Fallback to Invoice / General Document
    return "Invoice", canonical_mapped, 0.50
