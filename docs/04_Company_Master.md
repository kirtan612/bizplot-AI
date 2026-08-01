# 04_Company_Master.md

**Module**: Company Master
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before transactional modules reference it
**Depends on**: none (independent master entity)
**Depended on by**: Purchase Register, Sales Register, Cashbook (all transactions are owned by company entity)

---

## 1. Overview

Company Master defines **your own business entity** — the single legal entity that owns this dataset's transactions. Unlike Product/Supplier/Customer masters which have many rows, this table typically contains exactly **one row** representing your company's identity, registration details, and operational configuration.

This is not a multi-tenant system. This is a single-company dataset where every purchase, sale, and cash movement belongs to one entity. The Company Master exists to:
- Provide the GSTIN, PAN, and legal name that appear on all your invoices (Purchase Register and Sales Register reference this).
- Define your registered office address and state for GST inter-state vs intra-state transaction classification.
- Establish your financial year and business configuration (accounting period start, default bank account for Cashbook).
- Serve as the "home base" anchor for all business logic — your state determines whether a supplier/customer transaction is intra-state (CGST+SGST) or inter-state (IGST), though this project uses flat 18% GST so the split is for reporting structure, not rate variance.

---

## 2. Business Purpose

**Why this table exists**
- Establishes the legal identity of the business generating these transactions — every invoice in Purchase Register (as buyer) and Sales Register (as seller) must carry this company's GSTIN and legal name for GST compliance.
- Provides the state anchor for inter-state vs intra-state classification: when you buy from a supplier in a different state, it's an inter-state purchase; when a customer in your own state buys from you, it's intra-state.
- Defines the financial year and accounting period boundaries for time-series generation and reporting (e.g., FY 2024-25 runs April 1, 2024 to March 31, 2025).
- Acts as the configuration hub for system-level defaults: default bank account for Cashbook, opening balance date, etc.

**How it is used**
- Purchase Register: every purchase invoice shows `company.gstin` as the buyer GSTIN, `company.state` determines whether the purchase is intra-state (supplier.state = company.state) or inter-state.
- Sales Register: every sales invoice shows `company.gstin` as the seller GSTIN, `company.state` determines intra-state vs inter-state classification.
- Cashbook: references `company.bank_account_number` as the default account for all bank receipts/payments unless specified otherwise.
- Validation rules across all modules: GSTIN format validation uses `company.state` as the home state for consistency checks.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `company_id` | UUID | Yes | System-generated unique identifier, primary key | `comp-a1b2c3d4-...` |
| `company_code` | String | Yes | Fixed identifier, always `COMP-001` (single-company system) | `COMP-001` |
| `legal_name` | String | Yes | Registered legal entity name (matches GSTIN registration) | `Steel Solutions Pvt Ltd` |
| `trade_name` | String | No | Brand/trade name if different from legal name | `SteelCo` |
| `company_type` | Enum | Yes | `Proprietorship` \| `Partnership` \| `Private Limited` \| `Public Limited` | `Private Limited` |
| `address_line1` | String | Yes | Registered office street address | `Plot No. 45, Industrial Area` |
| `address_line2` | String | No | Additional address detail | `Phase III` |
| `city` | String | Yes | City of registration | `Ludhiana` |
| `state` | Enum | Yes | Home state for GST (same list as Supplier/Customer Master) | `Punjab` |
| `pincode` | String | Yes | 6-digit postal code | `141003` |
| `gstin` | String | Yes | 15-character GST identification number | `03AABCS1234D1Z5` |
| `pan` | String | Yes | 10-character PAN (embedded in GSTIN) | `AABCS1234D` |
| `cin` | String | No | Corporate Identification Number (required for Pvt/Public Ltd, null for Proprietorship/Partnership) | `U28910PB2015PTC038123` |
| `contact_person` | String | Yes | Primary contact (owner/director/manager) | `Amarjit Singh` |
| `contact_phone` | String | Yes | 10-digit mobile number | `9876543210` |
| `contact_email` | String | Yes | Official email address | `amarjit@steelsolutions.in` |
| `financial_year_start` | String | Yes | FY start month-day, format `MM-DD` | `04-01` |
| `current_fy` | String | Yes | Current financial year label | `FY 2024-25` |
| `opening_balance_date` | Date | Yes | Date from which transactions are tracked (earliest transaction date in dataset) | `2024-04-01` |
| `bank_name` | String | Yes | Primary bank for Cashbook transactions | `Punjab National Bank` |
| `bank_account_number` | String | Yes | Primary bank account number | `1234567890123456` |
| `bank_ifsc` | String | Yes | IFSC code | `PUNB0123400` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

