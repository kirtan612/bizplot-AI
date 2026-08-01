# 07_Purchase_Register.md

**Module**: Purchase Register
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Inventory and Cashbook reference it
**Depends on**: 01_Product_Master, 02_Supplier_Master, 04_Company_Master, 06_Price_History
**Depended on by**: 08_Inventory (increases stock level based on purchase receipts), 10_Cashbook (payments settle purchase liabilities)

---

## 1. Overview

Purchase Register records all **inventory procurement transactions** (purchase invoices) from suppliers. Each row in this table represents a single invoice line item. 

The register links:
- `supplier_id` (Supplier Master) to retrieve vendor tier, capabilities, and payment terms.
- `company_id` (Company Master) to capture purchasing legal entity context.
- `product_id` (Product Master) to read physical engineering constants (weight, length, HSN, and GST rate).
- `price_id` (Price History) to reference the standard standard purchase cost on the invoice date.

This table acts as the origin of financial liabilities (accounts payable) and inventory additions (stock receipts).

---

## 2. Business Purpose

**Why this table exists**
- Captures raw inbound procurement data. Inventory additions are derived from these lines (Product + Quantity).
- Computes procurement liabilities and payment schedules, driving cash payment triggers in the Cashbook (10).
- Calculates input tax credits (ITC) for GST filing. State fields are cross-referenced to split the flat 18.00% GST into CGST+SGST (intra-state) or IGST (inter-state) reporting columns.
- Serves as the database for purchase price variance (PPV) calculations: analyzing how much actual procurement costs deviated from the category-level Steel Market Index (05) and standard Price History (06).

**How it is used**
- Inventory: running balances add the pieces and weight from each purchase line on its transaction date.
- Cashbook: payments are scheduled against outstanding purchase invoice totals based on invoice due dates and supplier payment terms.
- Compliance reporting: CGST, SGST, and IGST totals are aggregated for input tax credit claims.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `purchase_line_id` | UUID | Yes | System-generated unique identifier, primary key | `pur-a1b2c3d4-...` |
| `purchase_invoice_number` | String | Yes | Unique supplier invoice number, format: `PUR/{FY}/{SEQ}` | `PUR/2024-25/0042` |
| `purchase_date` | Date | Yes | Invoice and procurement transaction date | `2024-04-15` |
| `company_id` | UUID | Yes | Foreign key referencing Company Master | `comp-a1b2c3d4-...` |
| `company_code` | String | Yes | Copied from Company Master for quick lookup | `COMP-001` |
| `supplier_id` | UUID | Yes | Foreign key referencing Supplier Master | `s1a2b3c4-...` |
| `supplier_code` | String | Yes | Copied from Supplier Master | `SUP-MILL-001` |
| `product_id` | UUID | Yes | Foreign key referencing Product Master | `a1b2c3d4-...` |
| `product_code` | String | Yes | Copied from Product Master | `HTP-GI-RD-MED-50NB-6M` |
| `quantity_pcs` | Integer | Yes | Number of pipe pieces purchased | `120` |
| `total_weight_kg` | Decimal(12,3) | Yes | **Calculated weight**: `quantity_pcs * length * weight_per_meter`. Length and weight_per_meter are read from Product Master. | `3909.600` |
| `price_id` | UUID | Yes | Foreign key referencing active Price History row for this product on `purchase_date` | `prc-a1b2c3d4-...` |
| `standard_purchase_rate_per_kg` | Decimal(8,2) | Yes | List cost (₹/kg) copied from Price History via `price_id` | `74.79` |
| `actual_purchase_rate_per_kg` | Decimal(8,2) | Yes | **Negotiated rate (₹/kg)**: standard list cost adjusted by transaction negotiation variance | `74.04` |
| `taxable_value` | Decimal(12,2) | Yes | **Calculated taxable basis**: `total_weight_kg * actual_purchase_rate_per_kg` | `289466.78` |
| `cgst_amount` | Decimal(12,2) | Yes | **Calculated CGST**: 9.00% of taxable value if intra-state (`supplier.state = company.state`), else `0.00` | `26052.01` |
| `sgst_amount` | Decimal(12,2) | Yes | **Calculated SGST**: 9.00% of taxable value if intra-state (`supplier.state = company.state`), else `0.00` | `26052.01` |
| `igst_amount` | Decimal(12,2) | Yes | **Calculated IGST**: 18.00% of taxable value if inter-state (`supplier.state != company.state`), else `0.00` | `0.00` |
| `total_invoice_value` | Decimal(12,2) | Yes | **Calculated total value**: `taxable_value + cgst_amount + sgst_amount + igst_amount` | `341570.80` |
| `credit_period_days` | Integer | Yes | Credit terms from Supplier Master on invoice date | `30` |
| `payment_due_date` | Date | Yes | **Calculated due date**: `purchase_date + credit_period_days` | `2024-05-15` |
| `payment_status` | Enum | Yes | Current settlement state: `Unpaid` \| `Partially Paid` \| `Fully Paid` (updated by Cashbook) | `Unpaid` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

