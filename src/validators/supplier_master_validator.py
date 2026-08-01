from typing import Any, List, Union
from datetime import date
import re

from src.schemas.supplier_master import SupplierMasterModel, SupplierTier, IndianState
from src.validators.base import ValidationResult

STATE_GST_CODES = {
    "Punjab": "03",
    "Haryana": "06",
    "Delhi": "07",
    "Uttar Pradesh": "09",
    "Maharashtra": "27",
    "Gujarat": "24",
    "Rajasthan": "08",
    "Tamil Nadu": "33",
    "Karnataka": "29",
    "West Bengal": "19",
    "Telangana": "36",
    "Andhra Pradesh": "37",
    "Chandigarh": "04",
}


def validate_v1(models: List[SupplierMasterModel]) -> List[ValidationResult]:
    """V1: No duplicate supplier_code."""
    results = []
    codes = [m.supplier_code for m in models]
    duplicate_codes = {c for c in codes if codes.count(c) > 1}
    
    for model in models:
        is_dup = model.supplier_code in duplicate_codes
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate supplier_code found: {model.supplier_code}" if is_dup else "No duplicate supplier_code.",
            row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
        ))
    return results


def validate_v2(model: SupplierMasterModel) -> ValidationResult:
    """V2: GSTIN format and state prefix check."""
    passed = True
    message = "GSTIN format and state prefix are valid."
    gstin = model.gstin.strip()

    # 15 character alphanumeric format
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
            message = f"GSTIN state prefix '{gstin[:2]}' does not match expected state prefix '{expected_prefix}' for state '{model.state}'."

    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message=message,
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v3(model: SupplierMasterModel) -> ValidationResult:
    """V3: PAN embedded in GSTIN match check."""
    passed = True
    message = "PAN matches embedded characters in GSTIN."
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
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v4(model: SupplierMasterModel) -> ValidationResult:
    """V4: State must be valid."""
    passed = model.state in IndianState.__members__.values()
    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message="State is valid." if passed else f"Invalid state: {model.state}",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v5(model: SupplierMasterModel) -> ValidationResult:
    """V5: Credit period range check (7-60 days)."""
    passed = 7 <= model.credit_period_days <= 60
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Credit period is within standard 7-60 days range." if passed else f"Credit period {model.credit_period_days} is outside standard 7-60 days range.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v6(model: SupplierMasterModel) -> ValidationResult:
    """V6: Brands supplied not empty."""
    passed = len(model.brands_supplied) > 0
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Brands supplied list is not empty." if passed else "Brands supplied list is empty.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v7(model: SupplierMasterModel) -> ValidationResult:
    """V7: Brands supplied valid enum."""
    # Already validated by schema parsing list[Brand], return True
    return ValidationResult(
        rule_id="V7",
        passed=True,
        message="Brands supplied are valid enums.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v8(model: SupplierMasterModel) -> ValidationResult:
    """V8: Categories supplied not empty."""
    passed = len(model.categories_supplied) > 0
    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message="Categories supplied list is not empty." if passed else "Categories supplied list is empty.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v9(model: SupplierMasterModel) -> ValidationResult:
    """V9: Categories supplied valid enum."""
    # Already validated by schema parsing list[Category]
    return ValidationResult(
        rule_id="V9",
        passed=True,
        message="Categories supplied are valid enums.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v10(model: SupplierMasterModel) -> ValidationResult:
    """V10: Tier-brand cardinality (Mill has exactly 1 brand)."""
    passed = True
    message = "Tier-brand cardinality is valid."

    if model.supplier_tier == SupplierTier.MILL:
        if len(model.brands_supplied) != 1:
            passed = False
            message = f"Supplier tier is Mill, but supplies {len(model.brands_supplied)} brands (must supply exactly 1 brand)."

    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message=message,
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v11(model: SupplierMasterModel) -> ValidationResult:
    """V11: Contact phone format (exactly 10 digits)."""
    phone = model.contact_phone.strip()
    passed = len(phone) == 10 and phone.isdigit()
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Contact phone format is valid." if passed else f"Contact phone '{phone}' is not exactly 10 digits.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v12(model: SupplierMasterModel) -> ValidationResult:
    """V12: Contact email format check."""
    email = model.contact_email.strip()
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    passed = bool(re.match(pattern, email))
    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message="Contact email format is valid." if passed else f"Contact email '{email}' is not a valid email address.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v13(model: SupplierMasterModel) -> ValidationResult:
    """V13: Pincode format (exactly 6 digits)."""
    pincode = model.pincode.strip()
    passed = len(pincode) == 6 and pincode.isdigit()
    return ValidationResult(
        rule_id="V13",
        passed=passed,
        message="Pincode format is valid." if passed else f"Pincode '{pincode}' is not exactly 6 digits.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v14(model: SupplierMasterModel) -> ValidationResult:
    """V14: Onboarding date not in the future."""
    passed = model.onboarding_date <= date.today()
    return ValidationResult(
        rule_id="V14",
        passed=passed,
        message="Onboarding date is not in the future." if passed else f"Onboarding date {model.onboarding_date} is in the future.",
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_v15(model: SupplierMasterModel) -> ValidationResult:
    """V15: Supplier code format matches SUP-{TIER_CODE}-{SEQ}."""
    code = model.supplier_code.strip()
    pattern = r"^SUP-(MILL|DIST|TRDR)-\d{3}$"
    passed = bool(re.match(pattern, code))
    
    # Check if the code tier matches the actual supplier tier
    if passed:
        tier_map = {
            SupplierTier.MILL: "MILL",
            SupplierTier.DISTRIBUTOR: "DIST",
            SupplierTier.TRADER: "TRDR",
        }
        expected_tier_code = tier_map.get(model.supplier_tier)
        code_tier = code.split("-")[1]
        if code_tier != expected_tier_code:
            passed = False
            message = f"Supplier code tier '{code_tier}' does not match actual tier '{model.supplier_tier}' (expected '{expected_tier_code}')."
        else:
            message = "Supplier code format and tier alignment are valid."
    else:
        message = f"Supplier code '{code}' does not match standard pattern SUP-{{TIER_CODE}}-{{SEQ}}."

    return ValidationResult(
        rule_id="V15",
        passed=passed,
        message=message,
        row_reference={"supplier_id": str(model.supplier_id), "supplier_code": model.supplier_code}
    )


def validate_batch(rows: List[Union[dict, SupplierMasterModel]]) -> List[ValidationResult]:
    """Validate a batch of Supplier Master records against all business rules."""
    models: List[SupplierMasterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, SupplierMasterModel):
            models.append(row)
        else:
            try:
                model = SupplierMasterModel(**row)
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
