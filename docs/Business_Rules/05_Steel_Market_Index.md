# 05_Steel_Market_Index.md

**Module**: Steel Market Index
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v2.0 — pending your sign-off before Price History and transaction registers reference it
**Depends on**: none (this is the root pricing reference, independent of all other database entities)
**Depended on by**: 06_Price_History (every product price is derived as a premium/discount from this index)

---

## 1. Overview

Steel Market Index is the **pricing foundation** for the entire transactional pipeline. It defines the weekly reference base rate (₹/kg) for steel raw materials (HR coil) across two separate tracks: a national reference rate and a Raipur/Chhattisgarh regional reference rate.

In India, there is no continuously-traded domestic steel futures market comparable to MCX gold. Instead, wholesale prices are set by mill announcements and tracked by market-intelligence services (e.g., SteelMint, Tata nexarc, BigMint). Therefore, this index represents a periodically-updated reference rate (updated weekly) reflecting mill-offer tracking. 

Rather than defining per-product finished pipe prices, this table produces the raw material benchmark cost. The downstream [06_Price_History.md](file:///e:/bizplot/docs/Business_Rules/06_Price_History.md) module then references these rates to compute the standard list prices for individual SKUs based on brand, category, shape, and class.

---

## 2. Business Purpose

**Why this table exists**
- Establishes the time-series backbone for all transactional pricing, ensuring that purchase and sales rates drift realistically over time rather than jumping randomly.
- Encodes regional pricing structures: local/Raipur-produced materials trade at a persistent discount to national branded reference HRC prices.
- Explains macroeconomic volatility: index movements are driven by concrete, explainable factors (iron ore costs, coking coal spikes, safeguard duties, seasonal demand).
- Provides a counterfactual baseline for margin analysis: allows the system to compare transactional buying/selling rates against the wholesale market index.

**How it is used**
- Price History: looks up the active index rates on the `effective_date` to derive standard SKU-level selling and purchase rates.
- AI Forecasting Models: serves as the exogenous time-series input to forecast future steel pricing cycles.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `index_id` | UUID | Yes | System-generated unique identifier, primary key | `idx-a1b2c3d4-...` |
| `effective_date` | Date | Yes | Date on which the index reference rates are active (weekly cadence) | `2026-06-01` |
| `national_rate_per_kg` | Decimal(8,2) | Yes | Broader national market reference price for HR coil in ₹/kg | `56.50` |
| `regional_rate_per_kg` | Decimal(8,2) | Yes | Regional reference price for Raipur/Chhattisgarh in ₹/kg | `50.50` |
| `region_label` | String | Yes | Regional identifier, constant value `"Raipur/CG"` | `Raipur/CG` |
| `source_type` | String | Yes | Source of tracking data, constant value `"Mill Offer Tracking"` | `Mill Offer Tracking` |
| `change_reason` | Enum | Yes | Primary cause of rate change: `Raw Material Cost` \| `Import Duty Change` \| `Seasonal Construction Demand` \| `Chinese Pricing Pressure` \| `Other` \| `None` | `Raw Material Cost` |
| `created_at` | Timestamp | Yes | Row creation time (timezone-aware UTC) | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time (timezone-aware UTC) | `2026-07-27T10:00:00Z` |

*Note: All currency values are strictly in INR (₹/kg). No foreign currencies are modeled.*

---

## 4. Business Rules

1. **Update Frequency**: The index must be updated on a strict **weekly cadence** (exactly one record per calendar week, synchronizing the national and regional rates).
2. **Persistent Regional Spread**: The Raipur regional rate must always trade at a discount to the broader national reference rate to reflect actual market margins. The discount must be constrained to a band between **5.00% and 12.00%** below the national rate:
   $$0.05 \le 1 - \frac{\text{regional\_rate\_per\_kg}}{\text{national\_rate\_per\_kg}} \le 0.12$$
3. **Weekly Rate Ceiling**: Week-over-week rate changes for both national and regional tracks must not exceed **8.00%** under standard market conditions:
   $$\left| \frac{\text{rate(T)} - \text{rate(T-1)}}{\text{rate(T-1)}} \right| \le 0.08$$
   If a week-over-week change exceeds 8.00%, it is treated as a market shock and requires an explicit `change_reason` other than `None` (e.g. `Import Duty Change` or `Raw Material Cost` coking coal spikes).
4. **Rate Floor**: All rates must be strictly positive decimals (> 0.00). No zero or negative reference prices are allowed.
5. **Home Base Alignment**: The regional rate tracks `"Raipur/CG"`, which aligns with the sourcing base for `Local Mills` products in this project.
6. **Exogenous Independence**: The index represents raw material input costs and depends on nothing else in the project. It does not reference product, customer, or supplier master files.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique Date-Region | More than one row shares the same `effective_date` and `region_label` |
| V2 | Regional Rate Discount | `regional_rate_per_kg >= national_rate_per_kg`, or the regional discount falls outside the 5.00%–12.00% range |
| V3 | Plausible Price Bounds | `national_rate_per_kg` is outside the ₹45.00–₹70.00 range, or `regional_rate_per_kg` is outside the ₹40.00–₹65.00 range (violating 2026 market limits) |
| V4 | Rate Change Reason Mandatory | Week-over-week rate change exceeds $\pm 8.00\%$ but `change_reason` is set to `None` |
| V5 | Strictly Positive Rates | `national_rate_per_kg <= 0.00` or `regional_rate_per_kg <= 0.00` |
| V6 | Region Label Constants | `region_label` is not exactly `"Raipur/CG"` |
| V7 | Source Type Constants | `source_type` is not exactly `"Mill Offer Tracking"` |
| V8 | Date Chronology check | `effective_date` is in the future relative to the transaction generation windows |

---

## 6. Relationships

```
┌──────────────────────────┐
│    Steel Market Index    │
└──────────────────────────┘
             │
             ▼ (effective_date, index_id)
┌──────────────────────────┐
│      Price History       │
└──────────────────────────┘
```

This module is the starting node of the pricing hierarchy. It has no upstream dependencies in the project. Price History (06) references `index_id` and `effective_date` to split products into base rates plus brand/class adjustments.

---

## 7. Generation Rules

1. **Time series Generation**: The index is generated sequentially as a random walk with drift:
   $$\text{rate(T)} = \text{rate(T-1)} \times (1 + \mu + \epsilon_T)$$
   Where:
   - $\mu = +0.05\%$ representing a weekly inflationary drift.
   - $\epsilon_T \sim N(0, 0.015)$ represents weekly market noise (1.50% standard deviation).
2. **Spread Constraint**: Generate the national rate first using the random walk model. The regional rate is then generated by applying a discount factor sampled uniformly from $[8.00\%, 11.00\%]$ to ensure it remains well within the 5.00%–12.00% validation boundaries.
3. **Shock Injections**: Inject 1–2 policy or cost shocks per financial year where $\epsilon_T$ is manually set to a large value (e.g. +10.00% representing late 2025 import safeguard duties). Set the corresponding `change_reason` to `Import Duty Change` or `Raw Material Cost` respectively.
4. **Reproducibility**: Seed the random number generator at the start of index generation to ensure reproducible runs.

---

## 8. Sample Records

*Illustrative records showing weekly index tracking, regional Raipur discount, and a market shock in Week 8:*

| effective_date | national_rate_per_kg | regional_rate_per_kg | region_label | source_type | change_reason |
|---|---|---|---|---|---|
| 2026-04-01 | 56.00 | 50.40 | Raipur/CG | Mill Offer Tracking | None |
| 2026-04-08 | 56.50 | 50.85 | Raipur/CG | Mill Offer Tracking | None |
| 2026-04-15 | 56.30 | 50.67 | Raipur/CG | Mill Offer Tracking | None |
| 2026-04-22 | 55.80 | 50.22 | Raipur/CG | Mill Offer Tracking | None |
| 2026-04-29 | 55.40 | 49.86 | Raipur/CG | Mill Offer Tracking | None |
| 2026-05-06 | 55.20 | 49.40 | Raipur/CG | Mill Offer Tracking | None |
| 2026-05-13 | 54.90 | 49.00 | Raipur/CG | Mill Offer Tracking | None |
| 2026-05-20 | 60.50 | 54.45 | Raipur/CG | Mill Offer Tracking | Import Duty Change |
| 2026-05-27 | 60.80 | 54.72 | Raipur/CG | Mill Offer Tracking | None |
| 2026-06-03 | 60.40 | 54.00 | Raipur/CG | Mill Offer Tracking | None |
| 2026-06-10 | 59.80 | 53.20 | Raipur/CG | Mill Offer Tracking | None |
| 2026-06-17 | 59.20 | 52.60 | Raipur/CG | Mill Offer Tracking | None |

*(`index_id` UUIDs and created/updated timestamps are omitted from this preview table for readability. All rates are in ₹/kg. Week 8 (2026-05-20) shows a +10.20% rate increase caused by import tariffs, triggering a mandatory change_reason).*

*Note: The rate data above is illustrative and does not represent verified production constants. Generator processes must execute the random walk equations.*

---

## 9. Future AI Use Cases

- **Steel Price Forecasting**: Train LSTM or ARIMA models on this historical index to forecast national HRC rates over a rolling 1-month window, using change reasons as categorical shock indicators.
- **Exogenous Volatility Mapping**: Quantify the impact of raw material and policy shocks on downstream finished pipe rates to model company profit margin risks.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 2.0 | 2026-08-01 | Kiro AI | Updated Steel Market Index BRS — introduced dual rate tracks (National/Regional), weekly update cadences, persistent 5-12% Raipur discounts, WoW ceiling checks, and shock-related validation constraints. |

**Open items to confirm before this is locked:**
1. **Update Cadence**: Confirm if the weekly index update cadence is preferred over daily or monthly references.
2. **Plausible Bounds**: Confirm if the ₹45.00–₹70.00 national rate range represents a standard business cycle boundary for your forecasting models.
3. **Raipur Spread**: Confirm if the 5.00%–12.00% discount spread for local Raipur/CG steel aligns with target local mill distributions.
