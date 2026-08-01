# 08_Inventory.md

**Module**: Inventory
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Sales Register and Cashbook reference it
**Depends on**: 01_Product_Master, 06_Price_History, 07_Purchase_Register
**Depended on by**: 09_Sales_Register (sales invoices are validated against available stock), 10_Cashbook (financial carrying costs and working capital analysis)

---

## 1. Overview

Inventory Ledger tracks the **daily stock levels** (both pieces and physical weight) of every active product SKU. It is a daily running balance table that reconciles procurement additions and sales deductions.

For each date and active `product_id`, the ledger records:
- Starting stock (opening balance).
- Inbound inventory receipts (from Purchase Register).
- Outbound inventory dispatches (to Sales Register).
- Ending stock (closing balance).
- Stock valuation (standard cost basis from Price History).

This module enforces physical constraints on transactions, ensuring that sales cannot occur unless there is sufficient physical stock in the warehouse.

---

## 2. Business Purpose

**Why this table exists**
- Enforces the physical constraint that **inventory cannot go negative**. A sales transaction is rejected if yesterday's closing stock plus today's purchases cannot satisfy the order quantity.
- Calculates the cost of goods sold (COGS) and inventory valuation for monthly and annual financial audits.
- Acts as the operational bridge between purchasing (replenishment) and sales (liquidation).
- Serves as the database for inventory metrics: turnover ratios, average days-of-inventory-on-hand, stockout durations, and carrying cost analysis.

**How it is used**
- Sales Register: sales line quantities are validated against the available stock for the requested product.
- Financial Reporting: provides the closing stock value (`closing_valuation_value`) for balance sheets.
- AI Supply Chain Models: feeds demand forecasting, reorder point calculators, and buffer stock optimization models.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `inventory_id` | UUID | Yes | System-generated unique identifier, primary key | `inv-a1b2c3d4-...` |
| `inventory_date` | Date | Yes | The date of the stock observation | `2024-04-15` |
| `product_id` | UUID | Yes | Foreign key referencing Product Master | `a1b2c3d4-...` |
| `product_code` | String | Yes | Human-readable code copied from Product Master | `HTP-GI-RD-MED-50NB-6M` |
| `opening_qty_pcs` | Integer | Yes | Total pieces in stock at the start of the day | `150` |
| `opening_weight_kg` | Decimal(12,3) | Yes | **Calculated weight**: `opening_qty_pcs * length * weight_per_meter` | `4887.000` |
| `purchased_qty_pcs` | Integer | Yes | Total pieces received from Purchase Register (07) on this date | `50` |
| `purchased_weight_kg` | Decimal(12,3) | Yes | Total weight received from Purchase Register (07) on this date | `1629.000` |
| `sold_qty_pcs` | Integer | Yes | Total pieces dispatched to Sales Register (09) on this date | `80` |
| `sold_weight_kg` | Decimal(12,3) | Yes | Total weight dispatched to Sales Register (09) on this date | `2606.400` |
| `closing_qty_pcs` | Integer | Yes | **Calculated closing quantity**: `opening_qty_pcs + purchased_qty_pcs - sold_qty_pcs` | `120` |
| `closing_weight_kg` | Decimal(12,3) | Yes | **Calculated closing weight**: `opening_weight_kg + purchased_weight_kg - sold_weight_kg` | `3909.600` |
| `valuation_rate_per_kg` | Decimal(8,2) | Yes | Standard purchase cost (₹/kg) from Price History (06) on `inventory_date` | `74.79` |
| `closing_valuation_value` | Decimal(12,2) | Yes | **Calculated asset value**: `closing_weight_kg * valuation_rate_per_kg` | `292408.98` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

---

## 4. Business Rules

1. **No Negative Stock Rule**: The ending balance `closing_qty_pcs` must be $\ge 0$ for every active product on every date. A sales transaction cannot exceed available inventory:
   $$\text{opening\_qty\_pcs} + \text{purchased\_qty\_pcs} \ge \text{sold\_qty\_pcs}$$
2. **Carryforward Rule**: Stock balances must flow chronologically. Today's opening stock must match yesterday's closing stock:
   - $\text{opening\_qty\_pcs(T)} = \text{closing\_qty\_pcs(T-1)}$
   - $\text{opening\_weight\_kg(T)} = \text{closing\_weight\_kg(T-1)}$
3. **Weight Derivation Constraint**: Weight values are never sampled or independent. They must equal the pieces multiplied by the physical factors from Product Master (01):
   - $\text{weight} = \text{quantity\_pcs} \times \text{length} \times \text{weight\_per\_meter}$
