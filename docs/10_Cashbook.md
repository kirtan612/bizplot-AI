# 10_Cashbook.md

**Module**: Cashbook
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Milestone 1 is completed
**Depends on**: 02_Supplier_Master, 03_Customer_Master, 04_Company_Master, 07_Purchase_Register, 09_Sales_Register
**Depended on by**: none (this is the final transactional sink of the Day 2 sequence)

---

## 1. Overview

Cashbook records all **cash and bank transactions** (receipts and payments) generated during business operations. It acts as the double-entry registry for the company's liquid capital assets, capturing:
- Receipts (cash collections from customers against sales invoices).
- Payments (bank transfers/cash paid to suppliers to settle purchase invoices).

For each entry, the Cashbook tracks the date, mode of payment (Cash, Cheque, or Bank Transfer), transaction amounts, cash discounts, and the corresponding invoice numbers. Outstanding balances and payment statuses are updated downstream in the Purchase and Sales Registers as payments are recorded here.

---

## 2. Business Purpose

**Why this table exists**
- Reconciles cash flow and tracks the daily cash-in-hand and bank balances, representing the physical liquidity constraints of the distributor.
- Tracks accounts receivable (AR) and accounts payable (AP) settlement history.
- Governs the invoice status updates: matching receipt/payment amounts to invoice totals to transition records from `Unpaid` to `Partially Paid` or `Fully Paid`.
- Provides data on payment delays and supplier payment windows, which are critical inputs for credit scoring, liquidity planning, and working capital AI forecasting models.

**How it is used**
- Balance sheets: provides daily opening/closing cash and bank balances.
- Operational registers: updates the `payment_status` of the referenced purchase and sales invoice lines.
- AI Working Capital Models: models cash flow cycles (days-sales-outstanding (DSO) and days-payable-outstanding (DPO)).

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `entry_id` | UUID | Yes | System-generated unique identifier, primary key | `csh-a1b2c3d4-...` |
| `entry_date` | Date | Yes | Date on which the cash/bank movement occurred | `2024-05-20` |
| `company_id` | UUID | Yes | Foreign key referencing Company Master | `comp-a1b2c3d4-...` |
| `company_code` | String | Yes | Copied from Company Master | `COMP-001` |
| `transaction_type` | Enum | Yes | Direction of cash flow: `Receipt` \| `Payment` | `Receipt` |
| `mode_of_payment` | Enum | Yes | Channel used: `Bank Transfer` \| `Cheque` \| `Cash` | `Bank Transfer` |
| `reference_invoice_number` | String | Yes | Invoice number linked to this payment (references `sales_invoice_number` or `purchase_invoice_number`) | `SLS/2024-25/0125` |
| `party_id` | UUID | Yes | Party identifier (references `customer_id` if Receipt, `supplier_id` if Payment) | `c1b2a3d4-...` |
| `party_code` | String | Yes | Copied code (references `customer_code` or `supplier_code`) | `CUST-RETL-001` |
| `party_type` | Enum | Yes | Role of the trade partner: `Customer` \| `Supplier` | `Customer` |
| `settled_amount` | Decimal(12,2) | Yes | **Amount transferred**: the actual cash/bank value cleared in this transaction | `119901.73` |
| `discount_allowed_amount` | Decimal(12,2) | Yes | Cash discount granted to customer (receipt) or received from supplier (payment) | `1211.13` |
| `net_settled_amount` | Decimal(12,2) | Yes | **Calculated liability reduction**: `settled_amount + discount_allowed_amount` | `121112.86` |
| `bank_account_number` | String | Yes | Account number processed (references `company.bank_account_number` if Bank/Cheque, else `Cash-in-Hand`) | `1234567890123456` |
| `reference_number` | String | No | Unique transaction ID (UTR for Bank Transfer, Cheque number, or Null for Cash) | `UTIB241408912345` |
| `payment_delay_days` | Integer | Yes | **Calculated payment window**: `entry_date - invoice_date` (referenced from register) | `30` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

---

## 4. Business Rules

1. **Double-Entry Reference Constraint**: Every cashbook entry must link to a valid invoice:
   - If `transaction_type = Receipt`, `reference_invoice_number` must exist in Sales Register (09) and `party_type = Customer`.
   - If `transaction_type = Payment`, `reference_invoice_number` must exist in Purchase Register (07) and `party_type = Supplier`.
2. **No Over-Settlement Constraint**: The `net_settled_amount` of a cashbook entry (or the sum of entries for a multi-payment invoice) must be less than or equal to the total invoice value:
   $$\sum \text{net\_settled\_amount} \le \text{total\_invoice\_value}$$
