from typing import Any, Dict, List, Optional, Union
from datetime import date
from decimal import Decimal

from src.schemas.inventory import InventoryModel
from src.validators.base import ValidationResult


def validate_v1(models: List[InventoryModel]) -> List[ValidationResult]:
    """V1: Unique (snapshot_date, product_id) pair."""
    results = []
    pairs = [(m.snapshot_date, str(m.product_id)) for m in models]
    duplicate_pairs = {p for p in pairs if pairs.count(p) > 1}
    
    for model in models:
        pair = (model.snapshot_date, str(model.product_id))
        is_dup = pair in duplicate_pairs
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate (snapshot_date, product_id) pair found for product {model.product_code}" if is_dup else "No duplicate (snapshot_date, product_id) pair.",
            row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
        ))
    return results


def validate_v2(model: InventoryModel, valid_products: Optional[Dict[str, Any]] = None) -> ValidationResult:
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
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v3(model: InventoryModel) -> ValidationResult:
    """V3: opening_qty_pcs >= 0, purchased_qty_pcs >= 0, sold_qty_pcs >= 0, closing_qty_pcs >= 0."""
    passed = (
        model.opening_qty_pcs >= 0 and
        model.purchased_qty_pcs >= 0 and
        model.sold_qty_pcs >= 0 and
        model.closing_qty_pcs >= 0
    )
    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message="Stock quantities are non-negative." if passed else "Stock quantities must be non-negative (>= 0).",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v4(model: InventoryModel) -> ValidationResult:
    """V4: opening_weight_kg >= 0, purchased_weight_kg >= 0, sold_weight_kg >= 0, closing_weight_kg >= 0."""
    passed = (
        model.opening_weight_kg >= Decimal("0.00") and
        model.purchased_weight_kg >= Decimal("0.00") and
        model.sold_weight_kg >= Decimal("0.00") and
        model.closing_weight_kg >= Decimal("0.00")
    )
    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message="Stock weights are non-negative." if passed else "Stock weights must be non-negative (>= 0).",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v5(model: InventoryModel) -> ValidationResult:
    """V5: closing_qty_pcs == opening_qty_pcs + purchased_qty_pcs - sold_qty_pcs."""
    expected = model.opening_qty_pcs + model.purchased_qty_pcs - model.sold_qty_pcs
    passed = (model.closing_qty_pcs == expected)
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Closing piece quantity math is correct." if passed else f"Closing quantity {model.closing_qty_pcs} does not match expected formula result {expected}.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v6(model: InventoryModel) -> ValidationResult:
    """V6: closing_weight_kg == opening_weight_kg + purchased_weight_kg - sold_weight_kg."""
    expected = round(model.opening_weight_kg + model.purchased_weight_kg - model.sold_weight_kg, 2)
    passed = abs(model.closing_weight_kg - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Closing weight math is correct." if passed else f"Closing weight {model.closing_weight_kg} does not match expected formula result {expected}.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v7(model: InventoryModel) -> ValidationResult:
    """V7: unit_cost_per_kg > 0."""
    passed = model.unit_cost_per_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Unit cost per kg is positive." if passed else "Unit cost per kg must be strictly greater than zero.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v8(model: InventoryModel) -> ValidationResult:
    """V8: inventory_valuation == closing_weight_kg * unit_cost_per_kg."""
    expected = round(model.closing_weight_kg * model.unit_cost_per_kg, 2)
    passed = abs(model.inventory_valuation - expected) <= Decimal("0.01")
    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message="Inventory valuation math is correct." if passed else f"Inventory valuation {model.inventory_valuation} does not match expected result {expected}.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v9(model: InventoryModel) -> ValidationResult:
    """V9: reorder_level_pcs >= 0."""
    passed = model.reorder_level_pcs >= 0
    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message="Reorder level is non-negative." if passed else f"Reorder level {model.reorder_level_pcs} is negative.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v10(model: InventoryModel) -> ValidationResult:
    """V10: reorder_flag == (closing_qty_pcs <= reorder_level_pcs)."""
    expected = (model.closing_qty_pcs <= model.reorder_level_pcs)
    passed = (model.reorder_flag == expected)
    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message="Reorder flag logic is correct." if passed else f"Reorder flag is {model.reorder_flag}, but closing_qty ({model.closing_qty_pcs}) vs reorder_level ({model.reorder_level_pcs}) expects {expected}.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v11(model: InventoryModel) -> ValidationResult:
    """V11: snapshot_date is not in the future."""
    passed = model.snapshot_date <= date.today()
    return ValidationResult(
        rule_id="V11",
        passed=passed,
        message="Snapshot date is not in the future." if passed else f"Snapshot date {model.snapshot_date} is in the future.",
        row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
    )


def validate_v12_batch(models: List[InventoryModel]) -> List[ValidationResult]:
    """V12: Cross-snapshot continuity check (opening of T == closing of T-1)."""
    results = []
    
    # Group by product_id
    by_product: Dict[str, List[InventoryModel]] = {}
    for m in models:
        pid = str(m.product_id)
        by_product.setdefault(pid, []).append(m)

    for pid, prod_models in by_product.items():
        sorted_pm = sorted(prod_models, key=lambda x: x.snapshot_date)
        for idx, model in enumerate(sorted_pm):
            passed = True
            message = "Cross-snapshot continuity is valid."
            
            if idx > 0:
                prev = sorted_pm[idx - 1]
                if model.opening_qty_pcs != prev.closing_qty_pcs:
                    passed = False
                    message = f"Opening quantity ({model.opening_qty_pcs}) on {model.snapshot_date} does not match previous closing quantity ({prev.closing_qty_pcs}) on {prev.snapshot_date}."
                elif abs(model.opening_weight_kg - prev.closing_weight_kg) > Decimal("0.01"):
                    passed = False
                    message = f"Opening weight ({model.opening_weight_kg}) on {model.snapshot_date} does not match previous closing weight ({prev.closing_weight_kg}) on {prev.snapshot_date}."

            results.append(ValidationResult(
                rule_id="V12",
                passed=passed,
                message=message,
                row_reference={"inventory_id": str(model.inventory_id), "product_code": model.product_code, "snapshot_date": str(model.snapshot_date)}
            ))

    return results


def validate_batch(
    rows: List[Union[dict, InventoryModel]],
    valid_products: Optional[Dict[str, Any]] = None
) -> List[ValidationResult]:
    """Validate a batch of Inventory records against all business rules."""
    models: List[InventoryModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, InventoryModel):
            models.append(row)
        else:
            try:
                model = InventoryModel(**row)
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

    # 2. Run batch checks (V1, V12)
    results.extend(validate_v1(models))
    results.extend(validate_v12_batch(models))

    # 3. Run row-level checks (V2 - V11)
    for model in models:
        results.append(validate_v2(model, valid_products))
        results.append(validate_v3(model))
        results.append(validate_v4(model))
        results.append(validate_v5(model))
        results.append(validate_v6(model))
        results.append(validate_v7(model))
        results.append(validate_v8(model))
        results.append(validate_v9(model))
        results.append(validate_v10(model))
        results.append(validate_v11(model))

    return results
