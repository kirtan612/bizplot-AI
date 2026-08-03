# Cross-Table End-to-End Validation Report

**Target Directory**: `data/generated`  
**Generated Date**: `2026-08-03 14:51:03`  

## Executive Summary

| Rule ID | Rule Description | Total Checks | Passed | Failed | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `X1` | No sale exceeds available stock at transaction time | 5559 | 5559 | 0 | ✅ PASS |
| `X2` | No sale predates purchase(s) stocking that SKU | 140 | 140 | 0 | ✅ PASS |
| `X3` | Transaction rates trace to Price History for (product_id, date) | 8778 | 8778 | 0 | ✅ PASS |
| `X4` | payment_status synchronized with Cashbook entries | 17229 | 17229 | 0 | ✅ PASS |
| `X5` | Inventory running balance closing == next opening | 8260 | 8260 | 0 | ✅ PASS |
| `X6` | reorder_flag reflects post-activity closing stock | 8400 | 8400 | 0 | ✅ PASS |
| `X7` | reorder_level_pcs evaluation across SKUs (Advisory) | 1 | 1 | 0 | ✅ PASS |
| `X8` | Steel Market Index weekly continuity without gaps | 104 | 104 | 0 | ✅ PASS |
| `X9` | GST calculation & rate logic at full scale | 8778 | 8778 | 0 | ✅ PASS |

---

## Generator Behavior & Rule Specific Audits

### Rule X6 — Reorder Flag Logic Audit
> **Status**: ✅ **Confirmed Fixed Post-Smoke-Test**. `reorder_flag` correctly evaluates post-activity `closing_qty_pcs` across all inventory records.

### Rule X7 — Reorder Level Flatness Advisory Note
> [!NOTE]
> ADVISORY NOTE: reorder_level_pcs is flat (150) across all 140 products. Recommend scaling reorder levels by SKU sales velocity or size tier (e.g., 15NB vs 150NB) per open item in 08_Inventory.md.

---

## Detailed Failure Log

> ✅ **Zero Failures**: All structural cross-table integrity rules passed with 0 errors across the complete dataset.