**Financial year note**: Indian businesses typically follow April-to-March FY (04-01 to 03-31). This project uses FY 2024-25 (April 1, 2024 to March 31, 2025) as the generation period unless you specify otherwise.

---

## 4. Business Rules

1. **Single-company constraint**: this table contains exactly **one active row**. This is not a multi-company consolidation system; it's a single-entity operational dataset.

2. **GSTIN state prefix must match `state` field**: the first 2 digits of `gstin` encode the state per GST rules — must be consistent with the `state` column.

3. **PAN must match GSTIN characters 3–12**: same validation as Supplier/Customer Master.

4. **CIN required for corporate entities**: if `company_type = Private Limited` or `Public Limited`, `cin` must be populated and follow the 21-character CIN format (`U/L{5 digits}{STATE_CODE}{YEAR}PTC/PLC{6 digits}`). Proprietorships and Partnerships have `cin = null`.

5. **Financial year consistency**: `current_fy` and `opening_balance_date` must align — if `current_fy = FY 2024-25`, `opening_balance_date` should be `2024-04-01` (the FY start date). Transactions generated in Purchase/Sales/Cashbook must fall within this FY period.

6. **Opening balance date is the dataset's time anchor**: this is the earliest date any transaction (purchase/sale/cash) can carry. It's typically the FY start date, but could be mid-year if the dataset represents a partial-year snapshot.

7. **Bank account format**: `bank_account_number` should be 10–18 digits (realistic Indian bank account length). IFSC is 11 characters, format `AAAA0BBBBBB` (4 alpha bank code, 1 zero, 6 alphanumeric branch code).

8. **State determines GST classification logic**: every transaction's intra-state vs inter-state classification is determined by comparing `supplier.state` or `customer.state` to `company.state` — this is the pivot field for that logic.

9. **Immutable after transaction generation starts**: once Purchase/Sales/Cashbook are generated, changing `company.state` or `company.gstin` would invalidate all past invoices' GST classification — treat this table as **locked** after downstream generation begins.

10. **Trade name is optional**: many businesses operate under their legal name only; `trade_name` is for businesses that have a distinct brand identity.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | Single company only | More than one row exists in the table |
| V2 | Company code must be `COMP-001` | `company_code` is not exactly `COMP-001` |
| V3 | GSTIN format | `gstin` not 15 characters, or state prefix doesn't match `state` field |
| V4 | PAN embedded in GSTIN | Characters 3–12 of `gstin` do not match `pan` field |
| V5 | State must be valid | `state` not in the standard Indian state list |
| V6 | CIN required for corporate types | `company_type` is `Private Limited` or `Public Limited` but `cin` is null |
| V7 | CIN format | `cin` not null and does not match 21-character CIN pattern |
| V8 | Pincode format | `pincode` not exactly 6 digits |
| V9 | Contact phone format | `contact_phone` not exactly 10 digits |
| V10 | Contact email format | `contact_email` does not match email regex |
| V11 | Financial year format | `financial_year_start` not in `MM-DD` format |
| V12 | Bank account format | `bank_account_number` not 10–18 digits |
| V13 | IFSC format | `bank_ifsc` not exactly 11 characters or fails format check |
| V14 | Opening balance date alignment | `opening_balance_date` does not align with `financial_year_start` (e.g., FY start is 04-01 but opening balance is 06-15 without documented reason) |
| V15 | Current FY label format | `current_fy` does not match `FY YYYY-YY` pattern |

---

## 6. Relationships

```
Company Master (single row)
   │
   ├──→ Purchase Register   (every purchase invoice buyer GSTIN = company.gstin;
   │                          inter-state classification = supplier.state ≠ company.state)
   │
   ├──→ Sales Register      (every sales invoice seller GSTIN = company.gstin;
   │                          inter-state classification = customer.state ≠ company.state)
   │
   └──→ Cashbook            (default bank account = company.bank_account_number;
                             all cash movements belong to company.company_id)
```

**Key influence on Purchase/Sales Register GST classification**: 
- **Intra-state transaction** (CGST + SGST): supplier/customer state = company state
- **Inter-state transaction** (IGST): supplier/customer state ≠ company state

This distinction is structural for GST reporting, though in this project GST is flat 18% regardless (9% CGST + 9% SGST = 18% IGST), so the split doesn't affect total tax amount — only the reporting line items.

---

## 7. Generation Rules

1. **Volume**: exactly **1 row** — this is a single-company dataset.