---

## 4. Business Rules

1. **Physical Attribute Integrity**: Physical constants (`weight_per_meter`, piece `length` = 6.00m, and `gst` rate = 18.00%) must be read directly from Product Master via `product_id`. No transaction line is allowed to override or recompute these fields.
2. **Pricing Baseline**: Every purchase line item must map to a valid `price_id` in Price History (06). The `standard_purchase_rate_per_kg` represents the standard purchase cost for that product code on the `purchase_date`.
3. **Actual Rate Derivation**: The transactional rate `actual_purchase_rate_per_kg` is calculated as standard rate plus negotiation variance. The variance represents supplier agreements, volume discounts, or spot premiums:
   $$\text{actual\_purchase\_rate\_per\_kg} = \text{standard\_purchase\_rate\_per\_kg} \times \left(1 + \frac{\text{negotiation\_variance\_pct}}{100}\right)$$
4. **GST Tax Split Rules**: GST is charged at a flat 18.00%.
   - **Intra-state purchases** (Supplier State = Company State): CGST is `taxable_value * 9.00%`, SGST is `taxable_value * 9.00%`, and IGST is `0.00`.
   - **Inter-state purchases** (Supplier State $\neq$ Company State): IGST is `taxable_value * 18.00%`, and CGST/SGST are both `0.00`.
5. **Calculated Total Weight**: The total line weight is:
   $$\text{total\_weight\_kg} = \text{quantity\_pcs} \times \text{length} \times \text{weight\_per\_meter}$$
   The resulting value is rounded to three decimal places.
6. **Invoice Grouping Integrity**: Multiple line items can share the same `purchase_invoice_number`. Lines sharing the same invoice number must have identical invoice-level metadata: `purchase_date`, `supplier_id`, `company_id`, `credit_period_days`, `payment_due_date`, and `payment_status`.
7. **Supplier Capability Constraints**: A purchase line item is valid only if the target product's `brand` exists in the supplier's `brands_supplied` array and the product's `category` is in the supplier's `categories_supplied` array in Supplier Master (02).
8. **Due Date Math**: The payment deadline is calculated as:
   $$\text{payment\_due\_date} = \text{purchase\_date} + \text{credit\_period\_days}$$
