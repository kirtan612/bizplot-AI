"""
BizPilot AI - Data Type Normalization Engine.
Normalizes Dates, Currency, Numbers, Percentages, Booleans, and Text string tokens.
"""

import re
from datetime import datetime, date
from typing import Tuple, Optional, Any


def normalize_date(val: Any) -> Tuple[Optional[date], str]:
    """
    Normalizes date representations (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, DD-MMM-YYYY).
    Returns (normalized_date, status_or_format).
    """
    if val is None or val == "" or str(val).lower() in ("nan", "none", "null"):
        return None, "EMPTY"

    if isinstance(val, (datetime, date)):
        return (val.date() if isinstance(val, datetime) else val), "VALID"

    val_str = str(val).strip()

    # Common Format Patterns
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%Y/%m/%d",
        "%d-%m-%Y",
        "%d-%b-%Y",
        "%d-%B-%Y",
        "%Y-%m-%d %H:%M:%S",
        "%d/%m/%Y %H:%M:%S",
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(val_str, fmt)
            return dt.date(), "VALID"
        except ValueError:
            continue

    # Try ISO format
    try:
        dt = datetime.fromisoformat(val_str.replace("Z", ""))
        return dt.date(), "VALID"
    except Exception:
        pass

    return None, "REQUIRES_REVIEW"


def normalize_currency_amount(val: Any) -> Tuple[float, str, str]:
    """
    Normalizes currency representations (₹1,25,000, Rs. 5000, 125000.00, $1000).
    Returns (normalized_float_amount, currency_iso, quality_state).
    """
    if val is None or val == "" or str(val).lower() in ("nan", "none", "null"):
        return 0.0, "INR", "VALID"

    val_str = str(val).strip()
    currency = "INR"

    # Detect currency prefix/suffix
    if "$" in val_str or "USD" in val_str.upper():
        currency = "USD"
    elif "€" in val_str or "EUR" in val_str.upper():
        currency = "EUR"
    elif "£" in val_str or "GBP" in val_str.upper():
        currency = "GBP"

    # Clean non-numeric characters except minus and decimal point
    cleaned = re.sub(r"[^\d.-]", "", val_str)

    # Handle multiple minus signs or trailing minus
    if cleaned.count("-") > 1:
        cleaned = "-" + cleaned.replace("-", "")

    try:
        amount = float(cleaned) if cleaned else 0.0
        return round(amount, 2), currency, "VALID"
    except ValueError:
        return 0.0, currency, "INVALID"


def normalize_number(val: Any, is_integer: bool = False) -> Tuple[Any, str]:
    """Normalizes numeric values (handles Indian commas 1,25,000)."""
    if val is None or val == "" or str(val).lower() in ("nan", "none", "null"):
        return (0 if is_integer else 0.0), "VALID"

    val_str = str(val).strip().replace(",", "")
    try:
        if is_integer:
            return int(float(val_str)), "VALID"
        else:
            return float(val_str), "VALID"
    except ValueError:
        return (0 if is_integer else 0.0), "INVALID"


def normalize_percentage(val: Any) -> Tuple[float, str]:
    """Normalizes percentage strings (18% -> 0.18, 0.18 -> 0.18)."""
    if val is None or val == "" or str(val).lower() in ("nan", "none", "null"):
        return 0.0, "VALID"

    val_str = str(val).strip()
    has_percent = "%" in val_str
    cleaned = re.sub(r"[^\d.-]", "", val_str)

    try:
        num = float(cleaned) if cleaned else 0.0
        if has_percent or num > 1.0:
            return round(num / 100.0, 4), "VALID"
        return round(num, 4), "VALID"
    except ValueError:
        return 0.0, "INVALID"


def normalize_text(val: Any, default: str = "") -> str:
    """Normalizes text strings (strip whitespace, clean special chars)."""
    if val is None or str(val).lower() in ("nan", "none", "null"):
        return default
    return str(val).strip()