4. **Valuation Method**: Valuation uses the Standard Costing method. The `valuation_rate_per_kg` is the active `standard_purchase_rate_per_kg` from Price History (06) valid on the `inventory_date`.
5. **Inbound Link**: `purchased_qty_pcs` must equal the sum of `quantity_pcs` of that product code received in the Purchase Register (07) on that date.
6. **Outbound Link**: `sold_qty_pcs` must equal the sum of `quantity_pcs` of that product code shipped in the Sales Register (09) on that date.
7. **Event-Driven Reporting Cadence**: The inventory ledger maintains an event-driven snapshot record sequence. An inventory row is recorded for a product on a date ONLY if that product had active trade transactions (purchases or sales) on that date, or on the initial opening balance date (`2024-04-01`). Balances for non-transaction dates are reconstructed via forward-filling from the latest event row.
8. **Initial Balance Seeding**: On the company's `opening_balance_date` (`2024-04-01`), the warehouse is pre-seeded with stock for all active product codes. Initial quantities are based on the category's demand popularity.
9. **Inactive SKU Phase-out**: Products marked `active = false` in Product Master must have their purchases halted (`purchased_qty_pcs = 0`). Sales continue only until `closing_qty_pcs` reaches 0, after which the SKU is archived.
10. **Valuation Calculation**: The closing asset valuation is:
    $$\text{closing\_valuation\_value} = \text{closing\_weight\_kg} \times \text{valuation\_rate\_per\_kg}$$

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique date-product record | Two rows share `inventory_date` and `product_id` |
| V2 | No negative inventory | `closing_qty_pcs < 0` or `closing_weight_kg < 0` at the end of any date |
| V3 | Carryforward integrity | `opening_qty_pcs(Date T) != closing_qty_pcs(Date T-1)` |
| V4 | Inbound register matching | `purchased_qty_pcs` does not match the aggregated purchases of that product in Purchase Register on that date |
| V5 | Outbound register matching | `sold_qty_pcs` does not match the aggregated sales of that product in Sales Register on that date |
| V6 | Quantity balance check | `closing_qty_pcs != opening_qty_pcs + purchased_qty_pcs - sold_qty_pcs` |
| V7 | Weight calculation check | Any weight field deviates >±0.1% from corresponding pieces multiplied by the Product Master weight factors |
| V8 | Asset valuation check | `closing_valuation_value` deviates >₹0.05 from `closing_weight_kg * valuation_rate_per_kg` |
| V9 | Valuation rate source check | `valuation_rate_per_kg` does not match the active standard purchase rate in Price History for that product on that date |
| V10 | Date range check | `inventory_date` is before the company's opening balance date or in the future |

---

## 6. Relationships

```
Product Master (01)     Price History (06)
       │                       │
  (product_id)          (purchase_rate)
       │                       │
       ▼                       ▼
┌──────────────────────────────────────────────┐
│                  Inventory                   │
└──────────────────────────────────────────────┘
       ▲                               ▲
       │ (via product_id & date)       │ (via product_id & date)
Purchase Register (07)          Sales Register (09)
```

