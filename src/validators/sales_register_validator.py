from typing import Any, Dict, List, Optional, Union
from datetime import date, timedelta
from decimal import Decimal
import re

from src.schemas.sales_register import SalesRegisterModel
from src.validators.base import ValidationResult
from src.validators.purchase_register_validator import COMPANY_HOME_STATE


def validate_v1(models: List[SalesRegisterModel]) -> List[ValidationResult]:
    """V1: Unique sales_id across the batch."""
    results = []
    ids = [str(m.sales_id) for m in models]
    duplicate_ids = {i for i in ids if ids.count(i) > 1}
    
    for model in models:
        s_id = str(model.sales_id)
        is_dup = s_id in duplicate_ids
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate sales_id found: {s_id}" if is_dup else "No duplicate sales_id.",
            row_reference={"sales_id": s_id, "invoice_number": model.invoice_number}
        ))
    return results


def validate_v2(model: SalesRegisterModel) -> ValidationResult:
    """V2: invoice_number matches format INV-SAL-\\d{6}-\\d{3}."""
    inv = model.invoice_number.strip()
    pattern = r"^INV-SAL-\d{6}-\d{3}$"
    passed = bool(re.match(pattern, inv))
    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message="Sales invoice number format is valid." if passed else f"Invoice number '{inv}' does not match standard pattern INV-SAL-YYYYMM-SEQ.",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v3(model: SalesRegisterModel, valid_customers: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V3: customer_id and customer_code exist in Customer Master."""
    passed = True
    message = "Customer FK references valid Customer Master entry (or context not provided)."

    if valid_customers is not None:
        c_id = str(model.customer_id)
        if c_id not in valid_customers:
            passed = False
            message = f"Customer ID '{c_id}' does not exist in Customer Master."
        else:
            cust_info = valid_customers[c_id]
            expected_code = cust_info.get("customer_code") if isinstance(cust_info, dict) else getattr(cust_info, "customer_code", None)
            if expected_code and expected_code != model.customer_code:
                passed = False
                message = f"Customer code '{model.customer_code}' does not match expected code '{expected_code}' for ID '{c_id}'."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v4(model: SalesRegisterModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V4: product_id and product_code exist in Product Master."""
    passed = True
    message = "Product FK references valid Product Master entry (or context not provided)."

    if valid_products is not None:
        p_id = str(model.product_id)
        if p_id not in valid_products:
            passed = False
            message = f"Product ID '{p_id}' does not exist in Product Master."
        else:
            prod_info = valid_products[p_id]
            expected_code = prod_info.get("product_code") if isinstance(prod_info, dict) else getattr(prod_info, "product_code", None)
            if expected_code and expected_code != model.product_code:
                passed = False
                message = f"Product code '{model.product_code}' does not match expected code '{expected_code}' for ID '{p_id}'."

    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v5(model: SalesRegisterModel) -> ValidationResult:
    """V5: quantity_pcs > 0 and total_weight_kg > 0."""
    passed = model.quantity_pcs > 0 and model.total_weight_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Quantity and weight are positive." if passed else "Quantity and total weight must be strictly greater than zero.",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v6(model: SalesRegisterModel) -> ValidationResult:
    """V6: unit_price_per_kg > 0."""
    passed = model.unit_price_per_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Unit price per kg is positive." if passed else "Unit price per kg must be strictly greater than zero.",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v7(model: SalesRegisterModel) -> ValidationResult:
    """V7: taxable_value == total_weight_kg * unit_price_per_kg."""
    expected = round(model.total_weight_kg * model.unit_price_per_kg, 2)
    passed = abs(model.taxable_value - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Taxable value math is correct." if passed else f"Taxable value {model.taxable_value} does not match expected result {expected}.",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v8(model: SalesRegisterModel, valid_customers: Optional[Dict[str, Any]] = None, company_state: str = COMPANY_HOME_STATE) -> ValidationResult:
    """V8: is_interstate == (customer_state != company_state)."""
    passed = True
    message = "Interstate classification matches customer state (or context not provided)."

    if valid_customers is not None:
        c_id = str(model.customer_id)
        if c_id in valid_customers:
            cust_info = valid_customers[c_id]
            customer_state = cust_info.get("state") if isinstance(cust_info, dict) else getattr(cust_info, "state", None)
            expected_interstate = (customer_state != company_state)
            if model.is_interstate != expected_interstate:
                passed = False
                message = f"is_interstate is {model.is_interstate}, but customer state '{customer_state}' vs company state '{company_state}' expects {expected_interstate}."

    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v9(model: SalesRegisterModel) -> ValidationResult:
    """V9: GST rates alignment (Intrastate vs Interstate)."""
    passed = True
    message = "GST rates align with interstate status."

    if model.is_interstate:
        if model.cgst_rate != Decimal("0.00") or model.sgst_rate != Decimal("0.00") or model.igst_rate != Decimal("18.00"):
            passed = False
            message = f"Interstate sales expects CGST=0%, SGST=0%, IGST=18%, but got CGST={model.cgst_rate}%, SGST={model.sgst_rate}%, IGST={model.igst_rate}%."
    else:
        if model.cgst_rate != Decimal("9.00") or model.sgst_rate != Decimal("9.00") or model.igst_rate != Decimal("0.00"):
            passed = False
            message = f"Intrastate sales expects CGST=9%, SGST=9%, IGST=0%, but got CGST={model.cgst_rate}%, SGST={model.sgst_rate}%, IGST={model.igst_rate}%."

    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v10(model: SalesRegisterModel) -> ValidationResult:
    """V10: GST amount calculations."""
    passed = True
    message = "GST amount math is correct."

    expected_cgst = round(model.taxable_value * (model.cgst_rate / Decimal("100.00")), 2)
    expected_sgst = round(model.taxable_value * (model.sgst_rate / Decimal("100.00")), 2)
    expected_igst = round(model.taxable_value * (model.igst_rate / Decimal("100.00")), 2)
    expected_total = model.cgst_amount + model.sgst_amount + model.igst_amount

    if abs(model.cgst_amount - expected_cgst) > Decimal("0.01"):
        passed = False
        message = f"CGST amount {model.cgst_amount} does not match expected {expected_cgst}."
    elif abs(model.sgst_amount - expected_sgst) > Decimal("0.01"):
        passed = False
        message = f"SGST amount {model.sgst_amount} does not match expected {expected_sgst}."
    elif abs(model.igst_amount - expected_igst) > Decimal("0.01"):
        passed = False
        message = f"IGST amount {model.igst_amount} does not match expected {expected_igst}."
    elif abs(model.total_gst - expected_total) > Decimal("0.01"):
        passed = False
        message = f"Total GST {model.total_gst} does not match sum of GST components {expected_total}."

    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v11(model: SalesRegisterModel) -> ValidationResult:
    """V11: invoice_amount == taxable_value + total_gst."""
    expected = round(model.taxable_value + model.total_gst, 2)
    passed = abs(model.invoice_amount - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Invoice amount math is correct." if passed else f"Invoice amount {model.invoice_amount} does not match taxable_value + total_gst ({expected}).",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v12(model: SalesRegisterModel, valid_customers: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V12: payment_due_date == sales_date + customer.credit_period_days."""
    passed = True
    message = "Payment due date matches credit period (or context not provided)."

    if valid_customers is not None:
        c_id = str(model.customer_id)
        if c_id in valid_customers:
            cust_info = valid_customers[c_id]
            credit_days = cust_info.get("credit_period_days") if isinstance(cust_info, dict) else getattr(cust_info, "credit_period_days", None)
            if credit_days is not None:
                expected_due_date = model.sales_date + timedelta(days=int(credit_days))
                if model.payment_due_date != expected_due_date:
                    passed = False
                    message = f"Payment due date '{model.payment_due_date}' does not match expected date '{expected_due_date}' for credit period of {credit_days} days."

    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v13(model: SalesRegisterModel) -> ValidationResult:
    """V13: sales_date is not in the future."""
    passed = model.sales_date <= date.today()
    return ValidationResult(
        rule_id="V13",
        passed=passed,
        message="Sales date is not in the future." if passed else f"Sales date {model.sales_date} is in the future.",
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_v14(model: SalesRegisterModel, valid_customers: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V14: Customer credit limit check for invoice amount."""
    passed = True
    message = "Invoice amount is within customer credit limit (or context not provided)."

    if valid_customers is not None:
        c_id = str(model.customer_id)
        if c_id in valid_customers:
            cust_info = valid_customers[c_id]
            limit = cust_info.get("credit_limit") if isinstance(cust_info, dict) else getattr(cust_info, "credit_limit", None)
            if limit is not None:
                credit_limit = Decimal(str(limit))
                if model.invoice_amount > credit_limit:
                    passed = False
                    message = f"Single invoice amount ({model.invoice_amount}) exceeds customer credit limit ({credit_limit})."

    return ValidationResult(
        rule_id="V14",
        passed=passed,
        message=message,
        row_reference={"sales_id": str(model.sales_id), "invoice_number": model.invoice_number}
    )


def validate_batch(
    rows: List[Union[dict, SalesRegisterModel]],
    valid_customers: Optional[Dict[str, Any]] = None,
    valid_products: Optional[Dict[str, Any]] = None,
    company_state: str = COMPANY_HOME_STATE
) -> List[ValidationResult]:
    """Validate a batch of Sales Register records against all business rules."""
    models: List[SalesRegisterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, SalesRegisterModel):
            models.append(row)
        else:
            try:
                model = SalesRegisterModel(**row)
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

    # 3. Run row-level checks (V2 - V14)
    for model in models:
        results.append(validate_v2(model))
        results.append(validate_v3(model, valid_customers))
        results.append(validate_v4(model, valid_products))
        results.append(validate_v5(model))
        results.append(validate_v6(model))
        results.append(validate_v7(model))
        results.append(validate_v8(model, valid_customers, company_state))
        results.append(validate_v9(model))
        results.append(validate_v10(model))
        results.append(validate_v11(model))
        results.append(validate_v12(model, valid_customers))
        results.append(validate_v13(model))
        results.append(validate_v14(model, valid_customers))

    return results
