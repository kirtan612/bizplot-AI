# 02_Supplier_Master.md

**Module**: Supplier Master
**Domain**: GI / MS Steel Pipe Distribution
**Status**: Draft v1.0 — pending your sign-off before Purchase Register references it
**Depends on**: 01_Product_Master (brand capability mapping)
**Depended on by**: Purchase Register, Price History (supplier-specific rate tracking)

---

## 1. Overview

Supplier Master defines **who you buy steel pipe inventory from** — the manufacturers, authorized distributors, and traders that supply the brands and categories stocked in Product Master. This table establishes the procurement side of the business: each supplier's tier (mill/distributor/trader), product capability (which brands/categories they can supply), geographic location, credit terms, and GST registration details.

Every purchase transaction in the Purchase Register must reference exactly one `supplier_id` from this table. A supplier row does not represent a single transaction or a time-varying relationship (credit utilization, outstanding balance) — those are derived in Purchase Register and Cashbook. This table captures only the fixed identity and capability attributes of each supplier entity.

---

## 2. Business Purpose

**Why this table exists**
- Establishes the procurement network — defines which entities can supply which brands/categories, so Purchase Register transactions are constrained to realistic supplier–product pairings (e.g., a Local Mills-aligned trader cannot supply APL Apollo product).
- Encodes credit terms and payment behavior expectations at the supplier level, which downstream modules (Purchase Register payment due dates, Cashbook payment scheduling) reference rather than re-derive per transaction.
- Provides the geographic and tax registration context (state, GSTIN) needed for GST compliance reporting and inter-state vs intra-state purchase classification.
- Acts as the supplier dimension for any future procurement analytics — supplier concentration risk, payment performance by supplier tier, price variance by supplier type.

**How it is used**
- Purchase Register: every purchase header references exactly one `supplier_id`; the supplier's credit terms determine the payment due date, and the supplier's product capability constrains which `product_id` values can appear in that purchase's line items.
- Price History: supplier-tier-specific rate variance can be tracked (e.g., direct-from-mill purchases typically get better rates than trader purchases for the same product).
- Cashbook: payment scheduling and supplier outstanding balance tracking reference `supplier_id`.
- Future procurement optimization models: supplier lead time, reliability, and rate competitiveness are conditioned on supplier tier and location.

---

## 3. Data Dictionary

| Column | Type | Required | Description | Example |
|---|---|---|---|---|
| `supplier_id` | UUID | Yes | System-generated unique identifier, primary key | `s1a2b3c4-...` |
| `supplier_code` | String | Yes | Deterministic human-readable code, format: `SUP-{TIER_CODE}-{SEQ}` | `SUP-MILL-001` |
| `supplier_name` | String | Yes | Legal entity name (matches GSTIN registration) | `APL Apollo Tubes Ltd.` |
| `supplier_tier` | Enum | Yes | `Mill` \| `Authorized Distributor` \| `Trader` | `Mill` |
| `address_line1` | String | Yes | Registered office street address | `B-10, Sector 80` |
| `address_line2` | String | No | Additional address detail (landmark, suite) | `Phase II Industrial Area` |
| `city` | String | Yes | City of registration | `Mohali` |
| `state` | Enum | Yes | Indian state (see standard state list below) | `Punjab` |
| `pincode` | String | Yes | 6-digit postal code | `160055` |
| `gstin` | String | Yes | 15-character GST identification number, state-prefix validated | `03AAACA1234A1Z5` |
| `pan` | String | Yes | 10-character PAN (embedded in GSTIN, cross-validated) | `AAACA1234A` |
| `contact_person` | String | Yes | Primary procurement contact name | `Rajesh Kumar` |
| `contact_phone` | String | Yes | 10-digit mobile number | `9876543210` |
| `contact_email` | String | Yes | Email address | `rajesh.k@aplapollo.com` |
| `credit_period_days` | Integer | Yes | Standard payment terms in days from invoice date | `30` |
| `brands_supplied` | Array[Enum] | Yes | List of brands this supplier can provide (from Product Master brand set) | `["APL Apollo"]` |
| `categories_supplied` | Array[Enum] | Yes | List of categories this supplier can provide (`GI`, `MS`, `GP`) | `["GI", "MS", "GP"]` |
| `active` | Boolean | Yes | Whether supplier relationship is currently active | `true` |
| `onboarding_date` | Date | Yes | Date supplier was added to vendor master | `2024-01-15` |
| `created_at` | Timestamp | Yes | Row creation time | `2026-07-27T10:00:00Z` |
| `updated_at` | Timestamp | Yes | Last modification time | `2026-07-27T10:00:00Z` |

