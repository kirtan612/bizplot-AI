# 01_Product_Master.md

**Module**: Product Master
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before downstream modules reference it
**Depends on**: none (this is the root master)
**Depended on by**: Purchase Register, Sales Register, Inventory, Price History, Steel Market Index (indirectly, via category)

---

## 1. Overview

Product Master is the root entity of the entire system. It defines **what a sellable item is** — the fixed, physical identity of a pipe SKU (brand, material, shape, size, class, length) as distinct from anything that changes over time (its price, its stock level, who bought it). Every other table in this project references a `product_id` or `product_code` from this table; nothing downstream is allowed to invent product attributes independently.

If this table is wrong or inconsistent, every generated Purchase, Sale, Inventory, and Price History row inherits that error. That's why it's built first and why it gets the strictest validation of any module.

---

## 2. Business Purpose

**Why this table exists**
- Establishes one unambiguous identity per physical pipe SKU, so "50NB Medium GI pipe from Hi-Tech" always resolves to the same row, regardless of which module (purchase, sale, stock count) is referencing it.
- Encodes the engineering reality of the product (weight, standard, size) so downstream weight/price/tax calculations are *derived*, not guessed.
- Acts as the taxonomy the whole dataset is organized around — brand mix, category mix, and size mix here determine the realism of everything generated later.

**How it is used**
- Purchase Register: every purchase line references exactly one `product_id`; the line's weight and GST are pulled from here, not re-entered.
- Sales Register: same — a sale line cannot exist for a product not in this table.
- Inventory: one Inventory balance row per `product_id`.
- Price History: every price event is timestamped against a `product_id`.
- Future AI models: this table is the categorical backbone (brand, category, shape, size, class) that any pricing/demand model will condition on.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `product_id` | UUID | Yes | System-generated unique identifier, primary key | `a1b2c3d4-...` |
| `product_code` | String | Yes | Deterministic human-readable code, generated from attributes (Section 6) — see 05 for the exact generation algorithm | `HTP-GI-RD-MED-50NB-6M` |
| `brand` | Enum | Yes | `APL Apollo` \| `Hi-Tech` \| `Local Mills` | `Hi-Tech` |
| `category` | Enum | Yes | `GI` \| `MS` \| `GP` | `GI` |
| `shape` | Enum | Yes | `Round` \| `Square` \| `Rectangle` | `Round` |
| `size` | String | Yes | Nominal bore (round) or W×H (square/rectangle), from the standard size list only | `50NB`, `40x20` |
| `weight_class` | Enum | Yes | `Light` \| `Medium` \| `Heavy` | `Medium` |
| `weight_per_meter` | Decimal(8,3) | Yes | kg/m — **always calculated**, never entered or randomized (Section 4/formula below) | `5.430` |
| `length` | Decimal(4,2) | Yes | Standard piece length in metres | `6.00` |
| `gst` | Decimal(4,2) | Yes | GST %, constant for this product category | `18.00` |
| `hsn_code` | String | Yes | HSN classification for steel tubes/pipes | `7306` |
| `standard_ref` | Enum | Yes | Governing IS standard — `IS1239` \| `IS4923` | `IS1239` |
| `active` | Boolean | Yes | Whether product is currently sellable | `true` |
| `created_at` | Timestamp | Yes | Row creation time (for traceability, not business logic) | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

