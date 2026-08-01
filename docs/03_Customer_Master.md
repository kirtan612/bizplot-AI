# 03_Customer_Master.md

**Module**: Customer Master
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Sales Register references it
**Depends on**: none (independent master entity)
**Depended on by**: Sales Register, Cashbook (receipt transactions reference customer_id)

---

## 1. Overview

Customer Master defines **who you sell steel pipe inventory to** — the retail dealers, regional distributors, steel fabricators, and infrastructure/construction contractors. This table establishes the revenue/sales side of the business: each customer's type, geographic location, GST registration status (registered vs unregistered), credit limits, payment terms, and typical payment behavior tier.

Every sales invoice in the Sales Register must reference exactly one `customer_id` from this table. A customer row represents a fixed legal and behavioral profile, not a single transaction. Running balances and outstanding aging profiles are derived from Sales Register and Cashbook transactions.

---

## 2. Business Purpose

**Why this table exists**
- Establishes the customer database — defines which entities buy steel pipes, including their credit limits and credit periods, to prevent unauthorized credit exposure during sales generation.
- Encodes credit terms and payment behavior expectations at the customer level to simulate realistic payment dates (Sales Register) and collection dynamics (Cashbook).
- Provides the geographic and tax registration context (state, GSTIN) needed for GST compliance reporting, determining whether sales are intra-state (CGST+SGST) or inter-state (IGST) relative to the company's home state (Punjab/Ludhiana).
- Serves as the customer dimension for future sales and credit analytics — sales concentration risk, payment delay profiling, and credit limit optimization.

**How it is used**
- Sales Register: every sales header references exactly one `customer_id`; the customer's credit terms determine the invoice payment due date, and the customer's state determines the GST tax split (intra-state vs inter-state).
- Cashbook: receipt transactions reference `customer_id` for collections against outstanding receivables, with payment delays modeled around the customer's payment behavior tier.
- Future AI models: customer type, location, and behavior tiers are features for predicting credit defaults, payment delays, and customer demand velocity.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `customer_id` | UUID | Yes | System-generated unique identifier, primary key | `c1b2a3d4-...` |
| `customer_code` | String | Yes | Deterministic human-readable code, format: `CUST-{TYPE_CODE}-{SEQ}` | `CUST-RETL-001` |
| `customer_name` | String | Yes | Registered legal entity or trade name | `Grover Steel Traders` |
| `customer_type` | Enum | Yes | `Distributor` \| `Retailer` \| `Fabricator` \| `Contractor` | `Retailer` |
| `address_line1` | String | Yes | Business office or shop street address | `Shop No. 12, Iron Market` |
| `address_line2` | String | No | Additional address detail (landmark, market name) | `Loha Mandi` |
| `city` | String | Yes | City of business registration | `Ludhiana` |
| `state` | Enum | Yes | Indian state (standard state list below) | `Punjab` |
| `pincode` | String | Yes | 6-digit postal code | `141008` |
| `gst_registered` | Boolean | Yes | True if GST-registered (regular/composition), False if unregistered | `true` |
| `gstin` | String | No | 15-character GST identification number (required if `gst_registered` is true) | `03AABCG5678D1Z4` |
| `pan` | String | Yes | 10-character PAN (embedded in GSTIN if registered, generated separately if unregistered) | `AABCG5678D` |
| `contact_person` | String | Yes | Primary contact person name | `Harpreet Singh` |
| `contact_phone` | String | Yes | 10-digit mobile number | `9812345678` |
| `contact_email` | String | Yes | Contact email address | `harpreet@groversteel.com` |
| `credit_limit` | Decimal(12,2) | Yes | Maximum allowed outstanding balance in ₹ | `1500000.00` |
| `credit_period_days` | Integer | Yes | Standard payment terms in days from invoice date | `30` |
| `payment_behavior_tier` | Enum | Yes | Typical payment behavior: `Prompt` \| `Slow` \| `Irregular` (guides Cashbook collection simulation) | `Prompt` |
| `active` | Boolean | Yes | Whether customer is currently active for sales transactions | `true` |
| `onboarding_date` | Date | Yes | Date customer was added to database | `2024-04-01` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

