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

🟡 **In Progress** - Milestone 1: BRS Documentation (Day 1)

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
