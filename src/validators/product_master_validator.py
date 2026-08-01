from typing import Any, List, Union
from decimal import Decimal
import re

from src.schemas.product_master import ProductMasterModel, Brand, Category, Shape, WeightClass
from src.validators.base import ValidationResult
from src.utils.formulas import (
    calculate_weight_per_meter,
    generate_product_code,
    ROUND_SIZES,
    HOLLOW_THICKNESS,
    parse_hollow_size
)


def validate_v1(models: List[ProductMasterModel]) -> List[ValidationResult]:
    """V1: No duplicate product_code."""
    results = []
    codes = [m.product_code for m in models]
    duplicate_codes = {c for c in codes if codes.count(c) > 1}
    
    for model in models:
        is_dup = model.product_code in duplicate_codes
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate product_code found: {model.product_code}" if is_dup else "No duplicate product_code.",
            row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
        ))
    return results


def validate_v2(model: ProductMasterModel) -> ValidationResult:
    """V2: Size must exist in standard list for shape+standard."""
    shape = model.shape
    size = model.size
    wc = model.weight_class
    passed = True
    message = "Size is valid for shape and standard."

    if shape == Shape.ROUND:
        if (size, wc) not in ROUND_SIZES:
            passed = False
            message = f"Size '{size}' with class '{wc}' not found in standard IS1239 round pipe dimensions."
    elif shape in (Shape.SQUARE, Shape.RECTANGLE):
        normalized_hollow_thickness = {(k.lower(), c): v for (k, c), v in HOLLOW_THICKNESS.items()}
        if (size.lower(), wc) not in normalized_hollow_thickness:
            passed = False
            message = f"Size '{size}' with class '{wc}' not found in standard IS4923 hollow section dimensions."

    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message=message,
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v3(model: ProductMasterModel) -> ValidationResult:
    """V3: Weight class valid for standard (Light/Medium/Heavy)."""
    # Enforced by Pydantic Enum, but checked here as a business rule.
    passed = model.weight_class in (WeightClass.LIGHT, WeightClass.MEDIUM, WeightClass.HEAVY)
    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message="Weight class is valid." if passed else f"Invalid weight class: {model.weight_class}",
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v4(model: ProductMasterModel) -> ValidationResult:
    """V4: Weight must match engineering formula within ±5% tolerance."""
    passed = True
    message = "Weight per meter matches engineering formula within tolerance."
    
    try:
        calc_w = calculate_weight_per_meter(model.shape, model.size, model.weight_class)
        stored_w = float(model.weight_per_meter)
        deviation = abs(stored_w - calc_w) / calc_w
        if deviation > 0.05:
            passed = False
            message = (
                f"Weight per meter ({stored_w:.3f}) deviates from calculated formula "
                f"weight ({calc_w:.3f}) by {deviation * 100:.2f}%, exceeding ±5% tolerance."
            )
    except Exception as e:
        passed = False
        message = f"Weight calculation failed: {str(e)}"

    return ValidationResult(
        rule_id="V4",
        passed=passed,
        message=message,
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v5(model: ProductMasterModel) -> ValidationResult:
    """V5: Brand must support category (Local Mills cannot supply GP)."""
    passed = True
    message = "Brand supports category."
    
    if model.brand == Brand.LOCAL_MILLS and model.category == Category.GP:
        passed = False
        message = f"Local Mills is not capable of supplying GP products."

    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message=message,
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v6(model: ProductMasterModel) -> ValidationResult:
    """V6: GST must equal 18.00."""
    passed = model.gst == Decimal("18.00")
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="GST rate is correct (18.00%)." if passed else f"Invalid GST rate: {model.gst} (must be 18.00%)",
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v7(model: ProductMasterModel) -> ValidationResult:
    """V7: HSN must be 7306 for every row."""
    passed = model.hsn_code == "7306"
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="HSN code is correct (7306)." if passed else f"Invalid HSN code: {model.hsn_code} (must be '7306')",
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v8(model: ProductMasterModel) -> ValidationResult:
    """V8: Shape/size dimensionality match (Square W==H, Rectangle W!=H, Round size pattern)."""
    passed = True
    message = "Shape matches size dimensions."
    shape = model.shape
    size = model.size

    try:
        if shape == Shape.ROUND:
            if not re.match(r"^\d+NB$", size):
                passed = False
                message = f"Round shape must have size in 'NB' format (e.g. '50NB'). Got: '{size}'"
        elif shape == Shape.SQUARE:
            w, h = parse_hollow_size(size)
            if w != h:
                passed = False
                message = f"Square shape must have equal width and height. Got size: '{size}'"
        elif shape == Shape.RECTANGLE:
            w, h = parse_hollow_size(size)
            if w == h:
                passed = False
                message = f"Rectangle shape must have unequal width and height. Got size: '{size}'"
    except Exception as e:
        passed = False
        message = f"Dimensionality check failed: {str(e)}"

    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message=message,
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v9(model: ProductMasterModel) -> ValidationResult:
    """V9: product_code must be regenerable from attributes."""
    passed = True
    message = "Product code is regenerable."
    
    try:
        generated = generate_product_code(
            brand=model.brand,
            category=model.category,
            shape=model.shape,
            weight_class=model.weight_class,
            size=model.size,
            length=float(model.length)
        )
        if model.product_code != generated:
            passed = False
            message = f"Stored code '{model.product_code}' does not match regenerated code '{generated}'."
    except Exception as e:
        passed = False
        message = f"Code regeneration failed: {str(e)}"

    return ValidationResult(
        rule_id="V9",
        passed=passed,
        message=message,
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_v10(model: ProductMasterModel) -> ValidationResult:
    """V10: active cannot be null."""
    passed = model.active is not None
    return ValidationResult(
        rule_id="V10",
        passed=passed,
        message="Active flag is valid." if passed else "Active flag is null.",
        row_reference={"product_id": str(model.product_id), "product_code": model.product_code}
    )


def validate_batch(rows: List[Union[dict, ProductMasterModel]]) -> List[ValidationResult]:
    """Validate a batch of Product Master records against all business rules."""
    models: List[ProductMasterModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, ProductMasterModel):
            models.append(row)
        else:
            try:
                model = ProductMasterModel(**row)
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

    # 3. Run row-level checks (V2 - V10)
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

    return results