**Upstream Dependencies**:
- [01_Product_Master.md](file:///e:/bizplot/docs/01_Product_Master.md): Provides product dimensions and unit weights.
- [06_Price_History.md](file:///e:/bizplot/docs/06_Price_History.md): Provides standard purchase rates for stock valuation.
- [07_Purchase_Register.md](file:///e:/bizplot/docs/07_Purchase_Register.md): Feeds inbound stock receipts.

**Downstream Dependencies**:
- [09_Sales_Register.md](file:///e:/bizplot/docs/09_Sales_Register.md): Queries the available inventory before generating sales invoices to ensure compliance.

---

## 7. Generation Rules

1. **Volume**: Generate an event-driven snapshot record set (~15,000 to 25,000 total inventory records across a 2-year simulation window, representing opening stock seeding plus transaction-active SKU dates).
2. **Initial Stock Seeding (April 1, 2024)**:
   - `GI` Round pipes (popular plumbers' trade): Seed 100 to 400 pieces per SKU.
   - `MS` Square/Rectangle profiles (fabrication standard): Seed 80 to 300 pieces per SKU.
   - `GP` profiles (niche product): Seed 20 to 120 pieces per SKU.
   - `Local Mills` economy items: Seed 50 to 150 pieces per SKU.
3. **Sequential Generation**: To enforce the no-negative-stock rule, transaction generation must run in chronological order:
   - For each date $T$, process all Purchase Register arrivals, increasing stock.
   - Process Sales Register transactions, decreasing stock.
   - Calculate closing stock and write the inventory ledger row for date $T$.
   - Pass closing stock as the opening stock for date $T+1$.
4. **Replenishment Thresholds**: Set a reorder point (ROP) at 20 pieces for standard SKUs. If `closing_qty_pcs` drops below 20, trigger a replenishment order in the Purchase Register (07) to arrive within 3–5 days.
5. **Stockout Prevention**: If a sales order is scheduled that exceeds available inventory (stock < order quantity), the generator must execute one of the following:
   - Downsize the sales order quantity to match available stock.
   - Route the order to an equivalent product (different brand, same class/size).
   - Insert/backdate a procurement transaction from a Trader supplier (spot buy) 1 day prior to the sale.

---

## 8. Sample Records

*Illustrative records showing the daily inventory transitions for HTP-GI-RD-MED-50NB-6M over a two-week period:*

| inventory_date | product_code | opening_qty_pcs | purchased_qty_pcs | sold_qty_pcs | closing_qty_pcs | closing_weight_kg | valuation_rate_per_kg | closing_valuation_value |
|---|---|---|---|---|---|---|---|---|
| 2024-04-01 | HTP-GI-RD-MED-50NB-6M | 150 | 0 | 0 | 150 | 4887.000 | 74.79 | 365498.73 |
| 2024-04-02 | HTP-GI-RD-MED-50NB-6M | 150 | 0 | 25 | 125 | 4072.500 | 74.79 | 304582.28 |
| 2024-04-03 | HTP-GI-RD-MED-50NB-6M | 125 | 0 | 10 | 115 | 3746.700 | 74.79 | 280215.69 |
| 2024-04-04 | HTP-GI-RD-MED-50NB-6M | 115 | 0 | 0 | 115 | 3746.700 | 74.79 | 280215.69 |
| 2024-04-05 | HTP-GI-RD-MED-50NB-6M | 115 | 0 | 30 | 85 | 2769.300 | 74.79 | 207115.95 |
| 2024-04-06 | HTP-GI-RD-MED-50NB-6M | 85 | 0 | 0 | 85 | 2769.300 | 74.79 | 207115.95 |
| 2024-04-07 | HTP-GI-RD-MED-50NB-6M | 85 | 0 | 0 | 85 | 2769.300 | 74.79 | 207115.95 |
| 2024-04-08 | HTP-GI-RD-MED-50NB-6M | 85 | 100 | 0 | 185 | 6027.300 | 75.56 | 455422.79 |
| 2024-04-09 | HTP-GI-RD-MED-50NB-6M | 185 | 0 | 40 | 145 | 4724.100 | 75.56 | 356953.59 |
| 2024-04-10 | HTP-GI-RD-MED-50NB-6M | 145 | 0 | 15 | 130 | 4235.400 | 75.56 | 320026.82 |

*(`inventory_id`, `product_id`, and created/updated timestamps are omitted from this preview table for readability. Unit physical attributes are length = 6.00m, weight_per_meter = 5.430 kg/m, yielding 32.580 kg per piece. On 2024-04-08, 100 pieces are purchased, and the valuation rate shifts from 74.79 to 75.56 based on Price History updates).*

*Note: The stock levels and rates above are illustrative and do not represent verified production constants. Generator processes must execute the exact sequence of transactions.*

---

## 9. Future AI Use Cases

- **Predictive Replenishment Optimization**: Train LSTM or Prophet demand forecasting models to predict product-level sales velocity, dynamically shifting ROP thresholds to minimize carrying cost while preventing stockouts.
- **Stockout Risk Early Warning**: Build classification models to predict the probability of a product stockout within the next 7 days based on current stock, vendor lead times, and open sales orders.
- **Valuation Trend Forecasting**: Forecast closing stock asset valuations based on steel index trend forecasts, helping management plan working capital.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-08-01 | Kiro AI | Initial Inventory BRS — established the dense daily ledger schema, no-negative-stock validation rules, carryforward rules, seeding parameters, and stockout mitigation logic. |

**Open items to confirm before this is locked:**
1. **Dense vs Sparse Ledger**: Confirm if the dense daily database structure (a row per SKU per day) is preferred, or if we should store sparse inventory updates (rows generated only on active transaction dates).
2. **Reorder thresholds**: Confirm if the safety stock limit of 20 pieces is appropriate for replenishment triggers across all shapes and classes.
3. **Seeding quantities**: Confirm if the initial seed range (20 to 400 pieces depending on category) meets your simulation parameters.
4. **Valuation Method**: Confirm if Standard Costing (using standard purchase rates from Price History) is preferred over FIFO or Weighted Average Cost (WAC) based on actual supplier invoices.