**State list (standard 2-letter codes per GSTIN format)**: Punjab, Haryana, Delhi, Uttar Pradesh, Maharashtra, Gujarat, Rajasthan, Tamil Nadu, Karnataka, West Bengal, Telangana, Andhra Pradesh — representative subset for this project; generator should draw from a realistic geographic spread, not concentrate all suppliers in one state.

---

## 4. Business Rules

1. **Supplier tier determines brand capability**: 
   - `Mill` suppliers have exactly one entry in `brands_supplied`, corresponding to their own manufactured brand (APL Apollo mill supplies only APL Apollo, Local Mills supplier supplies only Local Mills).
   - `Authorized Distributor` suppliers may carry 1-2 brands (typically one primary brand they have a formal distribution agreement with, optionally a second).
   - `Trader` suppliers may carry 2-3 brands (broader inventory sourced from multiple channels, but still constrained to realistic pairings — a trader doesn't carry all three tiers simultaneously).

2. **Credit period is tier-correlated**: 
   - `Mill` suppliers typically offer 30–45 days credit to established distributors.
   - `Authorized Distributor` and `Trader` tiers typically offer 15–30 days credit (shorter working capital cycle).
   - Specific values are assigned per supplier but must fall within these tier-realistic ranges.

3. **GSTIN state prefix must match `state` field**: the first 2 digits of `gstin` encode the state per GST registration rules — this is a hard validation constraint, not optional.

4. **PAN must match GSTIN characters 3–12**: GSTIN format is `{STATE_CODE}{PAN}{ENTITY_CODE}{CHECK_DIGIT}` — the `pan` field must equal characters 3 through 12 of `gstin`.

5. **Brand-supplied must be a subset of Product Master brands**: no supplier can list a brand not present in Product Master's brand enum (`APL Apollo`, `Hi-Tech`, `Local Mills`).

6. **Category-supplied cannot be empty**: every supplier must supply at least one category. A supplier supplying zero categories is a data error, not a "dormant" state — dormant suppliers are represented by `active = false`.

7. **Geographic diversity**: the supplier base should not be concentrated in a single state — at least 4–5 different states should be represented across the supplier population to reflect realistic pan-India procurement.

8. **Supplier code is deterministic and unique**: `SUP-{TIER_CODE}-{SEQ}` where `TIER_CODE` = MILL / DIST / TRDR, and `SEQ` is a zero-padded 3-digit sequence number within that tier. No two suppliers share a code.

9. **Onboarding date chronology**: `onboarding_date` must be before or equal to the earliest purchase transaction date referencing this `supplier_id` in Purchase Register (forward reference to be validated when Purchase Register is built).

10. **Active = false does not delete history**: an inactive supplier's past purchases remain valid in Purchase Register; `active = false` only prevents new purchases from being generated against this supplier going forward.

---

## 5. Validation Rules

| # | Rule | Reject condition |
|---|---|---|
| V1 | No duplicate `supplier_code` | Any two rows share a `supplier_code` |
| V2 | GSTIN format | `gstin` not 15 characters, or fails checksum validation, or state prefix doesn't match `state` field |
| V3 | PAN embedded in GSTIN | Characters 3–12 of `gstin` do not match `pan` field |
| V4 | State must be valid | `state` not in the standard Indian state list |
| V5 | Credit period range | `credit_period_days` outside 7–60 day range (implausibly short or long for this industry) |
| V6 | Brands supplied not empty | `brands_supplied` array is empty or null |
| V7 | Brands supplied valid enum | Any brand in `brands_supplied` not in Product Master brand set |
| V8 | Categories supplied not empty | `categories_supplied` array is empty or null |
| V9 | Categories supplied valid enum | Any category in `categories_supplied` not in `{GI, MS, GP}` |
| V10 | Tier-brand cardinality | `supplier_tier = Mill` but `brands_supplied` contains >1 brand |
| V11 | Contact phone format | `contact_phone` not exactly 10 digits |
| V12 | Contact email format | `contact_email` does not match standard email regex |
| V13 | Pincode format | `pincode` not exactly 6 digits |
| V14 | Onboarding date not future | `onboarding_date` is after the current generation date |
| V15 | Supplier code format | `supplier_code` does not match `SUP-{TIER_CODE}-{SEQ}` pattern |

---

## 6. Relationships

```
Supplier Master
   │
   ├──→ Purchase Register   (every purchase references one supplier_id;
   │                          purchase line items must reference product_id
   │                          where product.brand ∈ supplier.brands_supplied)
   │
   ├──→ Price History       (rate variance tracked by supplier_tier + product_id)
   │
   └──→ Cashbook            (payment entries reference supplier_id for payables)
```

**Key constraint for Purchase Register (forward reference)**: When a purchase transaction is generated with `supplier_id = X`, every line item's `product_id` must resolve to a Product Master row where `product.brand` is in `supplier_X.brands_supplied` **and** `product.category` is in `supplier_X.categories_supplied`. A purchase cannot contain a product the supplier is not capable of supplying.

**Upstream dependency on Product Master**: `brands_supplied` and `categories_supplied` must only reference values that exist in Product Master's brand and category enums — this table does not introduce new brands or categories.

---

## 7. Generation Rules

1. **Volume**: generate 18–25 total suppliers.

2. **Supplier tier distribution**:
   - `Mill`: 3 suppliers (one aligned with each of the three brands: APL Apollo mill, Hi-Tech mill, Local Mills entity)
   - `Authorized Distributor`: 8–10 suppliers (40–45% of total, represents formal distribution network)
   - `Trader`: 7–12 suppliers (35–40% of total, represents spot market / informal channel)

3. **Brand-tier alignment**:
   - The 3 `Mill` suppliers: one for APL Apollo (supplies only `["APL Apollo"]`), one for Hi-Tech (supplies only `["Hi-Tech"]`), one for Local Mills (supplies only `["Local Mills"]`).
   - `Authorized Distributor`: each distributor has `brands_supplied` containing 1–2 brands, skewed toward a single primary brand (~70% single-brand distributors, ~30% dual-brand). Never all three brands in one distributor.
   - `Trader`: each trader has `brands_supplied` containing 2–3 brands, representing broader sourcing flexibility. Traders are the primary channel for mixing brands in a single procurement network.

4. **Category capability**:
   - `Mill` suppliers: provide all three categories (`["GI", "MS", "GP"]`) if their brand supports it (APL Apollo and Hi-Tech support all three; Local Mills supports only `["GI", "MS"]` per Product Master Rule 8).
   - `Authorized Distributor` and `Trader`: may supply a subset of categories depending on their warehouse/handling capability — generate realistic subsets, not always the full set. For example, a small trader might handle only `["GI"]` (plumbing-focused), while a larger distributor handles `["GI", "MS", "GP"]`.

5. **Credit period by tier** (sample within these ranges per supplier):
   - `Mill`: 30–45 days
   - `Authorized Distributor`: 20–30 days
   - `Trader`: 15–25 days

6. **Geographic distribution**: 
   - Spread suppliers across at least 5–6 different states.
   - Tilt toward industrial/commercial hubs: Maharashtra (Mumbai region), Gujarat (Ahmedabad/Surat), Delhi NCR (Delhi/Haryana), Tamil Nadu (Chennai), Punjab (Ludhiana/Mohali) — but don't make it 100% tier-1 metros; include 2–3 tier-2 cities for realism.

7. **GSTIN/PAN generation**: 
   - Generate realistic GSTIN strings following the format `{STATE_CODE}{PAN}{ENTITY_CODE}{CHECK_DIGIT}`.
   - `PAN` should follow the PAN format (`AAAAA9999A` — 5 alpha, 4 numeric, 1 alpha).
   - `STATE_CODE` must match the state (e.g., `27` for Maharashtra, `03` for Punjab, `07` for Delhi).
   - Use a consistent entity code (e.g., `1Z5` for company registration type) and compute a valid check digit or use a fixed valid one for simplicity.

8. **Onboarding date**: 
   - Spread `onboarding_date` over a 12–18 month window ending ~3–6 months before the current generation date (2026-07-27).
   - `Mill` suppliers should have earlier onboarding dates (18–24 months ago) — they are foundational relationships.
   - `Trader` suppliers may have more recent onboarding dates (some within the last 6 months) — representing opportunistic spot sourcing.

9. **Contact details**: 
   - Generate realistic Indian names (mix of North/South Indian names reflecting geographic diversity).
   - Phone numbers: 10-digit mobile format, starting with 7/8/9.
   - Email: format `{first_initial}{lastname}@{company_domain}` or generic `{contact}@{company}.com`.

10. **Active flag**: ~95% `true`, ~5% `false` (1–2 inactive suppliers representing discontinued vendor relationships).

---

## 8. Sample Records

| supplier_code | supplier_name | supplier_tier | city | state | gstin | credit_period_days | brands_supplied | categories_supplied | active |
|---|---|---|---|---|---|---|---|---|---|
| SUP-MILL-001 | APL Apollo Tubes Ltd. | Mill | Mohali | Punjab | 03AAACA1234A1Z5 | 45 | ["APL Apollo"] | ["GI","MS","GP"] | true |
| SUP-MILL-002 | Hi-Tech Pipes Ltd. | Mill | Surat | Gujarat | 24AABCH5678B1Z3 | 40 | ["Hi-Tech"] | ["GI","MS","GP"] | true |
| SUP-MILL-003 | Bharat Steel Mills | Mill | Mandi Gobindgarh | Punjab | 03AACBS9012C1Z8 | 30 | ["Local Mills"] | ["GI","MS"] | true |
| SUP-DIST-001 | Prime Steel Distributors | Authorized Distributor | Mumbai | Maharashtra | 27AADPS3456D1Z1 | 30 | ["APL Apollo"] | ["GI","MS","GP"] | true |
| SUP-DIST-002 | Vardhman Pipe Co. | Authorized Distributor | Delhi | Delhi | 07AAFVC7890E1Z4 | 25 | ["Hi-Tech"] | ["GI","MS"] | true |
| SUP-DIST-003 | Shree Ganesh Traders | Authorized Distributor | Ahmedabad | Gujarat | 24AAESG2345F1Z6 | 28 | ["Hi-Tech","Local Mills"] | ["GI"] | true |
| SUP-DIST-004 | Rajasthan Steel Agency | Authorized Distributor | Jaipur | Rajasthan | 08AARRA6789G1Z2 | 22 | ["APL Apollo"] | ["GI","MS"] | true |
| SUP-TRDR-001 | Kumar Enterprises | Trader | Ludhiana | Punjab | 03AABKE4567H1Z9 | 20 | ["Hi-Tech","Local Mills"] | ["GI","MS"] | true |
| SUP-TRDR-002 | Balaji Trading Co. | Trader | Chennai | Tamil Nadu | 33AACBT8901I1Z7 | 18 | ["APL Apollo","Hi-Tech"] | ["GI"] | true |
| SUP-TRDR-003 | Mehta Brothers | Trader | Pune | Maharashtra | 27AADMB1234J1Z3 | 15 | ["Hi-Tech","Local Mills"] | ["GI","MS"] | true |
| SUP-TRDR-004 | City Steel Mart | Trader | Nagpur | Maharashtra | 27AAFCS5678K1Z5 | 22 | ["APL Apollo","Local Mills"] | ["MS"] | true |
| SUP-TRDR-005 | United Pipe Suppliers | Trader | Kanpur | Uttar Pradesh | 09AAGUP9012L1Z1 | 17 | ["Hi-Tech"] | ["GI","MS","GP"] | true |
| SUP-DIST-005 | Steel World Pvt Ltd | Authorized Distributor | Bangalore | Karnataka | 29AAHSW2345M1Z8 | 26 | ["APL Apollo","Hi-Tech"] | ["GI","MS","GP"] | true |
| SUP-TRDR-006 | Arora Metals | Trader | Chandigarh | Chandigarh | 04AABAM6789N1Z4 | 20 | ["Local Mills"] | ["GI"] | false |

*(`supplier_id` UUIDs, full address fields, contact details, and timestamps omitted from this preview table for readability — every real row carries them.)*

*Note: GSTIN values above are illustrative format examples and may not pass actual GST checksum validation; generator must implement proper GSTIN generation logic or use a valid dummy set. PAN values are embedded correctly within the GSTIN structure per the standard.*

---

## 9. Future AI Use Cases

- **Supplier risk scoring**: predict supplier payment default or delivery delay risk based on tier, credit period, geographic location, and historical payment/delivery performance from Purchase Register and Cashbook.
- **Rate negotiation targeting**: identify which suppliers have rate variance above market (Steel Market Index benchmark) by product category, to prioritize renegotiation efforts.
- **Supplier diversification recommendations**: flag concentration risk when >60% of a product category's purchases come from a single supplier or tier.
- **Lead time prediction**: model supplier delivery lead time (order-to-receipt) by supplier tier and location, to optimize reorder point calculations in inventory management.
- **Credit utilization forecasting**: predict supplier credit limit exhaustion based on current outstanding balance and upcoming purchase schedule, to avoid order rejections.

---

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-07-27 | Kiro AI | Initial Supplier Master BRS — tier distribution (3 mill / 8-10 distributor / 7-12 trader) and credit period ranges proposed; GSTIN generation logic noted as requiring validation implementation |

**Open items to confirm before this is locked:**
1. Total supplier count (18–25 proposed) — confirm or adjust to a tighter range.
2. Geographic state distribution — confirm the 5–6 state spread is realistic for your business model, or specify preferred states.
3. Credit period ranges by tier (Mill 30–45, Distributor 20–30, Trader 15–25 days) — confirm or adjust.
4. Dual-brand and triple-brand supplier ratios (e.g., 70% of distributors are single-brand, 30% dual-brand) — confirm or provide alternate split.
5. Whether `address_line2` and full contact details are required in Milestone 1 generation or can be added later (currently marked required for completeness).
