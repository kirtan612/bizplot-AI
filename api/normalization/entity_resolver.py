"""
BizPilot AI - Entity Resolution & Matching Engine.
Performs clean matching for Customers, Suppliers, and Products with confidence scoring.
Low confidence matches are routed to the Review Queue.
"""

import re
from typing import Optional, Dict, Any, Tuple
from sqlalchemy import text
from sqlalchemy.orm import Session
from src.db.models.master_data import Customer, Supplier, Product
from api.normalization.schemas import MatchingConfidence


def normalize_entity_name(name: str) -> str:
    """Normalizes company/entity names for comparison (strips legal suffixes)."""
    if not name:
        return ""
    clean = name.lower().strip()
    # Strip common legal suffixes
    clean = re.sub(r"\b(pvt|ltd|private|limited|corp|corporation|inc|co|llp|systems|infra|solutions)\b", "", clean)
    clean = re.sub(r"[^\w\s]", "", clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


def resolve_customer(
    session: Session,
    company_id: str,
    raw_name: str,
    raw_gstin: Optional[str] = None,
    raw_email: Optional[str] = None,
    raw_phone: Optional[str] = None
) -> Tuple[Optional[Customer], MatchingConfidence, float]:
    """
    Resolves a raw customer record against existing organization customers.
    Returns (Customer_or_None, MatchingConfidence, confidence_score).
    """
    if not raw_name:
        return None, MatchingConfidence.UNMATCHED, 0.0

    # 1. Match by GSTIN (HIGH CONFIDENCE)
    if raw_gstin and len(raw_gstin) >= 10:
        cust = session.query(Customer).filter(
            Customer.company_id == company_id,
            Customer.gstin == raw_gstin
        ).first()
        if cust:
            return cust, MatchingConfidence.HIGH_CONFIDENCE, 1.0

    # 2. Match by Email (HIGH CONFIDENCE)
    if raw_email and "@" in raw_email:
        cust = session.query(Customer).filter(
            Customer.company_id == company_id,
            Customer.contact_email == raw_email
        ).first()
        if cust:
            return cust, MatchingConfidence.HIGH_CONFIDENCE, 0.95

    # 3. Match by Normalized Name (MEDIUM / LOW CONFIDENCE)
    clean_target = normalize_entity_name(raw_name)
    all_custs = session.query(Customer).filter(Customer.company_id == company_id).all()

    for c in all_custs:
        c_clean = normalize_entity_name(c.customer_name)
        if c_clean == clean_target:
            return c, MatchingConfidence.HIGH_CONFIDENCE, 0.90
        elif c_clean in clean_target or clean_target in c_clean:
            if len(c_clean) > 3 and len(clean_target) > 3:
                return c, MatchingConfidence.MEDIUM_CONFIDENCE, 0.75

    return None, MatchingConfidence.UNMATCHED, 0.0


def resolve_supplier(
    session: Session,
    company_id: str,
    raw_name: str,
    raw_gstin: Optional[str] = None,
    raw_email: Optional[str] = None
) -> Tuple[Optional[Supplier], MatchingConfidence, float]:
    """Resolves a raw supplier record against existing organization suppliers."""
    if not raw_name:
        return None, MatchingConfidence.UNMATCHED, 0.0

    if raw_gstin and len(raw_gstin) >= 10:
        sup = session.query(Supplier).filter(
            Supplier.company_id == company_id,
            Supplier.gstin == raw_gstin
        ).first()
        if sup:
            return sup, MatchingConfidence.HIGH_CONFIDENCE, 1.0

    clean_target = normalize_entity_name(raw_name)
    all_sups = session.query(Supplier).filter(Supplier.company_id == company_id).all()

    for s in all_sups:
        s_clean = normalize_entity_name(s.supplier_name)
        if s_clean == clean_target:
            return s, MatchingConfidence.HIGH_CONFIDENCE, 0.90
        elif s_clean in clean_target or clean_target in s_clean:
            if len(s_clean) > 3 and len(clean_target) > 3:
                return s, MatchingConfidence.MEDIUM_CONFIDENCE, 0.75

    return None, MatchingConfidence.UNMATCHED, 0.0