9. **Timeline Alignment**: The `purchase_date` must occur on or after the supplier's `onboarding_date` and on or after the company's `opening_balance_date`.
10. **State of Status**: All transactions are generated with `payment_status = 'Unpaid'`. Settlement status is updated dynamically via matching cash outflows recorded in Cashbook (10).

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique transaction lines | Two rows share the same `purchase_line_id` |
| V2 | Supplier capability alignment | Product's brand or category is not in the supplier's capability lists in Supplier Master |
| V3 | GST classification check | If `supplier.state = company.state` but `igst_amount != 0` or CGST/SGST are incorrect; or if states differ but CGST/SGST are not `0.00` |
| V4 | Weight calculation accuracy | `total_weight_kg` deviates >±0.1% from `quantity_pcs * length * weight_per_meter` |
| V5 | Taxable value calculation accuracy | `taxable_value` deviates >₹0.05 from `total_weight_kg * actual_purchase_rate_per_kg` |
| V6 | GST amount calculation accuracy | CGST/SGST/IGST amounts deviate >₹0.05 from standard 9.00% / 18.00% taxable value math |
| V7 | Due date validation | `payment_due_date` does not equal `purchase_date + credit_period_days` |
| V8 | Date chronology validation | `purchase_date` is before the supplier's onboarding date or the company's opening balance date |
| V9 | Invoice coherence validation | Rows sharing a `purchase_invoice_number` have mismatching `purchase_date`, `supplier_id`, `payment_due_date`, or `payment_status` |
| V10 | Pricing lookup validation | `standard_purchase_rate_per_kg` does not match the active price in Price History for that product on that date |

---

## 6. Relationships

```
Supplier Master (02)       Product Master (01)       Company Master (04)
       │                            │                         │
  (supplier_id)                (product_id)              (company_id)
       │                            │                         │
       ▼                            ▼                         ▼
┌───────────────────────────────────────────────────────────────────────┐
│                           Purchase Register                           │
└───────────────────────────────────────────────────────────────────────┘
       │                                  │
       ▼ (via purchase_invoice_number)    ▼ (via product_id & date)
  Cashbook (10)                      Inventory (08)
```

