from typing import Any, List, Union
from datetime import date
import re
from decimal import Decimal

from src.schemas.customer_master import CustomerMasterModel, CustomerType, PaymentBehaviorTier
from src.validators.supplier_master_validator import STATE_GST_CODES
from src.validators.base import ValidationResult


def validate_v1(models: List[CustomerMasterModel]) -> List[ValidationResult]:
    """V1: No duplicate customer_code."""
    results = []
    codes = [m.customer_code for m in models]
    duplicate_codes = {c for c in codes if codes.count(c) > 1}
    
    for model in models:
        is_dup = model.customer_code in duplicate_codes
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate customer_code found: {model.customer_code}" if is_dup else "No duplicate customer_code.",
            row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
        ))
    return results


def validate_v2(model: CustomerMasterModel) -> ValidationResult:
    """V2: GSTIN presence check depending on gst_registered."""
    passed = True
    message = "GSTIN presence is correct."

    if model.gst_registered:
        if not model.gstin or not model.gstin.strip():
            passed = False
            message = "Customer is GST registered, but GSTIN is missing."
    else:
        if model.gstin is not None and model.gstin.strip() != "":
            passed = False
            message = f"Customer is not GST registered, but GSTIN '{model.gstin}' was provided."

    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message=message,
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v3(model: CustomerMasterModel) -> ValidationResult:
    """V3: GSTIN format and state prefix check (if registered)."""
    passed = True
    message = "GSTIN format and state prefix are valid (or not registered)."
    
    if model.gst_registered and model.gstin:
        gstin = model.gstin.strip()
        pattern = r"^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Zz\d]{1}[A-Z\d]{1}$"
        if len(gstin) != 15 or not re.match(pattern, gstin):
            passed = False
            message = f"GSTIN '{gstin}' is not in standard 15-character format."
        else:
            expected_prefix = STATE_GST_CODES.get(model.state)
            if not expected_prefix:
                passed = False
                message = f"State '{model.state}' has no registered GST state code mapping."
            elif gstin[:2] != expected_prefix:
                passed = False
                message = f"GSTIN state prefix '{gstin[:2]}' does not match expected prefix '{expected_prefix}' for state '{model.state}'."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v4(model: CustomerMasterModel) -> ValidationResult:
    """V4: PAN embedded in GSTIN matches PAN field (if registered)."""
    passed = True
    message = "PAN matches embedded characters in GSTIN (or not registered)."

    if model.gst_registered and model.gstin:
        gstin = model.gstin.strip()
        pan = model.pan.strip()
        if len(gstin) >= 12:
            embedded_pan = gstin[2:12]
            if embedded_pan != pan:
                passed = False
                message = f"Embedded PAN in GSTIN '{embedded_pan}' does not match PAN field '{pan}'."
        else:
            passed = False
            message = "GSTIN is too short to extract embedded PAN."

    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v5(model: CustomerMasterModel) -> ValidationResult:
    """V5: PAN format check (exactly 10 chars, standard pattern)."""
    pan = model.pan.strip()
    pattern = r"^[A-Z]{5}\d{4}[A-Z]{1}$"
    passed = bool(re.match(pattern, pan))
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="PAN format is valid." if passed else f"PAN '{pan}' does not match standard 10-character pattern.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v6(model: CustomerMasterModel) -> ValidationResult:
    """V6: Credit period range check (0-90 days)."""
    passed = 0 <= model.credit_period_days <= 90
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Credit period is within standard 0-90 days range." if passed else f"Credit period {model.credit_period_days} is outside standard 0-90 days range.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v7(model: CustomerMasterModel) -> ValidationResult:
    """V7: Credit limit range check (0 to ₹10,000,000)."""
    limit = model.credit_limit
    passed = Decimal("0.00") <= limit <= Decimal("10000000.00")
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Credit limit is within standard 0-10,000,000 range." if passed else f"Credit limit {limit} is outside standard range.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v8(model: CustomerMasterModel) -> ValidationResult:
    """V8: State must be valid."""
    # Enforced by Pydantic Enum
    return ValidationResult(
        rule_id="V8",
        passed=True,
        message="State is valid.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v9(model: CustomerMasterModel) -> ValidationResult:
    """V9: Contact phone format check (exactly 10 digits)."""
    phone = model.contact_phone.strip()
    passed = len(phone) == 10 and phone.isdigit()
    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message="Contact phone format is valid." if passed else f"Contact phone '{phone}' is not exactly 10 digits.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v10(model: CustomerMasterModel) -> ValidationResult:
    """V10: Contact email format check."""
    email = model.contact_email.strip()
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    passed = bool(re.match(pattern, email))
    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message="Contact email format is valid." if passed else f"Contact email '{email}' is not a valid email address.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v11(model: CustomerMasterModel) -> ValidationResult:
    """V11: Pincode format check (exactly 6 digits)."""
    pincode = model.pincode.strip()
    passed = len(pincode) == 6 and pincode.isdigit()
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Pincode format is valid." if passed else f"Pincode '{pincode}' is not exactly 6 digits.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v12(model: CustomerMasterModel) -> ValidationResult:
    """V12: Onboarding date not in the future."""
    passed = model.onboarding_date <= date.today()
    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message="Onboarding date is not in the future." if passed else f"Onboarding date {model.onboarding_date} is in the future.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v13(model: CustomerMasterModel) -> ValidationResult:
    """V13: Customer code format check (matches CUST-{TYPE_CODE}-{SEQ})."""
    code = model.customer_code.strip()
    pattern = r"^CUST-(DIST|RETL|FABR|CONT)-\d{3}$"
    passed = bool(re.match(pattern, code))
    
    if passed:
        type_map = {
            CustomerType.DISTRIBUTOR: "DIST",
            CustomerType.RETAILER: "RETL",
            CustomerType.FABRICATOR: "FABR",
            CustomerType.CONTRACTOR: "CONT",
        }
        expected_type_code = type_map.get(model.customer_type)
        code_type = code.split("-")[1]
        if code_type != expected_type_code:
            passed = False
            message = f"Customer code type '{code_type}' does not match actual type '{model.customer_type}' (expected '{expected_type_code}')."
        else:
            message = "Customer code format and type alignment are valid."
    else:
        message = f"Customer code '{code}' does not match standard pattern CUST-{{TYPE_CODE}}-{{SEQ}}."

    return ValidationResult(
        rule_id="V13",
        passed=passed,
        message=message,
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v14(model: CustomerMasterModel) -> ValidationResult:
    """V14: Customer type validity."""
    # Enforced by Pydantic Enum
    return ValidationResult(
        rule_id="V14",
        passed=True,
        message="Customer type is valid.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_v15(model: CustomerMasterModel) -> ValidationResult:
    """V15: Payment behavior tier validity."""
    # Enforced by Pydantic Enum
    return ValidationResult(
        rule_id="V15",
        passed=True,
        message="Payment behavior tier is valid.",
        row_reference={"customer_id": str(model.customer_id), "customer_code": model.customer_code}
    )


def validate_batch(rows: List[Union[dict, CustomerMasterModel]]) -> List[ValidationResult]:
    """Validate a batch of Customer Master records against all business rules."""
    models: List[CustomerMasterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, CustomerMasterModel):
            models.append(row)
        else:
            try:
                model = CustomerMasterModel(**row)
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

    # 2. Run batch checks (V1)
    results.extend(validate_v1(models))

    # 3. Run row-level checks (V2 - V15)
    for model in models:
        results.append(validate_v2(model))
        results.append(validate_v3(model))
        results.append(validate_v4(model))
        results.append(validate_v5(model))
        results.append(validate_v6(model))
        results.append(validate_v7(model))
        results.append(validate_v8(model))
        results.append(validate_v9(model))
        results.append(validate_v10(model))
        results.append(validate_v11(model))
        results.append(validate_v12(model))
        results.append(validate_v13(model))
        results.append(validate_v14(model))
        results.append(validate_v15(model))

    return results
