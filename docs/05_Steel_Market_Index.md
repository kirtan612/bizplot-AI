# 05_Steel_Market_Index.md

**Module**: Steel Market Index
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Price History and Purchase/Sales Register reference it
**Depends on**: 01_Product_Master (category enum only, not per-product)
**Depended on by**: 06_Price_History (every price event is a delta from this baseline), 07_Purchase_Register, 09_Sales_Register (pricing logic references this)

---

## 1. Overview

Steel Market Index is the **pricing foundation** for the entire dataset. It defines the daily/weekly base rate (₹/kg) for each product category (`GI`, `MS`, `GP`) over time, representing the wholesale/spot market reference price that all purchase and sales pricing derives from.

This is **not a per-product price list** — it's a category-level benchmark rate that fluctuates with raw steel commodity prices (HR coil, CR coil, zinc for GI coating). Individual product prices in Price History are calculated as:

```
product_rate (₹/kg) = market_index_rate (₹/kg for that category on that date)
                      × brand_multiplier
                      × weight_class_multiplier
                      ± shape/size adjustment
```

This table exists so that:
- Price volatility is realistic (correlated within a category, not independently randomized per product).
- Purchase and sales rates move in tandem with a common underlying market signal (when steel prices rise, all GI products' rates rise proportionally).
- Future AI models can condition pricing on an external market factor, not just internal transaction history.

---

## 2. Business Purpose

**Why this table exists**
- Establishes the time-series backbone for all pricing — instead of randomly sampling prices per transaction, every purchase/sale rate is **derived** from this market index at the transaction date, ensuring temporal coherence (prices drift gradually, not jump randomly).
- Reflects real-world steel commodity price cycles: HR/CR coil prices fluctuate based on iron ore costs, global demand, tariffs, seasonal construction cycles. This table models that macro factor.
- Decouples the "market signal" from individual supplier/customer negotiations: the index is the same for all players; supplier tier, customer size, and brand tier then apply multipliers to get specific transaction rates.
- Provides a counterfactual baseline for margin analysis: "How much better/worse than market rate did we buy/sell this product at?" requires a market rate definition — this table is that.

**How it is used**
- Price History: every time a product's price changes, the Price History row stores both the actual ₹/kg rate and a reference to the `market_index_id` (or date) so the rate can later be decomposed into market_rate × multipliers.
- Purchase Register: when generating a purchase line, the rate is calculated from the market index for that product's category on the purchase date, adjusted by supplier tier and brand.
- Sales Register: same, adjusted by customer size and product brand/class.
- Future pricing models: the index is the exogenous variable (independent of your transactions) that any demand/margin model conditions on.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `index_id` | UUID | Yes | System-generated unique identifier, primary key | `idx-a1b2c3d4-...` |
| `index_date` | Date | Yes | Market rate observation date | `2024-04-01` |
| `category` | Enum | Yes | Product category (`GI` \| `MS` \| `GP`) | `GI` |
| `base_rate_per_kg` | Decimal(8,2) | Yes | Wholesale market rate in ₹/kg for this category on this date | `72.50` |
| `rate_change_pct` | Decimal(5,2) | No | Percentage change from previous observation (calculated field for analysis) | `+1.25` |
| `volatility_flag` | Enum | No | `Stable` \| `Moderate` \| `High` — indicator of how much the rate moved (±1% = stable, ±1-3% = moderate, >±3% = high) | `Stable` |
| `notes` | String | No | Optional annotation for unusual rate movements (e.g., "Post-budget import duty hike") | `Festive season demand spike` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

**Key design choice: category-level only, not product-level**: GI, MS, and GP have correlated but distinct price drivers (GI includes zinc coating cost; MS is driven by HR coil; GP is driven by CR coil + galvanizing). A single "steel price" index would be too coarse; per-product (150 SKUs) would be too granular and unrealistic (market traders quote category rates, not SKU rates). Category-level is the right middle ground.

---

## 4. Business Rules

1. **One row per category per date**: for any given `index_date`, there can be at most one row per category (`GI`, `MS`, `GP`). You cannot have two different market rates for GI on the same date — that would be a data error.

2. **Chronological continuity**: the index should have observations at regular intervals (daily, weekly, or bi-weekly) across the financial year. Gaps of >7–14 days without an observation are unusual and should be flagged (markets don't go silent for weeks unless there's a holiday/lockdown, which should be noted).

3. **Category rate correlation, not independence**: GI, MS, and GP rates are correlated (all driven by underlying iron ore/scrap costs) but not identical. GI typically trades at a premium to MS (coating cost), and GP is between the two or similar to GI depending on specification. The generator should not sample these three independently per date — they should drift together with realistic spreads.

4. **Realistic volatility**: steel commodity prices are volatile but not chaotic. Day-to-day changes of >5% are rare (happens maybe 3–5 times a year during major market shocks). Typical daily variance is ±0.5–2%. The generator should model this with a mean-reverting drift process, not uniform random jumps.

5. **Seasonal patterns** (optional realism enhancement): construction demand peaks in Oct–Feb (post-monsoon, pre-summer); agricultural pipe demand (GI) peaks in Mar–Jun (irrigation season). Introducing a mild seasonal trend would add realism, but it's not mandatory for Milestone 1 — list as an optional enhancement in Change Log.

6. **Base rate floor/ceiling**: realistic steel pipe rates in India (as of 2024–2026) are roughly:
   - **MS**: ₹60–80/kg (base range, depends on global HRC prices)
   - **GI**: ₹70–90/kg (MS base + ₹8–12/kg coating premium)
   - **GP**: ₹68–88/kg (depends on CR coil + galvanizing cost, typically between MS and GI)
   
   Generator should keep rates within ±20% of these midpoints unless you provide alternate reference prices.

7. **Rate_change_pct is derived, not input**: this is calculated as `(current_rate - previous_rate) / previous_rate × 100`. It's not a generator input — it's computed after rates are generated for time-series analysis.

8. **Volatility_flag is derived**: calculated from `rate_change_pct` using the thresholds in the data dictionary (±1% = Stable, ±1–3% = Moderate, >±3% = High).

9. **Notes are optional and sparse**: most days have `notes = null`. Only annotate unusual events (rate spike, policy change, major demand shift) — maybe 5–10 notes across a full FY, not daily commentary.

10. **No retroactive changes**: once a market index row is created for a date, it should not be updated (markets don't "revise" spot prices after the fact). Any correction should be a new row or flagged as a data error.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique date-category pair | Two rows share the same `index_date` and `category` |
| V2 | Category must be valid | `category` not in `{GI, MS, GP}` |
| V3 | Base rate positive | `base_rate_per_kg <= 0` |
| V4 | Base rate within realistic range | `base_rate_per_kg < 40` or `> 120` (implausibly low/high for steel pipe market) |
| V5 | Rate change percent match | If `rate_change_pct` is not null, recalculating from previous date's rate yields >±0.5% deviation (rounding tolerance) |
| V6 | Volatility flag match | `volatility_flag` does not match the category derived from `rate_change_pct` thresholds |
| V7 | Chronological order | Inserting a row with `index_date` earlier than existing rows without a documented backfill reason |
| V8 | Future date rejection | `index_date` is after the current generation date (you can't have market rates for dates that haven't occurred yet) |
| V9 | Gap detection | >14 consecutive calendar days without an observation for a category (warn, not reject — could be valid during extended shutdowns, but should be reviewed) |
| V10 | GI-MS spread check | On the same date, `GI.base_rate_per_kg < MS.base_rate_per_kg` (GI should generally be at a premium; if not, flag for review) |

---

## 6. Relationships

```
Steel Market Index
   │
   ├──→ Price History        (every price_history row references a market index
   │                           date or carries a market_rate snapshot so the
   │                           product rate can be decomposed into market_rate × multipliers)
   │
   ├──→ Purchase Register    (purchase line rates are calculated from the market
   │                           index for the product's category on purchase_date,
   │                           not stored/referenced directly but used as a pricing input)
   │
   └──→ Sales Register       (same — sales line rates derive from market index + customer tier adjustments)
```

**Key dependency note**: Price History (06) is the **only table that directly references this table** via a foreign key or date join. Purchase Register (07) and Sales Register (09) use the market index **during generation** as a pricing input but do not store a foreign key to it — they derive their rates and store the final ₹/kg value. This keeps Purchase/Sales tables self-contained (you can read a purchase rate without joining to the index) while maintaining pricing realism (the rate was calculated from a market baseline, not randomly sampled).

**No upstream dependency on Product Master rows**: this table only references Product Master's category enum (`GI`, `MS`, `GP`), not individual `product_id` values. The index is category-level, not SKU-level.

---

## 7. Generation Rules

1. **Time span**: generate observations for the full financial year `FY 2024-25` (April 1, 2024 to March 31, 2025) at minimum. If Purchase/Sales transactions span beyond March 31, 2025, extend the index to cover that period (e.g., through July 27, 2026 if transactions run to current date).

2. **Observation frequency**: **weekly** (every 7 days) is the proposed cadence. Daily would be more realistic but generates 3× the rows (365 days × 3 categories = 1,095 rows for one FY vs ~156 rows for weekly). Weekly is a good balance for Milestone 1. Flag if you want daily granularity.

3. **Category coverage**: generate observations for all three categories (`GI`, `MS`, `GP`) on the same dates — the index should be synchronized across categories (you observe all three markets on the same day).

4. **Starting rates** (April 1, 2024, proposed baseline):
   - `MS`: ₹68.00/kg (mid-range for 2024 market)
   - `GI`: ₹78.00/kg (MS + ₹10 coating premium)
   - `GP`: ₹75.00/kg (between MS and GI)

5. **Drift model**: use a **mean-reverting random walk** for rate generation:
   - Each week, rate changes by a normally distributed percentage: `Δ% ~ N(μ, σ)`
   - Mean `μ = 0%` (no long-term trend up or down, just oscillation) or `μ = +0.1%/week` (mild inflationary drift)
   - Std dev `σ = 1.5%` (moderate volatility)
   - Apply a mean-reversion factor: if the rate is >10% above the starting baseline, bias the next change downward (and vice versa if it's dropped >10% below).

6. **Category correlation**: GI, MS, and GP rates should move together but not identically. Model this as:
   - Generate the `MS` rate first using the drift model.
   - `GI` rate = `MS rate + premium`, where premium drifts around ₹9–11/kg (coating cost is relatively stable but can vary ±10%).
   - `GP` rate = weighted average of MS and GI, or use a similar drift with slightly different volatility.

7. **Volatility events** (inject 3–5 high-volatility weeks across the FY for realism):
   - Randomly select 3–5 weeks where `σ` is doubled (to ~3%) to simulate market shocks (e.g., post-budget duty changes, global steel price spike, major demand surge).
   - These should be spread across the year, not clustered in one month.

8. **Seasonality** (optional, mark as future enhancement if not implemented in v1.0):
   - Oct–Feb: +2–3% seasonal bump (peak construction)
   - Mar–Jun: +1–2% for GI only (irrigation demand)
   - Jul–Sep (monsoon): -2–3% dip (construction slowdown)

9. **Rate_change_pct and volatility_flag**: compute after all rates are generated — don't sample these independently.

10. **Notes**: leave null for >90% of rows. Add notes for the 3–5 high-volatility weeks (e.g., "Post-budget import duty hike", "Festive season demand spike", "Global HRC price drop").

---

## 8. Sample Records

| index_date | category | base_rate_per_kg | rate_change_pct | volatility_flag | notes |
|---|---|---|---|---|---|
| 2024-04-01 | MS | 68.00 | null | null | FY 2024-25 opening rate |
| 2024-04-01 | GI | 78.00 | null | null | FY 2024-25 opening rate |
| 2024-04-01 | GP | 75.00 | null | null | FY 2024-25 opening rate |
| 2024-04-08 | MS | 68.75 | +1.10 | Moderate | null |
| 2024-04-08 | GI | 78.80 | +1.03 | Moderate | null |
| 2024-04-08 | GP | 75.60 | +0.80 | Stable | null |
| 2024-04-15 | MS | 69.20 | +0.65 | Stable | null |
| 2024-04-15 | GI | 79.50 | +0.89 | Stable | null |
| 2024-04-15 | GP | 76.10 | +0.66 | Stable | null |
| 2024-04-22 | MS | 68.90 | -0.43 | Stable | null |
| 2024-04-22 | GI | 79.00 | -0.63 | Stable | null |
| 2024-04-22 | GP | 75.80 | -0.39 | Stable | null |
| 2024-05-20 | MS | 72.40 | +3.85 | High | Post-budget customs duty adjustment |
| 2024-05-20 | GI | 82.70 | +3.72 | High | Post-budget customs duty adjustment |
| 2024-05-20 | GP | 79.50 | +3.68 | High | Post-budget customs duty adjustment |
| 2024-10-14 | MS | 74.20 | +2.15 | Moderate | Festive season demand spike |
| 2024-10-14 | GI | 84.80 | +2.05 | Moderate | Festive season demand spike |
| 2024-10-14 | GP | 81.30 | +2.10 | Moderate | Festive season demand spike |

*(`index_id`, `created_at`, `updated_at` timestamps omitted from preview table for readability — every real row carries them.)*

*Note: Rates and volatility events above are illustrative. Generator must implement the drift model and correlation logic described in Section 7, not copy these specific values verbatim.*

---

## 9. Future AI Use Cases

- **Price forecasting**: train a time-series model (ARIMA, LSTM) on this index to predict future category rates, which then feeds into purchase planning and margin optimization.
- **Margin decomposition**: decompose every purchase/sale into `(market_rate) × (brand_multiplier) × (customer/supplier_tier_multiplier)` to identify where margin is won or lost (did we pay above market? did we sell below market?).
- **Volatility hedging**: identify high-volatility periods and simulate the impact of fixed-price contracts vs spot pricing on margin stability.
- **Procurement timing optimization**: detect mean-reversion patterns (buy when index dips below trend, delay purchases when index spikes above trend).
- **Category mix strategy**: if GI margin is consistently better than MS margin (driven by their relative index movements), optimize inventory mix toward GI.
- **External signal integration**: future versions could join this index to real external data (World Bank commodity prices, MCX steel futures) to validate realism or replace synthetic data with actual market rates.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-07-27 | Kiro AI | Initial Steel Market Index BRS — weekly observation frequency proposed, mean-reverting drift model with 1.5% weekly volatility proposed, starting rates (MS ₹68, GI ₹78, GP ₹75) proposed for April 2024 baseline |

**Open items to confirm before this is locked:**
1. **Observation frequency**: weekly proposed (52 weeks × 3 categories = ~156 rows per FY) — confirm or switch to daily (~365 days × 3 = ~1,095 rows).
2. **Time span**: FY 2024-25 (April 1, 2024 to March 31, 2025) minimum — confirm, or specify if index should extend beyond March 2025 to cover transaction dates through July 2026.
3. **Starting rates** (April 1, 2024): MS ₹68, GI ₹78, GP ₹75 — confirm or provide alternate baseline rates.
4. **Drift model parameters**: mean μ = 0% (no trend) or +0.1%/week (mild inflation), std dev σ = 1.5% — confirm or adjust.
5. **Seasonality**: marked as optional future enhancement (not implemented in v1.0) — confirm you're OK deferring this, or specify you want seasonal patterns included now.
6. **Volatility event count**: 3–5 high-volatility weeks per FY proposed — confirm or adjust.
7. **GI-MS premium range**: ₹9–11/kg proposed (coating cost) — confirm or adjust based on actual market knowledge.
