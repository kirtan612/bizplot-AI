from typing import Any, Dict, List, Optional, Union
from datetime import date, timedelta
from decimal import Decimal
import re

from src.schemas.purchase_register import PurchaseRegisterModel
from src.validators.base import ValidationResult

COMPANY_HOME_STATE = "Gujarat"


def validate_v1(models: List[PurchaseRegisterModel]) -> List[ValidationResult]:
    """V1: Unique purchase_id across the batch."""
    results = []
    ids = [str(m.purchase_id) for m in models]
    duplicate_ids = {i for i in ids if ids.count(i) > 1}
    
    for model in models:
        p_id = str(model.purchase_id)
        is_dup = p_id in duplicate_ids
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate purchase_id found: {p_id}" if is_dup else "No duplicate purchase_id.",
            row_reference={"purchase_id": p_id, "invoice_number": model.invoice_number}
        ))
    return results


def validate_v2(model: PurchaseRegisterModel) -> ValidationResult:
    """V2: invoice_number matches format INV-PUR-\\d{6}-\\d{3}."""
    inv = model.invoice_number.strip()
    pattern = r"^INV-PUR-\d{6}-\d{3}$"
    passed = bool(re.match(pattern, inv))
    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message="Purchase invoice number format is valid." if passed else f"Invoice number '{inv}' does not match standard pattern INV-PUR-YYYYMM-SEQ.",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v3(model: PurchaseRegisterModel, valid_suppliers: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V3: supplier_id and supplier_code exist in Supplier Master."""
    passed = True
    message = "Supplier FK references valid Supplier Master entry (or context not provided)."

    if valid_suppliers is not None:
        s_id = str(model.supplier_id)
        if s_id not in valid_suppliers:
            passed = False
            message = f"Supplier ID '{s_id}' does not exist in Supplier Master."
        else:
            sup_info = valid_suppliers[s_id]
            expected_code = sup_info.get("supplier_code") if isinstance(sup_info, dict) else getattr(sup_info, "supplier_code", None)
            if expected_code and expected_code != model.supplier_code:
                passed = False
                message = f"Supplier code '{model.supplier_code}' does not match expected code '{expected_code}' for ID '{s_id}'."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v4(model: PurchaseRegisterModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
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
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v5(model: PurchaseRegisterModel) -> ValidationResult:
    """V5: quantity_pcs > 0 and total_weight_kg > 0."""
    passed = model.quantity_pcs > 0 and model.total_weight_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Quantity and weight are positive." if passed else "Quantity and total weight must be strictly greater than zero.",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v6(model: PurchaseRegisterModel) -> ValidationResult:
    """V6: unit_price_per_kg > 0."""
    passed = model.unit_price_per_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Unit price per kg is positive." if passed else "Unit price per kg must be strictly greater than zero.",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v7(model: PurchaseRegisterModel) -> ValidationResult:
    """V7: taxable_value == total_weight_kg * unit_price_per_kg."""
    expected = round(model.total_weight_kg * model.unit_price_per_kg, 2)
    passed = abs(model.taxable_value - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Taxable value math is correct." if passed else f"Taxable value {model.taxable_value} does not match expected result {expected}.",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v8(model: PurchaseRegisterModel, valid_suppliers: Optional[Dict[str, Any]] = None, company_state: str = COMPANY_HOME_STATE) -> ValidationResult:
    """V8: is_interstate == (supplier_state != company_state)."""
    passed = True
    message = "Interstate classification matches supplier state (or context not provided)."

    if valid_suppliers is not None:
        s_id = str(model.supplier_id)
        if s_id in valid_suppliers:
            sup_info = valid_suppliers[s_id]
            supplier_state = sup_info.get("state") if isinstance(sup_info, dict) else getattr(sup_info, "state", None)
            expected_interstate = (supplier_state != company_state)
            if model.is_interstate != expected_interstate:
                passed = False
                message = f"is_interstate is {model.is_interstate}, but supplier state '{supplier_state}' vs company state '{company_state}' expects {expected_interstate}."

    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message=message,
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v9(model: PurchaseRegisterModel) -> ValidationResult:
    """V9: GST rates alignment (Intrastate vs Interstate)."""
    passed = True
    message = "GST rates align with interstate status."

    if model.is_interstate:
        if model.cgst_rate != Decimal("0.00") or model.sgst_rate != Decimal("0.00") or model.igst_rate != Decimal("18.00"):
            passed = False
            message = f"Interstate purchase expects CGST=0%, SGST=0%, IGST=18%, but got CGST={model.cgst_rate}%, SGST={model.sgst_rate}%, IGST={model.igst_rate}%."
    else:
        if model.cgst_rate != Decimal("9.00") or model.sgst_rate != Decimal("9.00") or model.igst_rate != Decimal("0.00"):
            passed = False
            message = f"Intrastate purchase expects CGST=9%, SGST=9%, IGST=0%, but got CGST={model.cgst_rate}%, SGST={model.sgst_rate}%, IGST={model.igst_rate}%."

    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message=message,
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v10(model: PurchaseRegisterModel) -> ValidationResult:
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
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v11(model: PurchaseRegisterModel) -> ValidationResult:
    """V11: invoice_amount == taxable_value + total_gst."""
    expected = round(model.taxable_value + model.total_gst, 2)
    passed = abs(model.invoice_amount - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Invoice amount math is correct." if passed else f"Invoice amount {model.invoice_amount} does not match taxable_value + total_gst ({expected}).",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v12(model: PurchaseRegisterModel, valid_suppliers: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V12: payment_due_date == purchase_date + supplier.credit_period_days."""
    passed = True
    message = "Payment due date matches credit period (or context not provided)."

    if valid_suppliers is not None:
        s_id = str(model.supplier_id)
        if s_id in valid_suppliers:
            sup_info = valid_suppliers[s_id]
            credit_days = sup_info.get("credit_period_days") if isinstance(sup_info, dict) else getattr(sup_info, "credit_period_days", None)
            if credit_days is not None:
                expected_due_date = model.purchase_date + timedelta(days=int(credit_days))
                if model.payment_due_date != expected_due_date:
                    passed = False
                    message = f"Payment due date '{model.payment_due_date}' does not match expected date '{expected_due_date}' for credit period of {credit_days} days."

    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message=message,
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v13(model: PurchaseRegisterModel) -> ValidationResult:
    """V13: purchase_date is not in the future."""
    passed = model.purchase_date <= date.today()
    return ValidationResult(
        rule_id="V13",
        passed=passed,
        message="Purchase date is not in the future." if passed else f"Purchase date {model.purchase_date} is in the future.",
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_v14(model: PurchaseRegisterModel, valid_suppliers: Optional[Dict[str, Any]] = None, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V14: Supplier capability check for product's brand and category."""
    passed = True
    message = "Supplier has capability for product brand and category (or context not provided)."

    if valid_suppliers is not None and valid_products is not None:
        s_id = str(model.supplier_id)
        p_id = str(model.product_id)
        
        if s_id in valid_suppliers and p_id in valid_products:
            sup_info = valid_suppliers[s_id]
            prod_info = valid_products[p_id]
            
            brands_supplied = sup_info.get("brands_supplied") if isinstance(sup_info, dict) else getattr(sup_info, "brands_supplied", [])
            categories_supplied = sup_info.get("categories_supplied") if isinstance(sup_info, dict) else getattr(sup_info, "categories_supplied", [])
            
            prod_brand = prod_info.get("brand") if isinstance(prod_info, dict) else getattr(prod_info, "brand", None)
            prod_cat = prod_info.get("category") if isinstance(prod_info, dict) else getattr(prod_info, "category", None)
            
            # String comparisons
            b_list = [str(b) for b in brands_supplied]
            c_list = [str(c) for c in categories_supplied]
            
            if prod_brand and str(prod_brand) not in b_list:
                passed = False
                message = f"Supplier '{model.supplier_code}' does not supply brand '{prod_brand}' (supplies: {b_list})."
            elif prod_cat and str(prod_cat) not in c_list:
                passed = False
                message = f"Supplier '{model.supplier_code}' does not supply category '{prod_cat}' (supplies: {c_list})."

    return ValidationResult(
        rule_id="V14",
        passed=passed,
        message=message,
        row_reference={"purchase_id": str(model.purchase_id), "invoice_number": model.invoice_number}
    )


def validate_batch(
    rows: List[Union[dict, PurchaseRegisterModel]],
    valid_suppliers: Optional[Dict[str, Any]] = None,
    valid_products: Optional[Dict[str, Any]] = None,
    company_state: str = COMPANY_HOME_STATE
) -> List[ValidationResult]:
    """Validate a batch of Purchase Register records against all business rules."""
    models: List[PurchaseRegisterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, PurchaseRegisterModel):
            models.append(row)
        else:
            try:
                model = PurchaseRegisterModel(**row)
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
        results.append(validate_v3(model, valid_suppliers))
        results.append(validate_v4(model, valid_products))
        results.append(validate_v5(model))
        results.append(validate_v6(model))
        results.append(validate_v7(model))
        results.append(validate_v8(model, valid_suppliers, company_state))
        results.append(validate_v9(model))
        results.append(validate_v10(model))
        results.append(validate_v11(model))
        results.append(validate_v12(model, valid_suppliers))
        results.append(validate_v13(model))
        results.append(validate_v14(model, valid_suppliers, valid_products))

    return results
