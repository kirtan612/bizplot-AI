from typing import Any, Dict, List, Optional, Union
from datetime import date
from decimal import Decimal
import re

from src.schemas.cashbook import CashbookModel, TransactionType, PartyType
from src.validators.base import ValidationResult


def validate_v1(models: List[CashbookModel]) -> List[ValidationResult]:
    """V1: Unique entry_id across the batch."""
    results = []
    ids = [str(m.entry_id) for m in models]
    duplicate_ids = {i for i in ids if ids.count(i) > 1}
    
    for model in models:
        e_id = str(model.entry_id)
        is_dup = e_id in duplicate_ids
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate entry_id found: {e_id}" if is_dup else "No duplicate entry_id.",
            row_reference={"entry_id": e_id, "voucher_number": model.voucher_number}
        ))
    return results


def validate_v2(model: CashbookModel) -> ValidationResult:
    """V2: voucher_number matches format VOU-\\d{6}-\\d{3}."""
    vou = model.voucher_number.strip()
    pattern = r"^VOU-\d{6}-\d{3}$"
    passed = bool(re.match(pattern, vou))
    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message="Voucher number format is valid." if passed else f"Voucher number '{vou}' does not match standard pattern VOU-YYYYMM-SEQ.",
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v3(model: CashbookModel) -> ValidationResult:
    """V3: amount > 0."""
    passed = model.amount > Decimal("0.00")
    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message="Transaction amount is positive." if passed else "Transaction amount must be strictly greater than zero.",
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v4(model: CashbookModel) -> ValidationResult:
    """V4: Cashbook balance math (Receipt = Opening + Amount, Payment = Opening - Amount)."""
    passed = True
    message = "Closing balance math is correct."

    if model.transaction_type == TransactionType.RECEIPT:
        expected = round(model.opening_balance + model.amount, 2)
    else:  # Payment
        expected = round(model.opening_balance - model.amount, 2)

    if abs(model.closing_balance - expected) > Decimal("0.01"):
        passed = False
        message = f"Closing balance ({model.closing_balance}) does not match expected result ({expected}) for {model.transaction_type} of {model.amount}."

    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v5(model: CashbookModel) -> ValidationResult:
    """V5: closing_balance >= 0."""
    passed = model.closing_balance >= Decimal("0.00")
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Closing balance is non-negative." if passed else f"Closing balance ({model.closing_balance}) cannot be negative (cash/bank overdraft violation).",
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v6(
    model: CashbookModel,
    valid_customers: Optional[Dict[str, Any]] = None,
    valid_suppliers: Optional[Dict[str, Any]] = None
) -> ValidationResult:
    """V6: party_type vs party_id relationship & FK validation."""
    passed = True
    message = "Party type and ID relationship is valid."

    if model.party_type in [PartyType.CUSTOMER, PartyType.SUPPLIER]:
        if model.party_id is None:
            passed = False
            message = f"Party type is '{model.party_type}', but party_id is missing."
        else:
            p_id = str(model.party_id)
            if model.party_type == PartyType.CUSTOMER and valid_customers is not None:
                if p_id not in valid_customers:
                    passed = False
                    message = f"Customer party_id '{p_id}' does not exist in Customer Master."
            elif model.party_type == PartyType.SUPPLIER and valid_suppliers is not None:
                if p_id not in valid_suppliers:
                    passed = False
                    message = f"Supplier party_id '{p_id}' does not exist in Supplier Master."
    else:  # Expense or Capital
        if model.party_id is not None:
            passed = False
            message = f"Party type is '{model.party_type}', but party_id '{model.party_id}' was provided (party_id must be null for Expense/Capital)."

    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message=message,
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v7(model: CashbookModel) -> ValidationResult:
    """V7: reference_invoice_number format check."""
    passed = True
    message = "Reference invoice number format is valid (or not provided)."

    if model.reference_invoice_number and model.reference_invoice_number.strip():
        ref_inv = model.reference_invoice_number.strip()
        if model.party_type == PartyType.CUSTOMER:
            pattern = r"^INV-SAL-\d{6}-\d{3}$"
            if not re.match(pattern, ref_inv):
                passed = False
                message = f"Customer receipt reference invoice '{ref_inv}' does not match sales invoice format INV-SAL-YYYYMM-SEQ."
        elif model.party_type == PartyType.SUPPLIER:
            pattern = r"^INV-PUR-\d{6}-\d{3}$"
            if not re.match(pattern, ref_inv):
                passed = False
                message = f"Supplier payment reference invoice '{ref_inv}' does not match purchase invoice format INV-PUR-YYYYMM-SEQ."

    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message=message,
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v8(model: CashbookModel) -> ValidationResult:
    """V8: payment_mode is valid enum value."""
    # Enforced by Pydantic Enum
    return ValidationResult(
        rule_id="V8",
        passed=True,
        message="Payment mode is valid.",
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v9(model: CashbookModel) -> ValidationResult:
    """V9: entry_date is not in the future."""
    passed = model.entry_date <= date.today()
    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message="Entry date is not in the future." if passed else f"Entry date {model.entry_date} is in the future.",
        row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
    )


def validate_v10_batch(models: List[CashbookModel]) -> List[ValidationResult]:
    """V10: Cross-entry continuity check (opening of T == closing of T-1)."""
    results = []
    sorted_models = sorted(models, key=lambda m: (m.entry_date, m.voucher_number))
    
    for idx, model in enumerate(sorted_models):
        passed = True
        message = "Cross-entry balance continuity is valid."
        
        if idx > 0:
            prev = sorted_models[idx - 1]
            if abs(model.opening_balance - prev.closing_balance) > Decimal("0.01"):
                passed = False
                message = f"Opening balance ({model.opening_balance}) on voucher {model.voucher_number} does not match previous closing balance ({prev.closing_balance}) on voucher {prev.voucher_number}."

        results.append(ValidationResult(
            rule_id="V10",
            passed=passed,
            message=message,
            row_reference={"entry_id": str(model.entry_id), "voucher_number": model.voucher_number}
        ))
        
    return results


def validate_batch(
    rows: List[Union[dict, CashbookModel]],
    valid_customers: Optional[Dict[str, Any]] = None,
    valid_suppliers: Optional[Dict[str, Any]] = None
) -> List[ValidationResult]:
    """Validate a batch of Cashbook records against all business rules."""
    models: List[CashbookModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, CashbookModel):
            models.append(row)
        else:
            row_dict = dict(row)
            if row_dict.get("party_id") == "":
                row_dict["party_id"] = None
            if row_dict.get("reference_invoice_number") == "":
                row_dict["reference_invoice_number"] = None
            try:
                model = CashbookModel(**row_dict)
                models.append(model)
            except Exception as e:
                results.append(ValidationResult(
                    rule_id="SCHEMA_VALIDATION",
                    passed=False,
                    message=f"Schema parsing failed for row {idx}: {str(e)}",
                    row_reference=row
                ))

    if not models:
        return results

    # 2. Run batch checks (V1, V10)
    results.extend(validate_v1(models))
    results.extend(validate_v10_batch(models))

    # 3. Run row-level checks (V2 - V9)
    for model in models:
        results.append(validate_v2(model))
        results.append(validate_v3(model))
        results.append(validate_v4(model))
        results.append(validate_v5(model))
        results.append(validate_v6(model, valid_customers, valid_suppliers))
        results.append(validate_v7(model))
        results.append(validate_v8(model))
        results.append(validate_v9(model))

    return results