2. **Company profile** (realistic defaults, adjust to your scenario):
   - `company_type`: `Private Limited` (most common for mid-sized steel distributors; adjust to `Proprietorship` or `Partnership` if modeling a smaller entity)
   - `state`: **Punjab** (proposed, based on Ludhiana being a major steel trading hub in North India; adjust to Maharashtra/Gujarat if you prefer a West India-centric scenario)
   - `city`: **Ludhiana** (adjust if you change state)

3. **GSTIN/PAN generation**:
   - Generate a realistic GSTIN for the chosen state (e.g., `03` for Punjab).
   - Ensure PAN is embedded correctly and follows PAN format rules.

4. **CIN generation** (if `Private Limited`):
   - Format: `U28910PB2015PTC038123`
     - `U` = unlisted company
     - `28910` = NIC code for manufacture of metal products (steel tubes/pipes fall under this)
     - `PB` = Punjab state code
     - `2015` = year of incorporation (set ~8–12 years ago for an established business)
     - `PTC` = Private company limited by shares
     - `038123` = unique registration number (fictional, just needs to be 6 digits)

5. **Financial year**:
   - `financial_year_start`: `04-01` (standard Indian FY)
   - `current_fy`: `FY 2024-25`
   - `opening_balance_date`: `2024-04-01` (start of FY 2024-25)
   - All transactions in Purchase/Sales/Cashbook will be generated between `2024-04-01` and the current generation date (`2026-07-27`), which spans into FY 2026-27 — **clarify if you want transactions only within a single complete FY (2024-25, ending 2025-03-31) or spanning into the current partial FY (2025-26/2026-27)**.

6. **Bank details**:
   - Use a realistic Indian bank name (PNB, HDFC, ICICI, SBI, Axis, etc.).
   - Generate a 16-digit account number (standard for most Indian banks).
   - Generate a valid-format IFSC (11 characters, first 4 alpha = bank code, 5th = 0, last 6 = branch code).

7. **Contact details**:
   - Generate a realistic Indian name (North Indian name if Punjab-based, adjust for region if you change state).
   - 10-digit mobile starting with 7/8/9.
   - Email format: `{name}@{company_domain}.in` or `.com`.

8. **Trade name**: optional — leave null unless you want to model a business with a distinct brand identity separate from its legal name.

---

## 8. Sample Records

| company_code | legal_name | trade_name | company_type | city | state | gstin | pan | cin | financial_year_start | current_fy | opening_balance_date | bank_name | bank_account_number |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| COMP-001 | Steel Solutions Pvt Ltd | SteelCo | Private Limited | Ludhiana | Punjab | 03AABCS1234D1Z5 | AABCS1234D | U28910PB2015PTC038123 | 04-01 | FY 2024-25 | 2024-04-01 | Punjab National Bank | 1234567890123456 |

*(`company_id`, full address fields, contact details, `bank_ifsc`, and timestamps omitted from preview for readability — the real row carries them.)*

*Note: This is an illustrative example. Generator should use realistic GSTIN/PAN/CIN/IFSC values with proper format validation, not copy these verbatim.*

---

## 9. Future AI Use Cases

- **Business performance benchmarking**: compare this company's metrics (revenue growth, margin %, payment cycle efficiency) against industry benchmarks by using this table's attributes (company type, state, FY start) as conditioning variables.
- **Multi-period trend analysis**: `opening_balance_date` and `current_fy` define the time boundaries for YoY or MoM trend analysis of sales/purchases/inventory turnover.
- **Geographic expansion modeling**: `state` is the home base; future models can simulate what happens if the company opens a branch in another state (changes in inter-state vs intra-state transaction mix, logistics costs).
- **Credit rating / working capital models**: company type, CIN (year of incorporation can be extracted), and bank relationship details can feed into a working capital requirement or credit risk model.
- **Tax optimization**: while GST is flat 18% here, future enhancements could model scenarios where the company's state affects input tax credit timing or compliance costs.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-07-27 | Kiro AI | Initial Company Master BRS — single-row table, Punjab/Ludhiana proposed as home state, Private Limited company type proposed, FY 2024-25 proposed as generation period |

**Open items to confirm before this is locked:**
1. **State/City**: Punjab/Ludhiana proposed — confirm or specify alternate home state (affects all inter-state vs intra-state classifications downstream).
2. **Company type**: Private Limited proposed — confirm or adjust to Proprietorship/Partnership if modeling a smaller entity.
3. **Financial year span**: FY 2024-25 (April 1, 2024 to March 31, 2025) proposed as the transaction generation period — confirm, or specify if transactions should span into FY 2025-26 or later.
4. **Trade name**: currently null in generation logic — confirm if you want a trade name populated or left null.
5. **Bank name preference**: PNB proposed (North India alignment) — confirm or specify alternate bank (HDFC/ICICI/SBI/Axis).