**Upstream Dependencies**:
- [01_Product_Master.md](file:///e:/bizplot/docs/01_Product_Master.md): Provides product specs and weight formulas.
- [02_Supplier_Master.md](file:///e:/bizplot/docs/02_Supplier_Master.md): Provides vendor details, locations, and credit rules.
- [04_Company_Master.md](file:///e:/bizplot/docs/04_Company_Master.md): Provides the home state context to verify intra/inter GST classification.
- [06_Price_History.md](file:///e:/bizplot/docs/06_Price_History.md): Provides the standard list price lookup.

**Downstream Dependencies**:
- [08_Inventory.md](file:///e:/bizplot/docs/08_Inventory.md): Adds purchased pieces and weights to current stock levels.
- [10_Cashbook.md](file:///e:/bizplot/docs/10_Cashbook.md): Allocates bank payment records to update invoice `payment_status`.

---

## 7. Generation Rules

1. **Volume**: Generate transactions representing a mid-sized steel pipe distributor:
   - ~400 to 600 total invoices per FY (averaging 8–12 invoices per week).
   - Randomly sample 2 to 6 line items per invoice, yielding ~1,500 to 2,500 line item rows in the database per FY.
2. **Temporal Distribution**: Distribute purchases across the financial year with a mild seasonal drop (~15–20% decline) during the monsoon season (July–September) and peak replenishment in Q3 and Q4.
3. **Invoice Numbering**: Unique sequential numbering in the format `PUR/2024-25/XXXX` (where `XXXX` is a 4-digit zero-padded sequence).
4. **Line Quantities**: Wholesale quantities, reflecting standard dealer batch sizes. Randomly sample quantities from 50 to 500 pieces per line item.
5. **Supplier Selection Skew**:
   - Direct from `Mill` suppliers: 40% of total invoices. Mill transactions have higher quantities (300–500 pieces per line), longer credit terms (30–45 days), and lower prices.
   - From `Authorized Distributor` suppliers: 40% of total invoices. Moderate quantities (100–300 pieces), credit terms (20–30 days).
   - From `Trader` suppliers: 20% of total invoices. Small spot volumes (50–150 pieces), shorter credit terms (15–25 days).
6. **Negotiation Variance by Supplier Tier**:
   - `Mill` purchases: Sample variance uniformly between -3.00% and -1.00% (volume discounts).
   - `Authorized Distributor` purchases: Sample variance between -1.00% and +0.50%.
   - `Trader` purchases: Sample variance between 0.00% and +1.50% (spot premiums).
7. **Initial Payment Status**: Generate all records with `payment_status = 'Unpaid'` and outstanding value equal to the full invoice value. (Settlements are simulated during Cashbook generation).
8. **Onboarding Constraint**: Supplier selection is constrained to suppliers with an `onboarding_date` prior to the `purchase_date`.

---

## 8. Sample Records

*Illustrative records showing purchase transactions, including multi-line invoices, intra-state, and inter-state GST splits:*

| purchase_invoice_number | purchase_date | supplier_code | product_code | quantity_pcs | total_weight_kg | actual_purchase_rate_per_kg | taxable_value | cgst_amount | sgst_amount | igst_amount | total_invoice_value | payment_status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PUR/2024-25/0001 | 2024-04-05 | SUP-MILL-001 | APL-GI-RD-MED-15NB-6M | 200 | 1464.000 | 76.25 | 111630.00 | 10046.70 | 10046.70 | 0.00 | 131723.40 | Unpaid |
| PUR/2024-25/0001 | 2024-04-05 | SUP-MILL-001 | APL-GI-RD-MED-25NB-6M | 100 | 1500.000 | 76.25 | 114375.00 | 10293.75 | 10293.75 | 0.00 | 134962.50 | Unpaid |
| PUR/2024-25/0002 | 2024-04-08 | SUP-DIST-002 | HTP-GI-RD-MED-50NB-6M | 150 | 4887.000 | 75.30 | 367991.10 | 0.00 | 0.00 | 66238.40 | 434229.50 | Unpaid |
| PUR/2024-25/0003 | 2024-04-12 | SUP-TRDR-001 | LOC-MS-SQ-MED-20X20-6M | 80 | 672.000 | 65.50 | 44016.00 | 3961.44 | 3961.44 | 0.00 | 51938.88 | Unpaid |

*(`purchase_line_id`, `company_id`, `company_code`, `supplier_id`, `product_id`, `price_id`, `credit_period_days`, `payment_due_date`, and tracking timestamps are omitted from this preview table for readability. All rates are in ₹/kg. Invoice PUR/2024-25/0001 shows an intra-state transaction with SUP-MILL-001 in Punjab, charging CGST and SGST. Invoice PUR/2024-25/0002 shows an inter-state purchase from SUP-DIST-002 in Delhi, charging IGST).*

*Note: The transaction rows above are illustrative and do not represent verified production constants. Generator processes must run the exact business rules.*

---

## 9. Future AI Use Cases

- **Supplier Pricing Intelligence**: Train regression models to analyze historical actual rates against standard prices to identify which vendor tiers offer the highest discount elasticity.
- **Cash Outflow Forecasting**: Predict weekly cash requirements for accounts payable by analyzing purchase due dates, total invoice values, and supplier payment cycles.
- **Purchase Order Consolidation**: Feed historical purchase registers into optimization models to group SKU replenishments, maximizing volume discounts and minimizing logistics freight costs.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-08-01 | Kiro AI | Initial Purchase Register BRS — established the transaction structure, formulas for CGST/SGST/IGST splits, supplier capability checks, due date logic, and tier-specific negotiation parameters (-3% to +1.5%). |

**Open items to confirm before this is locked:**
1. **Invoice and line volumes**: Confirm if generating ~400–600 invoices (1,500–2,500 lines) per year fits the scale of your target test scenarios.
2. **Negotiation variance parameters**: Confirm if the tier-specific limits (up to 3% discount for Mills and up to 1.5% premium for Traders) match procurement behavior rules.
3. **Invoice numbering convention**: Confirm if `PUR/{FY}/{SEQ}` is the preferred structure.
