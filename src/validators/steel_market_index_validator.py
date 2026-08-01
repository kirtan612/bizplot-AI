from typing import Any, List, Union
from datetime import date
from decimal import Decimal

from src.schemas.steel_market_index import SteelMarketIndexModel, ChangeReason
from src.validators.base import ValidationResult


def validate_v1(models: List[SteelMarketIndexModel]) -> List[ValidationResult]:
    """V1: No duplicate (effective_date, region_label) pair."""
    results = []
    pairs = [(m.effective_date, m.region_label) for m in models]
    duplicate_pairs = {p for p in pairs if pairs.count(p) > 1}
    
    for model in models:
        pair = (model.effective_date, model.region_label)
        is_dup = pair in duplicate_pairs
        results.append(ValidationResult(
            rule_id="V1",
            passed=not is_dup,
            message=f"Duplicate effective_date and region_label found for date {model.effective_date}" if is_dup else "No duplicate (effective_date, region_label) pair.",
            row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
        ))
    return results


def validate_v2(model: SteelMarketIndexModel) -> ValidationResult:
    """V2: regional_rate_per_kg < national_rate_per_kg, and regional discount is within 5.00% to 12.00%."""
    passed = True
    message = "Regional rate discount is within standard 5% to 12% range."
    
    nat = model.national_rate_per_kg
    reg = model.regional_rate_per_kg

    if nat <= Decimal("0.00"):
        passed = False
        message = "National rate must be greater than zero to check discount."
    elif reg >= nat:
        passed = False
        message = f"Regional rate ({reg}) is not strictly less than national rate ({nat})."
    else:
        discount = Decimal("1.00") - (reg / nat)
        # Check within 5% to 12% inclusive. Use rounded checks to avoid precision noise (e.g. 5 decimal places)
        lower_bound = Decimal("0.05")
        upper_bound = Decimal("0.12")
        
        # We can round discount to 4 decimal places for comparison
        discount_rounded = round(discount, 4)
        if not (lower_bound <= discount_rounded <= upper_bound):
            passed = False
            pct = discount * Decimal("100.00")
            message = f"Regional discount of {pct:.2f}% is outside the allowed 5.00%–12.00% range."

    return ValidationResult(
        rule_id="V2",
        passed=passed,
        message=message,
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_v3(model: SteelMarketIndexModel) -> ValidationResult:
    """V3: Rate values within plausible range."""
    passed = True
    message = "Index rates are within plausible range."
    
    nat = model.national_rate_per_kg
    reg = model.regional_rate_per_kg

    # National range: [45.00, 70.00]
    # Regional range: [40.00, 65.00]
    if not (Decimal("45.00") <= nat <= Decimal("70.00")):
        passed = False
        message = f"National rate {nat} is outside plausible range [45.00, 70.00]."
    elif not (Decimal("40.00") <= reg <= Decimal("65.00")):
        passed = False
        message = f"Regional rate {reg} is outside plausible range [40.00, 65.00]."

    return ValidationResult(
        rule_id="V3",
        passed=passed,
        message=message,
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_v4_batch(models: List[SteelMarketIndexModel]) -> List[ValidationResult]:
    """V4: change_reason required if week-over-week rate movement exceeds 8.00%."""
    results = []
    
    # Sort models chronologically
    sorted_models = sorted(models, key=lambda m: m.effective_date)
    
    for idx, model in enumerate(sorted_models):
        passed = True
        message = "Week-over-week rate change is within standard limits or has a valid explanation."
        
        if idx > 0:
            prev = sorted_models[idx - 1]
            # Verify they represent consecutive entries in the series (e.g. within 14 days)
            days_diff = (model.effective_date - prev.effective_date).days
            if days_diff <= 14:
                pct_change_nat = abs((model.national_rate_per_kg - prev.national_rate_per_kg) / prev.national_rate_per_kg)
                pct_change_reg = abs((model.regional_rate_per_kg - prev.regional_rate_per_kg) / prev.regional_rate_per_kg)
                
                limit = Decimal("0.08")
                # Round to 4 decimals to avoid float/decimal conversion issues
                if round(pct_change_nat, 4) > limit or round(pct_change_reg, 4) > limit:
                    if model.change_reason == ChangeReason.NONE or model.change_reason == "None":
                        passed = False
                        message = (
                            f"Week-over-week rate change exceeds 8.00% (National: {pct_change_nat*100:.2f}%, "
                            f"Regional: {pct_change_reg*100:.2f}%), but change_reason is set to 'None'."
                        )
        
        results.append(ValidationResult(
            rule_id="V4",
            passed=passed,
            message=message,
            row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
        ))
        
    return results


def validate_v5(model: SteelMarketIndexModel) -> ValidationResult:
    """V5: Rate values must be positive decimals."""
    passed = model.national_rate_per_kg > Decimal("0.00") and model.regional_rate_per_kg > Decimal("0.00")
    return ValidationResult(
        rule_id="V5",
        passed=passed,
        message="Rates are positive." if passed else "Rates must be strictly greater than zero.",
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_v6(model: SteelMarketIndexModel) -> ValidationResult:
    """V6: region_label must be exactly 'Raipur/CG'."""
    passed = model.region_label.strip() == "Raipur/CG"
    return ValidationResult(
        rule_id="V6",
        passed=passed,
        message="Region label is correct." if passed else f"Invalid region_label: '{model.region_label}' (must be 'Raipur/CG').",
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_v7(model: SteelMarketIndexModel) -> ValidationResult:
    """V7: source_type must be exactly 'Mill Offer Tracking'."""
    passed = model.source_type.strip() == "Mill Offer Tracking"
    return ValidationResult(
        rule_id="V7",
        passed=passed,
        message="Source type is correct." if passed else f"Invalid source_type: '{model.source_type}' (must be 'Mill Offer Tracking').",
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_v8(model: SteelMarketIndexModel) -> ValidationResult:
    """V8: Date chronology check (effective_date not in the future)."""
    passed = model.effective_date <= date.today()
    return ValidationResult(
        rule_id="V8",
        passed=passed,
        message="Effective date is not in the future." if passed else f"Effective date {model.effective_date} is in the future.",
        row_reference={"index_id": str(model.index_id), "effective_date": str(model.effective_date)}
    )


def validate_batch(rows: List[Union[dict, SteelMarketIndexModel]]) -> List[ValidationResult]:
    """Validate a batch of Steel Market Index records against all business rules."""
    models: List[SteelMarketIndexModel] = []
    results: List[ValidationResult] = []

    # 1. Parse and validate schemas
    for idx, row in enumerate(rows):
        if isinstance(row, SteelMarketIndexModel):
            models.append(row)
        else:
            try:
                model = SteelMarketIndexModel(**row)
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

    # 3. Run chronological batch checks (V4)
    results.extend(validate_v4_batch(models))

    # 4. Run row-level checks (V2, V3, V5, V6, V7, V8)
    for model in models:
        results.append(validate_v2(model))
        results.append(validate_v3(model))
        results.append(validate_v5(model))
        results.append(validate_v6(model))
        results.append(validate_v7(model))
        results.append(validate_v8(model))

    return results