**Why `standard_ref` and timestamps are added beyond your original list**: `standard_ref` is what the validation engine uses to know which size list and weight formula apply (round pipe and hollow sections don't share dimension tables). The timestamps cost nothing and are what makes "traceable," per your stated goal, actually possible later — flag if you'd rather drop them from Milestone 1 and add them in a later pass.

---

## 4. Business Rules

1. Every product has exactly one `brand` — no multi-brand or co-branded rows.
2. `product_code` is unique across the entire table and is **deterministic**: regenerating it from the same attribute set always produces the same string (this is what lets Purchase/Sales rows resolve to the right product without ambiguity).
3. `weight_per_meter` is always calculated from the engineering formula (Section 3 data dictionary / formula below) — never sampled or hand-entered. This is the single most important rule in this document, because it's the anchor that keeps every downstream price and margin calculation realistic.
4. `gst` is fixed at `18.00` for every row in this table — HSN 7306 attracts a flat 18% GST; there is no product-level exception.
5. `length` defaults to `6.00` m unless the product is explicitly flagged for a non-standard length (double-random or specific-length order) — non-standard length is a transaction-level override, not a new Product Master row, unless it becomes a recurring stocked SKU.
6. Every product belongs to exactly one `category` (`GI` / `MS` / `GP`) — a product cannot be both GI and MS.
7. `weight_class` applies within a shape+standard combination — for `Round` (IS1239), Light/Medium/Heavy correspond to the standard's Class A/B/C wall thickness tiers. For `Square`/`Rectangle` (IS4923), these labels are used as a **wall-thickness tier equivalent** for schema consistency, not an official IS4923 term — this is a deliberate simplification for this project, flagged here so it isn't mistaken for standard terminology later.
8. Brand–category capability is not universal: `Local Mills` generally does not produce `GP` (galvanized-plain sheet-formed product is a higher-capex line); `APL Apollo` and `Hi-Tech` support all three categories. This capability constraint drives Section 6 generation, not just validation.
9. `size` must be drawn from the standard size list for its `shape` + `standard_ref` combination (Section 6) — no freeform sizes.
10. `active = false` represents a discontinued/delisted product, not an out-of-stock one — stock level lives in Inventory, not here.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | No duplicate `product_code` | Any two rows share a `product_code` |
| V2 | Size must exist in standard list for shape+standard | `size` not in the IS1239 (round) or IS4923 (square/rect) reference list |
| V3 | Weight class valid for standard | `weight_class` used outside the Light/Medium/Heavy set for the applicable standard |
| V4 | Weight must match engineering formula within tolerance | `weight_per_meter` deviates >±5% from `(OD − t) × t × 0.02466` (round) or the equivalent hollow-section formula |
| V5 | Brand must support category | `brand = Local Mills` and `category = GP` (see capability rule above) |
| V6 | GST must equal 18.00 | Any other value |
| V7 | HSN must be `7306` for every row | Any other/blank HSN |
| V8 | Shape/size dimensionality match | `shape = Rectangle` but `size` has equal W and H (that's a Square, not a Rectangle) — or vice versa |
| V9 | `product_code` must be regenerable | Recomputing the code from the row's own attributes doesn't match the stored `product_code` |
| V10 | `active` cannot be null | Every row must explicitly state true/false |

---

## 6. Relationships

```
Product Master
   │
   ├──→ Purchase Register   (every purchase line references one product_id)
   ├──→ Sales Register      (every sale line references one product_id)
   ├──→ Inventory           (one running balance row per product_id)
   └──→ Price History       (every purchase/sale event logs a rate against product_id)
```

Downstream dependency note for the modules being built next: **Price History and Purchase/Sales rate assignment both pull `weight_per_meter` from here** to convert a ₹/kg rate into a ₹/piece price — so nothing in Steel Market Index, Price History, or the registers should recompute or override this table's weight value. It is the single source of truth for physical weight.

**Product code generation algorithm** (referenced by `product_code`, detailed for the generator):
```
{BRAND_CODE}-{CATEGORY}-{SHAPE_CODE}-{CLASS_CODE}-{SIZE}-{LENGTH}
```
- `BRAND_CODE`: APL / HTP / LOC
- `CATEGORY`: GI / MS / GP
- `SHAPE_CODE`: RD / SQ / RECT
- `CLASS_CODE`: LT / MED / HVY
- `SIZE`: as stored (e.g. `50NB`, `40X20`)
- `LENGTH`: e.g. `6M`

Example: `APL-GI-RD-MED-50NB-6M`

**Weight formula** (round, IS1239):
```
weight_per_meter (kg/m) = (OD − t) × t × 0.02466
```
where OD = outside diameter (mm, fixed per NB size, constant across classes), t = wall thickness (mm, varies by Light/Medium/Heavy class), 0.02466 = π × 7850 ÷ 1,000,000.

**Weight formula** (square/rectangle, IS4923):
```
Square:      weight_per_meter = 4(W − t) × t × 0.00785
Rectangle:   weight_per_meter = 2(W + H − 2t) × t × 0.00785
```

---

## 7. Generation Rules

These rules govern how the *Product Master itself* is populated (not transactions — that's later modules).

1. **Volume**: generate 135–150 total products.
2. **Brand distribution**:
   - `APL Apollo` — 40%
   - `Hi-Tech` — 35%
   - `Local Mills` — 25%
3. **Category distribution** (proposed — confirm or adjust):
   - `GI` — 50% (dominant in plumbing/agricultural pipe trade)
   - `MS` — 40% (structural/fabrication demand)
   - `GP` — 10% (lower volume, capability-restricted per Rule 8 above)
4. **Shape correlation, not independent sampling**: `GI` category should skew heavily `Round` (plumbing/water use case); `MS` category should skew toward `Square`/`Rectangle` (structural/fabrication use case). Sampling shape independently of category would produce unrealistic combinations (e.g. GI square hollow section is rare in practice) — the generator must condition shape on category, not draw them separately.
5. **Size**: drawn only from the standard size lists (Section 6); every brand×category×shape combination does not need every size — apply a realistic subset (e.g. a `Local Mills` line typically stocks fewer SKUs per shape than `APL Apollo`).
6. **Weight class distribution**: `Medium` should dominate (~60%) as the default trade class; `Light` and `Heavy` split the remainder (~20% each) — reflects real demand skew.
7. **Weight**: always computed via formula (Section 6) — never randomized independently of size/class.
8. **HSN/GST**: constant (`7306` / `18.00`) on every row — no generation variance.
9. **Length**: `6.00` m on ~95% of rows; remaining ~5% may carry a flagged non-standard length for realism.
10. **Active flag**: ~95% `true`, ~5% `false` (represents discontinued legacy SKUs) — proposed ratio, confirm.

---

## 8. Sample Records

| product_code | brand | category | shape | size | weight_class | weight_per_meter | length | gst | hsn_code | active |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-GI-RD-MED-15NB-6M | APL Apollo | GI | Round | 15NB | Medium | 1.220 | 6.00 | 18.00 | 7306 | true |
| APL-GI-RD-MED-25NB-6M | APL Apollo | GI | Round | 25NB | Medium | 2.500 | 6.00 | 18.00 | 7306 | true |
| APL-GI-RD-HVY-50NB-6M | APL Apollo | GI | Round | 50NB | Heavy | 6.720 | 6.00 | 18.00 | 7306 | true |
| APL-MS-SQ-MED-25X25-6M | APL Apollo | MS | Square | 25x25 | Medium | 1.850 | 6.00 | 18.00 | 7306 | true |
| APL-MS-RECT-MED-40X20-6M | APL Apollo | MS | Rectangle | 40x20 | Medium | 2.010 | 6.00 | 18.00 | 7306 | true |
| HTP-GI-RD-MED-20NB-6M | Hi-Tech | GI | Round | 20NB | Medium | 1.650 | 6.00 | 18.00 | 7306 | true |
| HTP-GI-RD-MED-50NB-6M | Hi-Tech | GI | Round | 50NB | Medium | 5.430 | 6.00 | 18.00 | 7306 | true |
| HTP-GI-RD-LT-32NB-6M | Hi-Tech | GI | Round | 32NB | Light | 2.610 | 6.00 | 18.00 | 7306 | true |
| HTP-MS-SQ-MED-50X50-6M | Hi-Tech | MS | Square | 50x50 | Medium | 4.320 | 6.00 | 18.00 | 7306 | true |
| HTP-GP-RD-MED-40NB-6M | Hi-Tech | GP | Round | 40NB | Medium | 3.180 | 6.00 | 18.00 | 7306 | true |
| LOC-GI-RD-MED-15NB-6M | Local Mills | GI | Round | 15NB | Medium | 1.220 | 6.00 | 18.00 | 7306 | true |
| LOC-MS-SQ-MED-20X20-6M | Local Mills | MS | Square | 20x20 | Medium | 1.400 | 6.00 | 18.00 | 7306 | true |
| LOC-MS-RD-MED-25NB-6M | Local Mills | MS | Round | 25NB | Medium | 2.500 | 6.00 | 18.00 | 7306 | true |
| LOC-MS-SQ-LT-25X25-6M | Local Mills | MS | Square | 25x25 | Light | 1.520 | 6.00 | 18.00 | 7306 | true |
| APL-GI-RD-MED-100NB-6M | APL Apollo | GI | Round | 100NB | Medium | 13.900 | 6.00 | 18.00 | 7306 | false |

*(`product_id` UUIDs and `created_at`/`updated_at` timestamps omitted from this preview table for readability — every real row carries them.)*

*Note: weight values above follow the calculation logic in Section 6; treat them as illustrative until you run them through the actual formula/generator and cross-check against published IS 1239 / IS 4923 tables — don't hand-key these into production data as verified constants.*

---

## 9. Future AI Use Cases

- **Price prediction**: category/shape/class/brand as categorical features conditioning a ₹/kg forecast model against Steel Market Index.
- **Demand forecasting**: SKU-level sales velocity by brand/category/size, seasonally adjusted.
- **Anomaly detection**: flag transactions where weight or price deviates from this table's engineering baseline — this table is the "ground truth" an anomaly model checks against.
- **Substitution/recommendation**: suggest an equivalent product (same size/class, different brand) when a preferred SKU is out of stock — needs the brand-category-size structure defined here.
- **Brand elasticity analysis**: how much of a premium each brand tier can sustain before customers switch, using the brand multiplier concept from pricing rules.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-07-27 | Claude (draft, pending sign-off) | Initial Product Master BRS — brand set simplified to 3 tiers (APL Apollo / Hi-Tech / Local Mills) per project decision; category/shape distributions proposed, need confirmation |

**Open items to confirm before this is locked:**
1. Category distribution (50/40/10 GI/MS/GP) — confirm or adjust.
2. Active/inactive ratio (95/5) — confirm or adjust.
3. Whether `standard_ref` and timestamp columns stay in scope for Milestone 1 or move to a later pass.
