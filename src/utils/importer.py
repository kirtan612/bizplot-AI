"""
Data Import Utility Helpers for BizPilot AI.
Handles CSV parsing, checksum calculation, Pydantic schema validation,
foreign key verification, and idempotent database upserts.
"""

import ast
import hashlib
from typing import Any, Dict, List, Optional, Tuple, Type, Set
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel, ValidationError

from sqlalchemy.orm import Session


def calculate_checksum(file_path: str) -> str:
    """Calculate SHA-256 checksum of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def parse_csv_row(row_dict: Dict[str, str]) -> Dict[str, Any]:
    """
    Clean and parse a CSV row dictionary for Pydantic schema validation.
    Handles stringified Python lists, empty string coercion to None, and boolean conversion.
    """
    cleaned: Dict[str, Any] = {}
    for key, raw_val in row_dict.items():
        if raw_val is None:
            cleaned[key] = None
            continue
        
        val = raw_val.strip()
        if val == "":
            cleaned[key] = None
            continue
        
        # Handle stringified Python lists, e.g. "['APL Apollo']" or "['GI', 'MS']"
        if val.startswith("[") and val.endswith("]"):
            try:
                cleaned[key] = ast.literal_eval(val)
                continue
            except (ValueError, SyntaxError):
                pass
        
        # Handle boolean strings if exact match
        if val.lower() == "true":
            cleaned[key] = True
            continue
        elif val.lower() == "false":
            cleaned[key] = False
            continue
        
        cleaned[key] = val
        
    return cleaned


def validate_row_schema(
    schema_cls: Type[BaseModel],
    row_dict: Dict[str, Any]
) -> Tuple[Optional[BaseModel], Optional[str]]:
    """
    Validate a cleaned row dictionary against a Pydantic schema class.
    Returns (validated_model, None) on success, or (None, formatted_error_str) on failure.
    """
    try:
        model_instance = schema_cls(**row_dict)
        return model_instance, None
    except ValidationError as ve:
        error_msgs = []
        for err in ve.errors():
            loc_str = " -> ".join(str(l) for l in err.get("loc", []))
            msg = err.get("msg", "invalid value")
            error_msgs.append(f"Field '{loc_str}': {msg}")
        return None, "; ".join(error_msgs)


def verify_foreign_keys(
    filename: str,
    parsed_model: BaseModel,
    fk_cache: Dict[str, Set[str]]
) -> Tuple[bool, Optional[str]]:
    """
    Validate that foreign keys referenced in parsed_model exist in the DB (via fk_cache).
    Returns (True, None) if valid, or (False, error_message) if an FK reference is missing.
    """
    fn = filename.lower()

    # Price History FKs
    if "price_history" in fn or "06_price_history" in fn:
        prod_id = str(getattr(parsed_model, "product_id", ""))
        if prod_id and prod_id not in fk_cache.get("products", set()):
            return False, f"FK Violation: product_id '{prod_id}' does not exist in products"
        
        idx_id = getattr(parsed_model, "index_id", None)
        if idx_id and str(idx_id) not in fk_cache.get("steel_index", set()):
            return False, f"FK Violation: index_id '{idx_id}' does not exist in steel_index"

    # Purchase Register FKs
    elif "purchase" in fn or "07_purchase" in fn:
        supp_id = str(getattr(parsed_model, "supplier_id", ""))
        if supp_id and supp_id not in fk_cache.get("suppliers", set()):
            return False, f"FK Violation: supplier_id '{supp_id}' does not exist in suppliers"
        
        prod_id = str(getattr(parsed_model, "product_id", ""))
        if prod_id and prod_id not in fk_cache.get("products", set()):
            return False, f"FK Violation: product_id '{prod_id}' does not exist in products"

    # Inventory Snapshot FKs
    elif "inventory" in fn or "08_inventory" in fn:
        prod_id = str(getattr(parsed_model, "product_id", ""))
        if prod_id and prod_id not in fk_cache.get("products", set()):
            return False, f"FK Violation: product_id '{prod_id}' does not exist in products"

    # Sales Register FKs
    elif "sales" in fn or "09_sales" in fn:
        cust_id = str(getattr(parsed_model, "customer_id", ""))
        if cust_id and cust_id not in fk_cache.get("customers", set()):
            return False, f"FK Violation: customer_id '{cust_id}' does not exist in customers"
        
        prod_id = str(getattr(parsed_model, "product_id", ""))
        if prod_id and prod_id not in fk_cache.get("products", set()):
            return False, f"FK Violation: product_id '{prod_id}' does not exist in products"

    # Cashbook FKs
    elif "cashbook" in fn or "10_cashbook" in fn:
        party_id = getattr(parsed_model, "party_id", None)
        if party_id:
            pid_str = str(party_id)
            custs = fk_cache.get("customers", set())
            supps = fk_cache.get("suppliers", set())
            if pid_str not in custs and pid_str not in supps:
                return False, f"FK Violation: party_id '{pid_str}' does not exist in customers or suppliers"

    return True, None


def _normalize_value_for_compare(val: Any) -> Any:
    """Normalize types (Decimal -> float, UUID -> str, Enum -> str, Date -> date) for value comparison."""
    if val is None:
        return None
    if isinstance(val, Decimal):
        return float(val)
    if isinstance(val, (UUID, date, datetime)):
        return str(val)
    if hasattr(val, "value"):  # Enum
        return val.value
    if isinstance(val, list):
        return [str(x) for x in val]
    return val


def prepare_model_dict(
    parsed_model: BaseModel,
    company_id: UUID,
    pk_column_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Convert Pydantic parsed model to a dictionary suitable for SQLAlchemy model initialization.
    Replaces model PK attribute (e.g. product_id -> id) and sets company_id.
    """
    model_data = parsed_model.model_dump()
    model_data["company_id"] = company_id
    
    if pk_column_name and pk_column_name in model_data:
        pk_val = model_data.pop(pk_column_name)
        if pk_val:
            model_data["id"] = pk_val if isinstance(pk_val, UUID) else UUID(str(pk_val))

    return model_data


def upsert_record(
    session: Session,
    model_cls: Type[Any],
    natural_key: Any,
    model_data: Dict[str, Any],
    existing_records_cache: Dict[Tuple, Any]
) -> str:
    """
    Perform idempotent upsert logic:
    - Insert: If natural key not in existing_records_cache.
    - Update: If natural key exists and any non-key attribute changed.
    - Skip: If natural key exists and all attributes match.
    
    Returns status: 'inserted', 'updated', or 'skipped'.
    """
    if isinstance(natural_key, tuple):
        key_tuple = natural_key
    elif isinstance(natural_key, dict):
        key_tuple = tuple(natural_key.values())
    else:
        key_tuple = (natural_key,)

    existing_obj = existing_records_cache.get(key_tuple)

    if existing_obj is None:
        new_obj = model_cls(**model_data)
        session.add(new_obj)
        existing_records_cache[key_tuple] = new_obj
        return "inserted"
    
    # Check if any attribute has changed
    has_changed = False
    for attr, new_val in model_data.items():
        if attr in ("id", "created_at", "updated_at", "company_id"):
            continue
        
        if not hasattr(existing_obj, attr):
            continue

        old_val = getattr(existing_obj, attr)
        norm_old = _normalize_value_for_compare(old_val)
        norm_new = _normalize_value_for_compare(new_val)

        if norm_old != norm_new:
            setattr(existing_obj, attr, new_val)
            has_changed = True

    if has_changed:
        return "updated"
    else:
        return "skipped"