3. **No Negative Liquid Assets**: The running daily bank balance and cash balance must always remain $\ge 0$. The company cannot make payments if its balance is insufficient.
4. **Reconciliation Status Updates**: When a cashbook entry is written:
   - Calculate the remaining unpaid balance: $\text{Outstanding} = \text{Invoice Total} - \sum \text{net\_settled\_amount}$.
   - If $\text{Outstanding} = 0$, update the invoice's `payment_status` to `Fully Paid`.
   - If $\text{Outstanding} > 0$ and $\sum \text{net\_settled\_amount} > 0$, update to `Partially Paid`.
5. **Customer Collection Delays**: The collection date (`entry_date`) is simulated based on the customer's `credit_period_days` and `payment_behavior_tier` from Customer Master (03):
   - `Prompt`: $\text{entry\_date} = \text{invoice\_date} + \text{credit\_period\_days} + \text{Uniform}(-2, +3 \text{ days})$
   - `Slow`: $\text{entry\_date} = \text{invoice\_date} + \text{credit\_period\_days} + \text{Uniform}(10, 20 \text{ days})$
   - `Irregular`: $\text{entry\_date} = \text{invoice\_date} + \text{credit\_period\_days} + \text{Uniform}(20, 45 \text{ days})$
6. **Supplier Payment Schedules**: The company pays its suppliers on the due date ($\text{payment\_due\_date} \pm 2 \text{ days}$) to maintain a strong credit rating, provided there is enough cash/bank balance.
7. **Cash Discounts (Receipt Early Bird incentive)**: If a customer pays within 10 calendar days of the `sales_date`, they receive a 1% cash discount on the total invoice value:
   - `discount_allowed_amount = total_invoice_value * 1.00%`
   - `settled_amount = total_invoice_value - discount_allowed_amount`
   Otherwise, `discount_allowed_amount = 0.00`.
8. **Payment Channel Allocations**:
   - Direct Mill payments: 100% via `Bank Transfer`.
   - Customer collection modes vary by customer type (defined in Customer Master):
     - `Distributor` and `Contractor`: 100% `Bank Transfer` or `Cheque`.
     - `Retailer`: 80% `Bank Transfer`, 20% `Cash` (retail deposits).
     - `Fabricator`: 30% `Bank Transfer`, 70% `Cash` (over-the-counter sales).
9. **Reference Format Compliance**:
   - `Bank Transfer` requires a 16-character UTR code starting with 4-alpha bank codes (e.g. `HDFC...`, `UTIB...`).
   - `Cheque` requires a 6-digit zero-padded number.
   - `Cash` has `reference_number = null` and `bank_account_number = 'Cash-in-Hand'`.
10. **Chronology Constraint**: The `entry_date` must be greater than or equal to the invoice date, and must not be in the future relative to the current generation window.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Unique transaction entries | Two rows share the same `entry_id` |
| V2 | Cash/Bank liquidity check | Running bank balance or cash balance becomes negative on any date |
| V3 | Invoice reference check | `reference_invoice_number` does not exist in Sales Register (for receipts) or Purchase Register (for payments) |
| V4 | Party type match check | `party_type` does not match the invoice register source (e.g., reference invoice is `SLS` but `party_type = Supplier`) |
| V5 | Settled value math check | `net_settled_amount != settled_amount + discount_allowed_amount` |
| V6 | Over-settlement check | `net_settled_amount` exceeds the remaining outstanding value on the reference invoice |
| V7 | Date chronology check | `entry_date` is earlier than the reference invoice date |
| V8 | Bank account check | `mode_of_payment = Cash` but `bank_account_number != 'Cash-in-Hand'`; or payment is digital but account is not the company's bank account |
| V9 | Reference number check | `mode_of_payment = Bank Transfer` but `reference_number` does not match UTR format |
| V10 | Status reconciliation check | Invoice `payment_status` is not updated to `Fully Paid` when outstanding balance reaches zero |

---

## 6. Relationships

```
Purchase Register (07)       Sales Register (09)       Company Master (04)
        │                            │                          │
(invoice_number)             (invoice_number)          (bank_account)
        │                            │                          │
        ▼                            ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                Cashbook                                │
└────────────────────────────────────────────────────────────────────────┘
```