**State list (same standard subset as Supplier Master)**: Punjab, Haryana, Delhi, Uttar Pradesh, Maharashtra, Gujarat, Rajasthan, Tamil Nadu, Karnataka, West Bengal, Telangana, Andhra Pradesh.

---

## 4. Business Rules

1. **GSTIN state prefix must match `state` field**: the first 2 digits of `gstin` must encode the state per GST registration rules (if `gst_registered = true`).
2. **PAN must match GSTIN characters 3–12**: if `gst_registered = true`, `pan` must equal characters 3 through 12 of `gstin`. If `gst_registered = false`, `pan` is still required (mandatory for high-value transactions under tax guidelines) and must follow standard PAN format.
3. **Credit period is customer-type correlated**:
   - `Distributor`: 30 or 45 days (higher-volume trade partners).
   - `Retailer`: 15 or 30 days (standard dealer credit).
   - `Fabricator`: 0 or 7 days (cash-and-carry or minimal credit).
   - `Contractor`: 45 or 60 days (project-linked payment cycles).
4. **Credit limit is type-correlated**:
   - `Distributor`: ₹2,500,000 to ₹5,000,000
   - `Retailer`: ₹500,000 to ₹1,500,000
   - `Fabricator`: ₹50,000 to ₹200,000
   - `Contractor`: ₹1,000,000 to ₹3,000,000
5. **GST registration status by type**:
   - `Distributor` and `Contractor` tiers are always GST-registered (`gst_registered = true`).
   - `Retailer` is ~80% registered, ~20% unregistered.
   - `Fabricator` is ~40% registered, ~60% unregistered (often small, family-owned proprietary shops).
6. **Payment behavior tier affects collection delays**:
   - `Prompt`: pays within `credit_period_days` (typically -2 to +3 days).
   - `Slow`: pays with a consistent delay of 10–20 days beyond credit terms.
   - `Irregular`: payment dates fluctuate widely (delay of 20–45 days, requiring reminders).
