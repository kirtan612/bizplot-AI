from typing import Any, List, Union
from datetime import date
import re

from src.schemas.company_master import CompanyMasterModel, CompanyType
from src.validators.supplier_master_validator import STATE_GST_CODES
from src.validators.base import ValidationResult


def validate_v1(models: List[CompanyMasterModel]) -> List[ValidationResult]:
    """V1: Single company record only (batch contains exactly 1 row)."""
    results = []
    is_excessive = len(models) > 1
    
    for model in models:
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_excessive,
            message="Batch contains multiple company records (only 1 company allowed)." if is_excessive else "Batch contains a single company record.",
            row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
        ))
    return results


def validate_v2(model: CompanyMasterModel) -> ValidationResult:
    """V2: company_code must be exactly 'COMP-001'."""
    passed = model.company_code.strip() == "COMP-001"
    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message="Company code is valid COMP-001." if passed else f"Company code '{model.company_code}' is invalid (must be COMP-001).",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v3(model: CompanyMasterModel) -> ValidationResult:
    """V3: GSTIN format and state prefix check."""
    passed = True
    message = "GSTIN format and state prefix are valid."
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
            message = f"GSTIN state prefix '{gstin[:2]}' does not match expected state prefix '{expected_prefix}' for state '{model.state}'."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v4(model: CompanyMasterModel) -> ValidationResult:
    """V4: PAN matches embedded characters in GSTIN."""
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
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v5(model: CompanyMasterModel) -> ValidationResult:
    """V5: State must be valid."""
    # Enforced by Pydantic Enum
    return ValidationResult(
        rule_id="V5",
        passed=True,
        message="State is valid.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v6(model: CompanyMasterModel) -> ValidationResult:
    """V6: CIN required for corporate types (Private/Public Limited)."""
    passed = True
    message = "CIN field presence is valid."

    is_corporate = model.company_type in [CompanyType.PRIVATE_LIMITED, CompanyType.PUBLIC_LIMITED]
    if is_corporate:
        if not model.cin or not model.cin.strip():
            passed = False
            message = f"Company type is '{model.company_type}', but CIN is missing."
    else:
        if model.cin is not None and model.cin.strip() != "":
            passed = False
            message = f"Company type is '{model.company_type}', but CIN '{model.cin}' was provided (CIN is for corporations only)."

    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v7(model: CompanyMasterModel) -> ValidationResult:
    """V7: CIN format check (if present)."""
    passed = True
    message = "CIN format is valid (or not present)."

    if model.cin and model.cin.strip():
        cin = model.cin.strip()
        pattern = r"^[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$"
        if len(cin) != 21 or not re.match(pattern, cin):
            passed = False
            message = f"CIN '{cin}' is not in standard 21-character format."

    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v8(model: CompanyMasterModel) -> ValidationResult:
    """V8: Pincode format check (exactly 6 digits)."""
    pincode = model.pincode.strip()
    passed = len(pincode) == 6 and pincode.isdigit()
    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message="Pincode format is valid." if passed else f"Pincode '{pincode}' is not exactly 6 digits.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v9(model: CompanyMasterModel) -> ValidationResult:
    """V9: Contact phone format check (exactly 10 digits)."""
    phone = model.contact_phone.strip()
    passed = len(phone) == 10 and phone.isdigit()
    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message="Contact phone format is valid." if passed else f"Contact phone '{phone}' is not exactly 10 digits.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v10(model: CompanyMasterModel) -> ValidationResult:
    """V10: Contact email format check."""
    email = model.contact_email.strip()
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    passed = bool(re.match(pattern, email))
    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message="Contact email format is valid." if passed else f"Contact email '{email}' is not a valid email address.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v11(model: CompanyMasterModel) -> ValidationResult:
    """V11: Financial year start format check (MM-DD)."""
    fy_start = model.financial_year_start.strip()
    pattern = r"^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$"
    passed = bool(re.match(pattern, fy_start))
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Financial year start format is valid MM-DD." if passed else f"Financial year start '{fy_start}' is not in MM-DD format.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v12(model: CompanyMasterModel) -> ValidationResult:
    """V12: Bank account number format check (10 to 18 digits)."""
    acct = model.bank_account_number.strip()
    passed = 10 <= len(acct) <= 18 and acct.isdigit()
    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message="Bank account format is valid." if passed else f"Bank account number '{acct}' is not between 10 and 18 digits.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v13(model: CompanyMasterModel) -> ValidationResult:
    """V13: Bank IFSC format check (11 characters)."""
    ifsc = model.bank_ifsc.strip()
    pattern = r"^[A-Z]{4}0[A-Z0-9]{6}$"
    passed = len(ifsc) == 11 and bool(re.match(pattern, ifsc))
    return ValidationResult(
        rule_id="V13",
        passed=passed,
        message="Bank IFSC format is valid." if passed else f"Bank IFSC '{ifsc}' is not a valid 11-character IFSC.",
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v14(model: CompanyMasterModel) -> ValidationResult:
    """V14: Opening balance date aligns with financial_year_start month and day."""
    passed = True
    message = "Opening balance date aligns with financial year start."
    
    # Check MM-DD format first
    fy_start = model.financial_year_start.strip()
    if re.match(r"^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$", fy_start):
        expected_md = f"{model.opening_balance_date.month:02d}-{model.opening_balance_date.day:02d}"
        if expected_md != fy_start:
            passed = False
            message = f"Opening balance date '{model.opening_balance_date}' does not align with financial year start '{fy_start}' (expected date to be on '{fy_start}')."
    else:
        passed = False
        message = f"Cannot verify date alignment because financial year start '{fy_start}' is invalid."

    return ValidationResult(
        rule_id="V14",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_v15(model: CompanyMasterModel) -> ValidationResult:
    """V15: Current FY label matches FY YYYY-YY pattern."""
    fy = model.current_fy.strip()
    pattern = r"^FY \d{4}-\d{2}$"
    passed = bool(re.match(pattern, fy))
    
    if passed:
        # Extra logical consistency check: e.g. FY 2024-25 -> years are consecutive
        parts = fy.split(" ")[1].split("-")
        y1 = int(parts[0])
        y2 = int(parts[1])
        if (y1 + 1) % 100 != y2:
            passed = False
            message = f"Current FY '{fy}' years are not consecutive (expected secondary year to be {(y1 + 1) % 100:02d})."
        else:
            message = "Current FY format is valid."
    else:
        message = f"Current FY '{fy}' does not match standard pattern FY YYYY-YY."

    return ValidationResult(
        rule_id="V15",
        passed=passed,
        message=message,
        row_reference={"company_id": str(model.company_id), "company_code": model.company_code}
    )


def validate_batch(rows: List[Union[dict, CompanyMasterModel]]) -> List[ValidationResult]:
    """Validate a batch of Company Master records against all business rules."""
    models: List[CompanyMasterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, CompanyMasterModel):
            models.append(row)
        else:
            try:
                model = CompanyMasterModel(**row)
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
