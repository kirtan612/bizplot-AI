# GI/MS Steel Pipe Distribution - Synthetic Data Pipeline

## Project Overview

This project generates realistic, traceable synthetic data for a GI/MS steel pipe distribution business in India. The dataset models a complete business cycle from purchase through inventory to sales and cash management.

## Structure

```
├── config/          # Configuration files and reference data
├── data/            # Generated synthetic datasets (CSV/Parquet)
├── docs/            # Business Rules Specifications (BRS)
├── notebooks/       # Jupyter notebooks for exploration and validation
├── scripts/         # Data generation and validation scripts
├── src/             # Core Python modules
└── tests/           # Unit and integration tests
```

## Milestone 1: Business Rules Specification (BRS)

Current focus: Complete documentation-only BRS for all modules.

### Module Dependencies

**Day 1 - Masters + Pricing Foundation:**
1. Product Master (root) ✓
2. Supplier Master
3. Customer Master
4. Company Master
5. Steel Market Index
6. Price History

**Day 2 - Transactional Layer:**
7. Purchase Register
8. Inventory
9. Sales Register
10. Cashbook

## Domain

- Industry: GI/MS steel pipe distribution
- Geography: India
- Tax regime: GST (18%, HSN 7306)
- Product categories: GI (Galvanized Iron), MS (Mild Steel), GP (Galvanized Plain)
- Brand tiers: APL Apollo (premium), Hi-Tech (mid-tier), Local Mills (economy)

## Key Principles

- **Realistic**: All data follows real-world business logic and engineering standards (IS 1239, IS 4923)
- **Traceable**: Every derived value can be traced back to its source
- **Deterministic**: Regenerating with same seed produces identical results
- **Validated**: Built-in validation rules catch inconsistencies

## Status

🟢 **Milestone 2 & Database Architecture Complete** - Multi-tenant PostgreSQL schema, SQLAlchemy models, Alembic migrations, and seed pipeline deployed.

## Getting Started

Documentation in `docs/` folder follows a strict 10-section format:
1. Overview
2. Business Purpose
3. Data Dictionary
4. Business Rules
5. Validation Rules
6. Relationships
7. Generation Rules
8. Sample Records
9. Future AI Use Cases
10. Change Log

---

## 🗄️ Database Architecture & Multi-Tenant Onboarding

### Overview
BizPilot AI utilizes PostgreSQL (`bizpilot_ai`) with SQLAlchemy 2.0 ORM models and Alembic migrations. The database is single-tenant deployed today, but engineered to be **100% Multi-Tenant Ready** without requiring schema changes.

### Key Architectural Principles
- **UUID Primary Keys**: Server-side `gen_random_uuid()` UUIDv4 primary keys across all scaffolding and business tables.
- **Audit & Soft-Delete Mixin**: Universal `created_at`, `updated_at`, `created_by`, `updated_by`, and `deleted_at` audit columns. Soft-deletion is enforced (`deleted_at IS NULL` for active rows).
- **Exact Field Shape Matching**: Column definitions mirror Milestone 2 Pydantic schemas (`src/schemas/*.py`).
- **Precision Financial Storage**: `NUMERIC` types (`NUMERIC(14,2)` for currency, `NUMERIC(12,4)` for weights) prevent floating-point inaccuracies.
- **Multi-Tenant Unique Constraints**: Compound constraints `(company_id, invoice_number)` on purchases/sales, `(company_id, product_code)` on products, and `(company_id, voucher_number)` on cashbook.

---

### Entity-Relationship (ER) Summary

```
                       ┌──────────────┐
                       │  companies   │
                       └──────┬───────┘
                              │
          ┌───────────────────┼───────────────────┐
          │ (1:N)             │ (1:N)             │ (1:1)
   ┌──────▼───────┐    ┌──────▼───────┐    ┌──────▼────────┐
   │import_jobs   │    │company_member│    │company_master │
   └──────┬───────┘    └──────▲───────┘    └───────────────┘
          │ (1:N)             │ (N:1)
   ┌──────┴───────┐    ┌──────┴───────┐
   │import_files  │    │    users     │
   │import_logs   │    └──────▲───────┘
   └──────────────┘           │ (N:1)
                       ┌──────┴───────┘
                       │    roles     │
                       └──────────────┘

───────────────── Business Table Isolation (company_id FK) ─────────────────

   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │   products   │    │  suppliers   │    │  customers   │
   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
          │                   │                   │
          ├─────────┬─────────┴─────────┐         │
          │ (1:N)   │ (1:N)             │ (1:N)   │ (1:N)
   ┌──────▼───────┐ │            ┌──────▼───────┐ │
   │price_history │ │            │  purchases   │ │
   └──────────────┘ │            └──────────────┘ │
                    │                             │
   ┌──────────────┐ │            ┌────────────────▼┐
   │ steel_index  │─┘            │      sales      │
   └──────────────┘              └─────────────────┘
          │
   ┌──────▼────────┐             ┌─────────────────┐
   │ inventory_    │             │    cashbook     │
   │ snapshots     │             └─────────────────┘
   └───────────────┘
```

---

### Multi-Tenant Extension Path (Onboarding a 2nd Company)

To onboard a new tenant (e.g., Company #2) in the future, **zero database schema changes** or migration scripts are required. The extension path follows these operational steps:

1. **Tenant Registration**:
   Insert a new company record in `companies`:
   ```sql
   INSERT INTO companies (id, name, code) VALUES (gen_random_uuid(), 'Apex Steel Suppliers', 'COMP-002');
   ```

2. **User & Membership Provisioning**:
   Create initial user accounts in `users` and link them to `COMP-002` in `company_members`:
   ```sql
   INSERT INTO company_members (company_id, user_id, role_id)
   VALUES ('<COMP-002-UUID>', '<NEW-USER-UUID>', '<ROLE-UUID>');
   ```

3. **Master Data Initialization**:
   Populate `company_master`, `products`, `suppliers`, and `customers` scoped explicitly to `company_id = '<COMP-002-UUID>'`.
   - Unique constraints like `(company_id, product_code)` ensure product codes do not collide across companies.

4. **Query & Data Isolation**:
   All ORM queries filter on `company_id`. Row-Level Security (RLS) policies can be attached to `company_id` on PostgreSQL if database-level strict isolation is desired in future releases.