7. **Credit risk adjustment for unregistered customers**: If `gst_registered = false`, the customer's `credit_limit` is scaled down by 50% as a risk-mitigation rule.
8. **Customer code is deterministic and unique**: `CUST-{TYPE_CODE}-{SEQ}` where `TYPE_CODE` = DIST / RETL / FABR / CONT, and `SEQ` is a zero-padded 3-digit sequence number within that tier.
9. **Onboarding date chronology**: `onboarding_date` must be before or equal to the earliest sales transaction date referencing this `customer_id` in Sales Register.
10. **Active = false does not delete history**: inactive customers' history remains valid in Sales Register and Cashbook; `active = false` only prevents new sales from being generated against this customer.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | No duplicate `customer_code` | Any two rows share a `customer_code` |
| V2 | GSTIN presence check | `gst_registered = true` but `gstin` is null/empty; or `gst_registered = false` but `gstin` is not null |
| V3 | GSTIN format and state match | `gstin` is not null and (fails standard format regex, or first 2 digits don't match `state`) |
| V4 | PAN embedded in GSTIN | `gstin` is not null and characters 3–12 of `gstin` do not match `pan` field |
| V5 | PAN format | `pan` is null or does not match 10-character PAN regex (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) |
| V6 | Credit period range | `credit_period_days` outside 0–90 day range |
| V7 | Credit limit scale | `credit_limit < 0` or exceeds ₹10,000,000 (implausibly high for this distributor scope) |
| V8 | State must be valid | `state` not in the standard Indian state list |
| V9 | Contact phone format | `contact_phone` not exactly 10 digits |
| V10 | Contact email format | `contact_email` does not match standard email regex |
| V11 | Pincode format | `pincode` not exactly 6 digits |
| V12 | Onboarding date not future | `onboarding_date` is after the current generation date |
| V13 | Customer code format | `customer_code` does not match `CUST-{TYPE_CODE}-{SEQ}` pattern |
| V14 | Type validity | `customer_type` is not in the set `{Distributor, Retailer, Fabricator, Contractor}` |
| V15 | Payment behavior tier validity | `payment_behavior_tier` is not in `{Prompt, Slow, Irregular}` |

---

## 6. Relationships

```
Customer Master
   │
   ├──→ Sales Register      (every sales invoice references one customer_id;
   │                          customer state determines CGST+SGST vs IGST split;
   │                          credit terms determine invoice due date)
   │
   └──→ Cashbook            (collection receipt entries reference customer_id)
```

**Key GST Classification Rule**: When a sale is made, comparing `customer.state` to the home company state (`company.state`) determines the GST tax split:
- **Intra-state sales** (CGST 9% + SGST 9%): `customer.state = company.state`
- **Inter-state sales** (IGST 18%): `customer.state ≠ company.state`

This holds regardless of registration status (unregistered customers are still charged 18% GST, though they cannot claim Input Tax Credit).

---

## 7. Generation Rules

1. **Volume**: generate 40–50 total customers.

2. **Customer type distribution**:
   - `Retailer`: 45% (largest trade base, local distribution focus)
   - `Fabricator`: 25% (smaller volume, cash-oriented)
   - `Contractor`: 15% (project-driven, large invoice sizes)
   - `Distributor`: 15% (large wholesale buyers, highest credit limits)

3. **GST registration status by type**:
   - `Distributor`: 100% `gst_registered = true`
   - `Contractor`: 100% `gst_registered = true`
   - `Retailer`: 80% `true`, 20% `false`
   - `Fabricator`: 40% `true`, 60% `false`

4. **Geographic distribution (Ludhiana/Punjab home base focus)**:
   - To represent a local distributor's market, skew geographic distribution heavily toward the company's home state (**Punjab**, e.g., ~60% of total customers).
   - Spread the remaining 40% across neighboring states (Haryana, Delhi, Rajasthan, Uttar Pradesh, Himachal Pradesh) and key national markets (Maharashtra, Gujarat) to represent inter-state sales.

5. **Credit limit & Credit period generation** (sample within these ranges per customer):
   - `Distributor`: Credit limit ₹2,500,000 – ₹5,000,000; credit period: 30 or 45 days.
   - `Retailer`: Credit limit ₹500,000 – ₹1,500,000; credit period: 15 or 30 days.
   - `Fabricator`: Credit limit ₹50,000 – ₹200,000; credit period: 0 or 7 days.
   - `Contractor`: Credit limit ₹1,000,000 – ₹3,000,000; credit period: 45 or 60 days.
   - *Apply a 50% discount to `credit_limit` if `gst_registered = false`.*

6. **Payment behavior tier distribution**:
   - `Prompt`: 55% of customers
   - `Slow`: 30% of customers
   - `Irregular`: 15% of customers
   - *Correlation*: Contractors and unregistered fabricators skew toward Slow/Irregular; distributors and registered retailers skew toward Prompt.

7. **GSTIN/PAN generation**:
   - For `gst_registered = true` rows, generate a valid GSTIN format (e.g. state code `03` for Punjab, `07` for Delhi).
   - Ensure the embedded PAN characters match the `pan` field.
   - For unregistered rows, generate a standard PAN independently.

8. **Onboarding date**:
   - Spread onboarding dates over an 18-month window ending 3 months before the generation start date.
   - `Distributor` and `Retailer` tiers should have earlier onboarding dates representing established accounts.

9. **Contact details**:
   - Generate realistic Indian names matching the geographic state.
   - Phone numbers: 10-digit mobile format, starting with 7/8/9.
   - Email format: `{first_initial}{lastname}@{company_domain}` or generic personal emails for smaller fabricators.

10. **Active flag**: ~95% `true`, ~5% `false` (1-2 inactive accounts).

---

## 8. Sample Records

| customer_code | customer_name | customer_type | city | state | gst_registered | gstin | credit_limit | credit_period_days | payment_behavior_tier | active |
|---|---|---|---|---|---|---|---|---|---|---|
| CUST-DIST-001 | Punjab Steel Distributors | Distributor | Ludhiana | Punjab | true | 03AAACP1234D1Z5 | 4,500,000.00 | 45 | Prompt | true |
| CUST-RETL-001 | Grover Steel Traders | Retailer | Ludhiana | Punjab | true | 03AABCG5678D1Z4 | 1,200,000.00 | 30 | Prompt | true |
| CUST-RETL-002 | Singhal Iron Store | Retailer | Mohali | Punjab | true | 03AACCS9012D1Z9 | 800,000.00 | 30 | Slow | true |
| CUST-RETL-003 | Janta Pipe House | Retailer | Ludhiana | Punjab | false | null | 400,000.00 | 15 | Prompt | true |
| CUST-FABR-001 | Vishwakarma Welders | Fabricator | Ludhiana | Punjab | false | null | 50,000.00 | 0 | Prompt | true |
| CUST-FABR-002 | Apex Grill Fabrication | Fabricator | Jalandhar | Punjab | true | 03AAFCA3456F1Z1 | 150,000.00 | 7 | Slow | true |
| CUST-CONT-001 | North Infra Projects | Contractor | Delhi | Delhi | true | 07AABCN7890G1Z6 | 2,500,000.00 | 60 | Slow | true |
| CUST-CONT-002 | Shivalik Construction | Contractor | Shimla | Himachal Pradesh | true | 02AAECS2345H1Z3 | 1,500,000.00 | 45 | Irregular | true |
| CUST-DIST-002 | Haryana Steel Agency | Distributor | Rohtak | Haryana | true | 06AAFHA6789I1Z2 | 3,500,000.00 | 30 | Prompt | true |
| CUST-RETL-004 | Balaji Iron Mart | Retailer | Gurgaon | Haryana | true | 06AABCB1234J1Z7 | 1,000,000.00 | 30 | Prompt | true |
| CUST-FABR-003 | Star Metal Craft | Fabricator | Noida | Uttar Pradesh | false | null | 75,000.00 | 7 | Irregular | true |
| CUST-RETL-005 | Gupta Hardware & Pipes | Retailer | Ghaziabad | Uttar Pradesh | true | 09AAFGG5678K1Z3 | 600,000.00 | 15 | Slow | true |
| CUST-DIST-003 | Maharashtra Pipes | Distributor | Mumbai | Maharashtra | true | 27AADMP9012L1Z5 | 5,000,000.00 | 45 | Prompt | true |
| CUST-CONT-003 | Western Grid Projects | Contractor | Ahmedabad | Gujarat | true | 24AAGWP3456M1Z1 | 2,000,000.00 | 60 | Irregular | true |
| CUST-RETL-006 | Royal Hardware Store | Retailer | Amritsar | Punjab | true | 03AAHRS7890N1Z2 | 900,000.00 | 30 | Prompt | false |

*(`customer_id` UUIDs, full address fields, contact details, PANs, and timestamps omitted from this preview table for readability — every real row carries them. Credit limit is adjusted by 50% for unregistered rows such as CUST-RETL-003.)*

*Note: GSTIN values above are illustrative format examples and may not pass actual GST checksum validation; generator must implement proper GSTIN generation logic or use a valid dummy set. PAN values are embedded correctly within the GSTIN structure per the standard.*

---

## 9. Future AI Use Cases

- **Credit risk prediction & dynamic limits**: train a credit risk model (logistic regression or gradient boosting) to predict payment defaults or severe delays (>30 days beyond terms) based on customer type, credit limit, location, and historical receipt delay data from Cashbook, recommending dynamic limit adjustments.
- **Sales demand forecasting**: forecast monthly sales quantities at the SKU/customer-type level, adjusted for seasonal trends, to optimize warehouse storage and replenishment plans.
- **Customer churn prediction**: identify customers who have a high likelihood of churning (i.e. zero orders in their typical order frequency window) to trigger targeted commercial offers.
- **Prioritization of collections**: rank outstanding invoices in the Sales Register by predicted payment delay, enabling collection teams to focus on high-risk Accounts Receivable first.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-08-01 | Kiro AI | Initial Customer Master BRS — type distribution (Retailer 45%, Fabricator 25%, Contractor 15%, Distributor 15%), local Punjab skew (~60%), and credit limits/credit periods established. |

**Open items to confirm before this is locked:**
1. **Home state Punjab skew ratio**: confirming ~60% local and 40% out-of-state is appropriate for modeling your business footprint.
2. **Credit limit ranges & 50% discount rule for unregistered customers**: confirming these ranges and the risk discount meet business expectations.
3. **Registration distributions**: confirming the proposed ratios of registered vs unregistered retailers/fabricators reflect the target market realism.
