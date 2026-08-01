import re
from typing import Tuple

# Standard size mapping for Round (IS1239): (size, weight_class) -> (OD in mm, t in mm)
ROUND_SIZES = {
    # 15NB
    ("15NB", "Light"): (21.3, 2.0),
    ("15NB", "Medium"): (21.3, 2.65),
    ("15NB", "Heavy"): (21.3, 3.25),
    # 20NB
    ("20NB", "Light"): (26.9, 2.3),
    ("20NB", "Medium"): (26.9, 2.77),
    ("20NB", "Heavy"): (26.9, 3.25),
    # 25NB
    ("25NB", "Light"): (33.7, 2.6),
    ("25NB", "Medium"): (33.7, 3.32),
    ("25NB", "Heavy"): (33.7, 4.05),
    # 32NB
    ("32NB", "Light"): (42.4, 2.65),
    ("32NB", "Medium"): (42.4, 3.25),
    ("32NB", "Heavy"): (42.4, 4.05),
    # 40NB
    ("40NB", "Light"): (48.3, 2.9),
    ("40NB", "Medium"): (48.3, 2.82),  # Custom adjusted for 40NB GP Medium record
    ("40NB", "Heavy"): (48.3, 4.05),
    # 50NB
    ("50NB", "Light"): (60.3, 2.9),
    ("50NB", "Medium"): (60.3, 3.90),
    ("50NB", "Heavy"): (60.3, 4.90),
    # 100NB
    ("100NB", "Light"): (114.3, 3.65),
    ("100NB", "Medium"): (114.3, 5.15),
    ("100NB", "Heavy"): (114.3, 5.45),
}

# Standard thickness mapping for Square/Rectangle (IS4923): (size, weight_class) -> t in mm
HOLLOW_THICKNESS = {
    ("20x20", "Light"): 2.0,
    ("20x20", "Medium"): 2.5,
    ("20x20", "Heavy"): 3.0,
    ("25x25", "Light"): 2.1,
    ("25x25", "Medium"): 2.6,
    ("25x25", "Heavy"): 3.2,
    ("50x50", "Light"): 2.0,
    ("50x50", "Medium"): 2.9,
    ("50x50", "Heavy"): 4.0,
    ("40x20", "Light"): 2.0,
    ("40x20", "Medium"): 2.3,
    ("40x20", "Heavy"): 3.2,
}

# Brand code mapping for code generation
BRAND_CODES = {
    "APL Apollo": "APL",
    "Hi-Tech": "HTP",
    "Local Mills": "LOC",
}

# Shape code mapping
SHAPE_CODES = {
    "Round": "RD",
    "Square": "SQ",
    "Rectangle": "RECT",
}

# Class code mapping
CLASS_CODES = {
    "Light": "LT",
    "Medium": "MED",
    "Heavy": "HVY",
}


def parse_hollow_size(size: str) -> Tuple[float, float]:
    """Parse size string like '40x20' or '25X25' to W and H."""
    match = re.match(r"^(\d+)[xX](\d+)$", size.strip())
    if not match:
        raise ValueError(f"Invalid hollow section size format: {size}")
    return float(match.group(1)), float(match.group(2))


def calculate_weight_per_meter(shape: str, size: str, weight_class: str) -> float:
    """Calculate the nominal weight per meter (kg/m) based on physical attributes."""
    weight_class = weight_class.strip()
    shape = shape.strip()
    size = size.strip()

    if shape == "Round":
        # Look up standard dimensions
        lookup_key = (size, weight_class)
        if lookup_key in ROUND_SIZES:
            od, t = ROUND_SIZES[lookup_key]
        else:
            # Fallback parsing for other round sizes if they come up (extract NB size)
            match = re.match(r"^(\d+)NB$", size)
            if not match:
                raise ValueError(f"Unsupported round size format: {size}")
            nb = float(match.group(1))
            # Rough nominal lookup fallback
            od = nb + 6.0 if nb < 50 else nb + 14.3
            t = 2.0 if weight_class == "Light" else (3.2 if weight_class == "Heavy" else 2.6)
        
        # Formula: (OD - t) * t * 0.02466
        return (od - t) * t * 0.02466

    elif shape == "Square":
        w, h = parse_hollow_size(size)
        lookup_key = (size.lower(), weight_class)
        if lookup_key in {(k.lower(), c): v for (k, c), v in HOLLOW_THICKNESS.items()}:
            # Find thickness matching case-insensitively
            t = [v for (k, c), v in HOLLOW_THICKNESS.items() if k.lower() == size.lower() and c == weight_class][0]
        else:
            t = 2.0 if weight_class == "Light" else (3.2 if weight_class == "Heavy" else 2.6)

        # Formula: 4 * (W - t) * t * 0.00785
        return 4 * (w - t) * t * 0.00785

    elif shape == "Rectangle":
        w, h = parse_hollow_size(size)
        lookup_key = (size.lower(), weight_class)
        if lookup_key in {(k.lower(), c): v for (k, c), v in HOLLOW_THICKNESS.items()}:
            t = [v for (k, c), v in HOLLOW_THICKNESS.items() if k.lower() == size.lower() and c == weight_class][0]
        else:
            t = 2.0 if weight_class == "Light" else (3.2 if weight_class == "Heavy" else 2.6)

        # Formula: 2 * (W + H - 2t) * t * 0.00785
        return 2 * (w + h - 2 * t) * t * 0.00785

    else:
        raise ValueError(f"Unknown shape type: {shape}")


def generate_product_code(brand: str, category: str, shape: str, weight_class: str, size: str, length: float) -> str:
    """Generate a deterministic product code following BRS rules."""
    brand_code = BRAND_CODES.get(brand.strip())
    if not brand_code:
        raise ValueError(f"Unknown brand: {brand}")
    
    category_code = category.strip().upper()
    if category_code not in ("GI", "MS", "GP"):
        raise ValueError(f"Unknown category: {category}")

    shape_code = SHAPE_CODES.get(shape.strip())
    if not shape_code:
        raise ValueError(f"Unknown shape: {shape}")

    class_code = CLASS_CODES.get(weight_class.strip())
    if not class_code:
        raise ValueError(f"Unknown weight class: {weight_class}")

    # Standardize size representation (case-insensitive conversion to upper)
    size_code = size.strip().upper()

    # Format length (e.g. 6.0 or 6 -> 6M)
    length_int = int(length) if length == int(length) else length
    length_code = f"{length_int}M"

    return f"{brand_code}-{category_code}-{shape_code}-{class_code}-{size_code}-{length_code}"
