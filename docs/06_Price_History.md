# 06_Price_History.md

**Module**: Price History
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Purchase and Sales Registers reference it
**Depends on**: 01_Product_Master, 05_Steel_Market_Index
**Depended on by**: Purchase Register, Sales Register (both reference this table to find standard list rates on transaction dates)

---

## 1. Overview

Price History maintains the record of **product-level prices over time**. Rather than having transactional pricing be independently randomized or hardcoded, this table records the historical base selling prices (₹/kg) and purchase costs (₹/kg) for each product SKU defined in [01_Product_Master.md](file:///e:/bizplot/docs/01_Product_Master.md).

Crucially, individual product price records are not independently sampled. Each product's price history is deterministically derived from the [05_Steel_Market_Index.md](file:///e:/bizplot/docs/05_Steel_Market_Index.md) base rate for its category, adjusted by premiums/discounts linked to its brand tier, weight class, and section size. This table serves as the official standard price list that transaction registers use to check pricing compliance and calculate margins.

---

## 2. Business Purpose

**Why this table exists**
- Establishes standard price lists with specific effective dates, so procurement and sales operations have a common benchmark cost and price on any transaction date.
- Coordinates price volatility across all 150 SKUs, ensuring that when the raw steel market moves, individual product prices shift in tandem rather than drifting randomly.
- Separates physical product master attributes (weight, class) from time-varying pricing configurations (multipliers, margins).
- Provides the baseline cost and price records needed to analyze contract compliance: "Did a sales representative sell this pipe below the standard selling rate, or did a procurement officer buy it above the standard purchase rate?"

**How it is used**
- Purchase Register: when generating a purchase, the system looks up the product's `standard_purchase_rate` valid on the transaction date to compare with the supplier's actual quoted invoice rate.
- Sales Register: when generating a sale, the system looks up the product's `standard_selling_rate` valid on the transaction date to calculate the default invoice price.
- Future AI models: standard price history acts as the temporal baseline to model demand elasticity, margin capture, and discount optimization.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `price_id` | UUID | Yes | System-generated unique identifier, primary key | `prc-a1b2c3d4-...` |
| `product_id` | UUID | Yes | Foreign key referencing Product Master | `a1b2c3d4-...` |
| `product_code` | String | Yes | Human-readable code copied from Product Master | `HTP-GI-RD-MED-50NB-6M` |
| `effective_date` | Date | Yes | Date from which the pricing record is valid | `2024-04-01` |
| `index_id` | UUID | Yes | Foreign key to Steel Market Index row representing the benchmark baseline on `effective_date` | `idx-a1b2c3d4-...` |
| `base_market_rate` | Decimal(8,2) | Yes | Category base rate (₹/kg) from Steel Market Index on `effective_date` (copied for audit traceability) | `78.00` |
| `brand_premium_pct` | Decimal(5,2) | Yes | Percentage premium/discount applied based on product brand | `2.00` |
| `class_premium_pct` | Decimal(5,2) | Yes | Percentage adjustment applied based on weight class | `0.00` |
| `size_premium_pct` | Decimal(5,2) | Yes | Percentage adjustment applied based on size dimensions | `0.00` |
| `standard_selling_rate` | Decimal(8,2) | Yes | Derived standard selling list price in ₹/kg (Section 4 formula) | `79.56` |
| `standard_purchase_rate` | Decimal(8,2) | Yes | Derived expected procurement cost in ₹/kg (Section 4 formula) | `74.79` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

*Note: Engineering fields like `weight_per_meter`, `gst`, and `hsn_code` are not duplicated here; they must always be read from Product Master via `product_id`.*

---

## 4. Business Rules

1. **exogenous Pricing Baseline**: Every product's price record must reference a valid `index_id` from Steel Market Index (05) where `index_date = effective_date`. The product's category (`GI`, `MS`, `GP`) determines which category-level index rate is used as the `base_market_rate`.
2. **Standard Selling Rate Formula**: The list price is calculated as:
   $$\text{standard\_selling\_rate} = \text{base\_market\_rate} \times \left(1 + \frac{\text{brand\_premium\_pct}}{100}\right) \times \left(1 + \frac{\text{class\_premium\_pct}}{100}\right) \times \left(1 + \frac{\text{size\_premium\_pct}}{100}\right)$$
3. **Brand-Specific Premiums (fixed multipliers)**:
   - `APL Apollo` (Tier 1 premium brand): +5.0% selling premium (`brand_premium_pct = 5.00`)
   - `Hi-Tech` (Tier 2 standard brand): +2.0% selling premium (`brand_premium_pct = 2.00`)
   - `Local Mills` (Tier 3 economy/unbranded): -3.0% selling discount (`brand_premium_pct = -3.00`)
4. **Weight Class Adjustments**:
   - `Light` (LT): +2.0% premium (thinner walls require more rolling process effort per ton).
   - `Medium` (MED): 0.0% adjustment (baseline product).
   - `Heavy` (HVY): -1.0% discount (higher weight-to-effort ratio).
5. **Size-Specific Premiums**:
   - Standard domestic sizes (`15NB` to `50NB` round, `20X20` to `50X50` hollow sections): 0.0% adjustment.
   - Large or less common structural sizes (`100NB` round, `40X20` or larger rectangle sections): +3.0% premium (`size_premium_pct = 3.00`).
6. **Standard Purchase Rate (target margin discount)**:
   - The distributor buys inventory at a discount from the selling list price to capture wholesale margin:
     $$\text{standard\_purchase\_rate} = \text{standard\_selling\_rate} \times \left(1 - \frac{\text{target\_margin\_pct}}{100}\right)$$
   - The default `target_margin_pct` is brand-specific to reflect vendor agreements:
     - `APL Apollo`: 5% margin discount (`target_margin_pct = 5.00`)
     - `Hi-Tech`: 6% margin discount (`target_margin_pct = 6.00`)
     - `Local Mills`: 8% margin discount (`target_margin_pct = 8.00`)
7. **Cadence Alignment**: A new set of pricing records for all active products is generated for every date on which the Steel Market Index is updated (weekly cadence).
8. **Temporal Continuity**: A product's standard prices are valid starting on their `effective_date` and remain effective until replaced by a newer record for the same product.
9. **No Override of Physical Constants**: Prices are strictly set per kilogram (₹/kg). Piece pricing is a downstream transactional calculation:
   $$\text{Price per Piece} = \text{Rate per kg} \times \text{length (from Product Master)} \times \text{weight\_per\_meter (from Product Master)}$$
10. **Audit Trail Snapshots**: `base_market_rate` and the individual premiums are stored explicitly on each row rather than dynamically joined, ensuring that historic price logs remain immutable even if baseline index algorithms are adjusted retroactively.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique product-effective date | Two rows share `product_id` and `effective_date` |
| V2 | Base market rate match | `base_market_rate` deviates from the corresponding category's `base_rate_per_kg` on `effective_date` in Steel Market Index |
| V3 | Brand premium matching | `brand_premium_pct` does not match the product's brand tier rules (+5% for APL, +2% for Hi-Tech, -3% for Local Mills) |
| V4 | Weight class premium matching | `class_premium_pct` does not match weight class rules (+2% for Light, 0% for Medium, -1% for Heavy) |
| V5 | Size premium matching | `size_premium_pct` is not exactly `0.00` or `3.00` based on size classification list |
| V6 | Selling rate formula match | `standard_selling_rate` deviates >±0.05 from the formula: `base_market_rate * (1 + brand_premium/100) * (1 + class_premium/100) * (1 + size_premium/100)` |
| V7 | Purchase rate margin constraint | `standard_purchase_rate >= standard_selling_rate` (expected margin baseline is negative or zero) |
| V8 | Effective date constraint | `effective_date` is after current generation date |
| V9 | Non-zero price rates | `standard_selling_rate <= 0` or `standard_purchase_rate <= 0` |
| V10 | Index mapping integrity | `index_id` refers to a non-existent row in Steel Market Index |

---

## 6. Relationships

```
Product Master (01)
      │
      ├──(via product_id)
      ▼
Price History (06)   ◄──(via index_id / effective_date)── Steel Market Index (05)
      │
      ├──→ Purchase Register (07)  (provides the baseline standard purchase cost on invoice date)
      │
      └──→ Sales Register (09)     (provides the baseline standard selling rate on invoice date)
```

**Upstream Dependencies**:
- [01_Product_Master.md](file:///e:/bizplot/docs/01_Product_Master.md): Provides the target product list, brand, weight class, category, and dimensions.
- [05_Steel_Market_Index.md](file:///e:/bizplot/docs/05_Steel_Market_Index.md): Provides the date context, index identifier, and category base wholesale rates.

---

## 7. Generation Rules

1. **Volume**: Generate a complete set of price records for all active products in Product Master (135–150 SKUs) for each weekly update in Steel Market Index. For a single financial year (52 weeks), this yields:
   $$\text{Total Rows} = 150 \text{ products} \times 52 \text{ weeks} = 7,800 \text{ price records}$$
2. **Generation Cadence**: Synchronize `effective_date` with `index_date` from the weekly Steel Market Index table. Do not insert mid-week pricing rows unless a market-index shock occurs.
3. **Multiplier Assignment**:
   - Query Product Master to resolve each SKU's `brand`, `weight_class`, and `size`.
   - Apply the deterministic rules in Section 4 to write the percentage fields: `brand_premium_pct`, `class_premium_pct`, and `size_premium_pct`.
4. **Rate Calculations**: Calculate `standard_selling_rate` and `standard_purchase_rate` to two decimal places using the formula math in Section 4. Keep the target purchase margin consistent with the brand:
   - APL Apollo: 5.00%
   - Hi-Tech: 6.00%
   - Local Mills: 8.00%
5. **Inactive products**: Do not generate new pricing records for products where `active = false` in the Product Master on or after the deactivation date.

---

## 8. Sample Records

*Illustrative records showing the price history of selected products over consecutive weeks:*

| effective_date | product_code | base_market_rate | brand_premium_pct | class_premium_pct | size_premium_pct | standard_selling_rate | standard_purchase_rate |
|---|---|---|---|---|---|---|---|
| 2024-04-01 | APL-GI-RD-MED-15NB-6M | 78.00 | 5.00 | 0.00 | 0.00 | 81.90 | 77.81 |
| 2024-04-01 | HTP-GI-RD-MED-50NB-6M | 78.00 | 2.00 | 0.00 | 0.00 | 79.56 | 74.79 |
| 2024-04-01 | LOC-GI-RD-MED-15NB-6M | 78.00 | -3.00 | 0.00 | 0.00 | 75.66 | 69.61 |
| 2024-04-01 | HTP-GI-RD-LT-32NB-6M | 78.00 | 2.00 | 2.00 | 0.00 | 81.15 | 76.28 |
| 2024-04-01 | HTP-MS-SQ-MED-50X50-6M | 68.00 | 2.00 | 0.00 | 0.00 | 69.36 | 65.20 |
| 2024-04-01 | APL-MS-RECT-MED-40X20-6M | 68.00 | 5.00 | 0.00 | 3.00 | 73.54 | 69.86 |
| 2024-04-08 | APL-GI-RD-MED-15NB-6M | 78.80 | 5.00 | 0.00 | 0.00 | 82.74 | 78.60 |
| 2024-04-08 | HTP-GI-RD-MED-50NB-6M | 78.80 | 2.00 | 0.00 | 0.00 | 80.38 | 75.56 |
| 2024-04-08 | LOC-GI-RD-MED-15NB-6M | 78.80 | -3.00 | 0.00 | 0.00 | 76.44 | 70.32 |
| 2024-04-08 | HTP-GI-RD-LT-32NB-6M | 78.80 | 2.00 | 2.00 | 0.00 | 81.98 | 77.06 |
| 2024-04-08 | HTP-MS-SQ-MED-50X50-6M | 68.75 | 2.00 | 0.00 | 0.00 | 70.13 | 65.92 |
| 2024-04-08 | APL-MS-RECT-MED-40X20-6M | 68.75 | 5.00 | 0.00 | 3.00 | 74.35 | 70.63 |

*(`price_id`, `product_id`, `index_id`, and tracking timestamps are omitted from this preview table for readability. All rates are in ₹/kg. Selling and purchase rates are calculated dynamically from `base_market_rate` and the corresponding premium/discount percentages.)*

*Note: The records in the table above are illustrative and do not represent verified production constants. Generator processes must run the exact business rule formulas.*

---

## 9. Future AI Use Cases

- **Dynamic Price Optimization**: Feed historical selling prices and customer transaction volumes into reinforcement learning algorithms to optimize class and size premiums, maximizing total revenue.
- **Cost Arbitrage Modeling**: Correlate purchase rate history with supplier quotes in the Purchase Register to predict optimal buying opportunities (hedging when spot prices are below standard expectations).
- **Price Elasticity Profiling**: Measure the impact of price change events on customer purchase volumes by product category to calculate price elasticity parameters.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-08-01 | Kiro AI | Initial Price History BRS — established the product-level price derivation formula, brand premiums (+5%/+2%/-3%), weight class adjustments (+2%/0%/-1%), size premiums (+3%), and target margins (5%/6%/8%). |

**Open items to confirm before this is locked:**
1. **Pricing cadences**: Weekly pricing updates are proposed to match the weekly Steel Market Index frequency. Confirm if you prefer this or a lower cadence (e.g. monthly list prices).
2. **Brand premiums and discounts**: Confirm if the proposed premium multipliers (+5% for APL Apollo, +2% for Hi-Tech, -3% for Local Mills) match target trade relationships.
3. **Distributor margin baselines**: Confirm if the default wholesale purchase margins (5% APL Apollo, 6% Hi-Tech, 8% Local Mills) are aligned with actual procurement objectives.
4. **Size premiums list**: Confirm if the +3% size premium should apply to all non-standard rectangle profiles, or if we should define a stricter subset.
