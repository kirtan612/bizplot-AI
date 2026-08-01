from typing import Any, Dict, List, Optional, Union
from datetime import date
from decimal import Decimal

from src.schemas.price_history import PriceHistoryModel
from src.validators.base import ValidationResult

BRAND_MULTIPLIERS = {
    "APL Apollo": Decimal("1.15"),
    "Hi-Tech": Decimal("1.08"),
    "Local Mills": Decimal("1.00"),
}

CATEGORY_ADJUSTMENTS = {
    "MS": Decimal("0.00"),
    "GI": Decimal("8.00"),
    "GP": Decimal("5.00"),
}


def validate_v1(models: List[PriceHistoryModel]) -> List[ValidationResult]:
    """V1: Unique (effective_date, product_id) pair."""
    results = []
    pairs = [(m.effective_date, str(m.product_id)) for m in models]
    duplicate_pairs = {p for p in pairs if pairs.count(p) > 1}
    
    for model in models:
        pair = (model.effective_date, str(model.product_id))
        is_dup = pair in duplicate_pairs
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate (effective_date, product_id) pair found for product {model.product_code}" if is_dup else "No duplicate (effective_date, product_id) pair.",
            row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
        ))
    return results


def validate_v2(model: PriceHistoryModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V2: product_id and product_code exist in Product Master."""
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
        rule_id="V2",
        passed=passed,
        message=message,
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v3(model: PriceHistoryModel, valid_indices: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V3: index_id and effective_date exist in Steel Market Index."""
    passed = True
    message = "Index FK references valid Steel Market Index entry (or context not provided)."

    if valid_indices is not None:
        idx_id = str(model.index_id)
        if idx_id not in valid_indices:
            passed = False
            message = f"Index ID '{idx_id}' does not exist in Steel Market Index."
        else:
            idx_info = valid_indices[idx_id]
            expected_date = idx_info.get("effective_date") if isinstance(idx_info, dict) else getattr(idx_info, "effective_date", None)
            if expected_date and expected_date != model.effective_date:
                passed = False
                message = f"Effective date '{model.effective_date}' does not match expected index date '{expected_date}'."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v4(model: PriceHistoryModel, valid_products: Optional[Dict[str, Any]] = None, valid_indices: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V4: base_index_rate matches the active index rate for that date and brand tier."""
    passed = True
    message = "Base index rate matches Steel Market Index track for brand."

    if valid_products is not None and valid_indices is not None:
        p_id = str(model.product_id)
        idx_id = str(model.index_id)
        
        if p_id in valid_products and idx_id in valid_indices:
            prod_info = valid_products[p_id]
            idx_info = valid_indices[idx_id]
            
            brand = prod_info.get("brand") if isinstance(prod_info, dict) else getattr(prod_info, "brand", None)
            
            if brand == "Local Mills":
                expected_rate = idx_info.get("regional_rate_per_kg") if isinstance(idx_info, dict) else getattr(idx_info, "regional_rate_per_kg", None)
            else:
                expected_rate = idx_info.get("national_rate_per_kg") if isinstance(idx_info, dict) else getattr(idx_info, "national_rate_per_kg", None)

            if expected_rate is not None and abs(model.base_index_rate - Decimal(str(expected_rate))) > Decimal("0.01"):
                passed = False
                message = f"Base index rate {model.base_index_rate} does not match expected {brand} index rate {expected_rate}."

    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v5(model: PriceHistoryModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V5: brand_multiplier matches brand tier rule."""
    passed = True
    message = "Brand multiplier is valid."

    if valid_products is not None:
        p_id = str(model.product_id)
        if p_id in valid_products:
            prod_info = valid_products[p_id]
            brand = prod_info.get("brand") if isinstance(prod_info, dict) else getattr(prod_info, "brand", None)
            expected_mult = BRAND_MULTIPLIERS.get(brand)
            if expected_mult is not None and model.brand_multiplier != expected_mult:
                passed = False
                message = f"Brand multiplier {model.brand_multiplier} does not match expected {expected_mult} for brand '{brand}'."

    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message=message,
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v6(model: PriceHistoryModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
    """V6: category_adjustment matches category rule."""
    passed = True
    message = "Category adjustment is valid."

    if valid_products is not None:
        p_id = str(model.product_id)
        if p_id in valid_products:
            prod_info = valid_products[p_id]
            category = prod_info.get("category") if isinstance(prod_info, dict) else getattr(prod_info, "category", None)
            expected_adj = CATEGORY_ADJUSTMENTS.get(category)
            if expected_adj is not None and model.category_adjustment != expected_adj:
                passed = False
                message = f"Category adjustment {model.category_adjustment} does not match expected {expected_adj} for category '{category}'."

    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message=message,
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v7(model: PriceHistoryModel) -> ValidationResult:
    """V7: calculated_list_price_per_kg == (base_index_rate * brand_multiplier) + category_adjustment."""
    expected = round((model.base_index_rate * model.brand_multiplier) + model.category_adjustment, 2)
    passed = abs(model.calculated_list_price_per_kg - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Calculated list price is mathematically correct." if passed else f"Calculated list price {model.calculated_list_price_per_kg} does not match expected formula result {expected}.",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v8(model: PriceHistoryModel) -> ValidationResult:
    """V8: effective_purchase_price_per_kg == calculated_list_price_per_kg * (1 - purchase_discount_pct / 100)."""
    discount_factor = Decimal("1.00") - (model.purchase_discount_pct / Decimal("100.00"))
    expected = round(model.calculated_list_price_per_kg * discount_factor, 2)
    passed = abs(model.effective_purchase_price_per_kg - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message="Effective purchase price is mathematically correct." if passed else f"Effective purchase price {model.effective_purchase_price_per_kg} does not match expected formula result {expected}.",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v9(model: PriceHistoryModel) -> ValidationResult:
    """V9: effective_sales_price_per_kg == calculated_list_price_per_kg * (1 + sales_margin_pct / 100)."""
    margin_factor = Decimal("1.00") + (model.sales_margin_pct / Decimal("100.00"))
    expected = round(model.calculated_list_price_per_kg * margin_factor, 2)
    passed = abs(model.effective_sales_price_per_kg - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message="Effective sales price is mathematically correct." if passed else f"Effective sales price {model.effective_sales_price_per_kg} does not match expected formula result {expected}.",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v10(model: PriceHistoryModel) -> ValidationResult:
    """V10: effective_sales_price_per_kg > effective_purchase_price_per_kg."""
    passed = model.effective_sales_price_per_kg > model.effective_purchase_price_per_kg
    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message="Sales price exceeds purchase price (positive margin)." if passed else f"Sales price ({model.effective_sales_price_per_kg}) is not greater than purchase price ({model.effective_purchase_price_per_kg}).",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v11(model: PriceHistoryModel) -> ValidationResult:
    """V11: purchase_discount_pct in [0.00, 15.00]."""
    disc = model.purchase_discount_pct
    passed = Decimal("0.00") <= disc <= Decimal("15.00")
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Purchase discount percentage is within standard 0%–15% range." if passed else f"Purchase discount percentage {disc}% is outside allowed range [0.00, 15.00].",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_v12(model: PriceHistoryModel) -> ValidationResult:
    """V12: sales_margin_pct in [2.00, 20.00]."""
    margin = model.sales_margin_pct
    passed = Decimal("2.00") <= margin <= Decimal("20.00")
    return ValidationResult(
        rule_id="V12",
        passed=passed,
        message="Sales margin percentage is within standard 2%–20% range." if passed else f"Sales margin percentage {margin}% is outside allowed range [2.00, 20.00].",
        row_reference={"price_id": str(model.price_id), "product_code": model.product_code, "effective_date": str(model.effective_date)}
    )


def validate_batch(
    rows: List[Union[dict, PriceHistoryModel]],
    valid_products: Optional[Dict[str, Any]] = None,
    valid_indices: Optional[Dict[str, Any]] = None
) -> List[ValidationResult]:
    """Validate a batch of Price History records against all business rules."""
    models: List[PriceHistoryModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, PriceHistoryModel):
            models.append(row)
        else:
            try:
                model = PriceHistoryModel(**row)
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

    # 3. Run row-level checks (V2 - V12)
    for model in models:
        results.append(validate_v2(model, valid_products))
        results.append(validate_v3(model, valid_indices))
        results.append(validate_v4(model, valid_products, valid_indices))
        results.append(validate_v5(model, valid_products))
        results.append(validate_v6(model, valid_products))
        results.append(validate_v7(model))
        results.append(validate_v8(model))
        results.append(validate_v9(model))
        results.append(validate_v10(model))
        results.append(validate_v11(model))
        results.append(validate_v12(model))

    return results