**Upstream Dependencies**:
- [04_Company_Master.md](file:///e:/bizplot/docs/04_Company_Master.md): Provides the company's bank account number.
- [07_Purchase_Register.md](file:///e:/bizplot/docs/07_Purchase_Register.md): Provides purchase invoices, totals, and due dates.
- [09_Sales_Register.md](file:///e:/bizplot/docs/09_Sales_Register.md): Provides sales invoices, totals, and due dates.
- [02_Supplier_Master.md](file:///e:/bizplot/docs/02_Supplier_Master.md) & [03_Customer_Master.md](file:///e:/bizplot/docs/03_Customer_Master.md): Provides credit terms and customer payment behavior tiers.

---

## 7. Generation Rules

1. **Volume**: Generate cashbook entries corresponding to all Purchase and Sales Register invoices:
   - ~400–600 purchase invoice payments.
   - ~800–1,200 sales invoice receipts.
   - Total rows: ~1,200 to 1,800 cashbook rows per FY.
2. **Initial Cash & Bank Seeding**:
   - On the company's `opening_balance_date` (`2024-04-01`), seed the bank account (`bank_account_number = 1234567890123456`) with a starting balance of ₹2,500,000.00.
   - Seed the Cash account (`Cash-in-Hand`) with a starting balance of ₹150,000.00.
3. **Sequential Collection & Payment Simulation**:
   - Process transaction registers chronologically.
   - For customer invoices, compute collection date `entry_date` based on the behavior tier.
   - For purchase invoices, schedule payment on the due date.
   - Deduct payments and add receipts to calculate running balances.
   - If a payment would cause the bank balance to drop below ₹50,000.00 (our safety buffer), delay the payment by 2–5 days until subsequent customer receipts restore the balance.
4. **Cash Discount Generation**:
   - Identify customer receipts where `entry_date - sales_date <= 10 days`.
   - Apply a 1% discount, write the values, and mark the invoice settled.
5. **Reconciliation status write-back**:
   - Write back status changes (`Fully Paid` or `Partially Paid`) to the transaction registers dynamically.

---

## 8. Sample Records

*Illustrative records showing receipts, payments, bank transfers, cash payments, discounts, and UTR numbers:*

| entry_date | transaction_type | mode_of_payment | reference_invoice_number | party_code | party_type | settled_amount | discount_allowed_amount | net_settled_amount | bank_account_number | reference_number | payment_delay_days |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2024-04-01 | Receipt | Bank Transfer | SLS/2024-25/0001 | CUST-RETL-001 | Customer | 26789.28 | 270.60 | 27059.88 | 1234567890123456 | HDFCR52024040101 | 0 |
| 2024-04-01 | Receipt | Bank Transfer | SLS/2024-25/0002 | CUST-RETL-001 | Customer | 27448.03 | 277.25 | 27725.28 | 1234567890123456 | HDFCR52024040102 | 0 |
| 2024-04-15 | Receipt | Cash | SLS/2024-25/0004 | CUST-FABR-001 | Customer | 10621.70 | 0.00 | 10621.70 | Cash-in-Hand | null | 1 |
| 2024-05-05 | Payment | Bank Transfer | PUR/2024-25/0001 | SUP-MILL-001 | Supplier | 131723.40 | 0.00 | 131723.40 | 1234567890123456 | PUNBP52024050512 | 30 |
| 2024-05-05 | Payment | Bank Transfer | PUR/2024-25/0002 | SUP-MILL-001 | Supplier | 134962.50 | 0.00 | 134962.50 | 1234567890123456 | PUNBP52024050513 | 30 |
| 2024-05-08 | Payment | Bank Transfer | PUR/2024-25/0003 | SUP-DIST-002 | Supplier | 434229.50 | 0.00 | 434229.50 | 1234567890123456 | PUNBP52024050804 | 30 |
| 2024-05-15 | Receipt | Bank Transfer | SLS/2024-25/0003 | CUST-CONT-001 | Customer | 149875.49 | 0.00 | 149875.49 | 1234567890123456 | ICICR52024051588 | 36 |

*(`entry_id`, `company_id`, `company_code`, `party_id`, and created/updated timestamps are omitted from this preview table for readability. Invoices SLS/2024-25/0001 and 0002 show early collections within 10 days, receiving a 1.00% early cash discount. Supplier payments show settle times reflecting credit terms).*

*Note: The cashbook transactions above are illustrative and do not represent verified production constants. Generator processes must run the exact business rules.*

---

## 9. Future AI Use Cases

- **Liquidity & Cash Flow Forecasting**: Train recurrent neural networks (RNNs) on daily cashbook balances to forecast cash-in-hand over a rolling 30-day window, helping avoid short-term credit facility costs.
- **Customer Delay Risk Predictor**: Model probability distributions of payment delays by customer type, region, and limit, dynamically flagging customers who have high likelihood of sliding into the `Irregular` behavior tier.
- **Payment Collection Timing Optimization**: Optimize automated collection reminder schedules to maximize cash-inflow rates while preserving customer satisfaction.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-08-01 | Kiro AI | Initial Cashbook BRS — established the payment and receipt structure, cash discount rules, mode of payment shares, UTR format, bank balance constraints, and transaction reconciliation write-backs. |

**Open items to confirm before this is locked:**
1. **Starting Bank/Cash Seeding**: Confirm if seeding ₹2.5M bank and ₹150K cash meets your simulation criteria.
2. **Early Cash Discount**: Confirm if the 1% discount for payment within 10 days is aligned with your trade model, or if it should be removed.
3. **Safety Bank Buffer**: Confirm if the ₹50,000.00 bank buffer (below which payments are delayed) is realistic or should be adjusted.
4. **Partial Payments**: Confirm if the system should allow multi-payment split receipts for a single invoice, or if invoices are always settled in full in a single cashbook entry.
