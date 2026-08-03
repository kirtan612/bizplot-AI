"""
Validation & Run Summary Reporter
Runs all Milestone 2 validators over final generated datasets and produces audit reports.
Domain: GI / MS Steel Pipe Distribution
"""

import os
from datetime import date
from typing import Dict, List, Any

from src.validators import (
    product_master_validator,
    supplier_master_validator,
    customer_master_validator,
    company_master_validator,
    steel_market_index_validator,
    price_history_validator,
    purchase_register_validator,
    inventory_validator,
    sales_register_validator,
    cashbook_validator,
    cross_table_validator,
)


def generate_reports(
    output_dir: str,
    seed: int,
    start_date: date,
    end_date: date,
    datasets: Dict[str, List[Any]],
    product_map: Dict[str, Any],
    supplier_map: Dict[str, Any],
    customer_map: Dict[str, Any],
):
    """Executes validators and writes validation_report.md and run_summary.md."""
    os.makedirs(output_dir, exist_ok=True)

    validation_results: Dict[str, List[Any]] = {}

    # Run validators across full datasets
    validation_results["Product Master"] = product_master_validator.validate_batch(datasets["Product Master"])
    validation_results["Supplier Master"] = supplier_master_validator.validate_batch(datasets["Supplier Master"])
    validation_results["Customer Master"] = customer_master_validator.validate_batch(datasets["Customer Master"])
    validation_results["Company Master"] = company_master_validator.validate_batch(datasets["Company Master"])
    validation_results["Steel Market Index"] = steel_market_index_validator.validate_batch(datasets["Steel Market Index"])
    validation_results["Price History"] = price_history_validator.validate_batch(datasets["Price History"], product_map)
    validation_results["Purchase Register"] = purchase_register_validator.validate_batch(datasets["Purchase Register"], supplier_map, product_map)
    validation_results["Inventory"] = inventory_validator.validate_batch(datasets["Inventory"], product_map)
    validation_results["Sales Register"] = sales_register_validator.validate_batch(datasets["Sales Register"], customer_map, product_map)
    validation_results["Cashbook"] = cashbook_validator.validate_batch(datasets["Cashbook"], customer_map, supplier_map)

    # 1. Generate validation_report.md
    val_report_path = os.path.join(output_dir, "validation_report.md")
    with open(val_report_path, "w", encoding="utf-8") as f:
        f.write("# Validation Audit Report\n\n")
        f.write(f"**Target Directory**: `{output_dir}`  \n")
        f.write(f"**Simulation Window**: `{start_date}` to `{end_date}`  \n")
        f.write(f"**Random Seed**: `{seed}`  \n\n")
        f.write("## Rule Validation Results\n\n")
        f.write("| Module | Total Checks | Passed Checks | Failed Checks | Audit Status |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")

        total_all_passed = True
        for module_name, results in validation_results.items():
            total_checks = len(results)
            passed_checks = sum(1 for r in results if r.passed)
            failed_checks = total_checks - passed_checks
            status = "✅ PASS" if failed_checks == 0 else "❌ FAIL"
            if failed_checks > 0:
                total_all_passed = False
            f.write(f"| {module_name} | {total_checks} | {passed_checks} | {failed_checks} | {status} |\n")

        f.write("\n---\n\n")
        f.write("## Overall Assessment\n\n")
        if total_all_passed:
            f.write("> [!IMPORTANT]\n")
            f.write("> **100% Validation Success**: All 10 modules passed full dataset validation without a single error or failure.\n")
        else:
            f.write("> [!CAUTION]\n")
            f.write("> **Validation Failures Detected**: See details above.\n")

    # 2. Generate run_summary.md
    summary_path = os.path.join(output_dir, "run_summary.md")
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write("# Dataset Generation Run Summary\n\n")
        f.write(f"**Random Seed**: `{seed}`  \n")
        f.write(f"**Start Date**: `{start_date}`  \n")
        f.write(f"**End Date**: `{end_date}`  \n")
        f.write(f"**Output Directory**: `{output_dir}`  \n\n")
        f.write("## Generated Record Volume Summary\n\n")
        f.write("| File Name | Module | Record Count |\n")
        f.write("| :--- | :--- | :--- |\n")

        file_prefix_map = {
            "Product Master": "01_Product_Master.csv",
            "Supplier Master": "02_Supplier_Master.csv",
            "Customer Master": "03_Customer_Master.csv",
            "Company Master": "04_Company_Master.csv",
            "Steel Market Index": "05_Steel_Market_Index.csv",
            "Price History": "06_Price_History.csv",
            "Purchase Register": "07_Purchase_Register.csv",
            "Inventory": "08_Inventory.csv",
            "Sales Register": "09_Sales_Register.csv",
            "Cashbook": "10_Cashbook.csv",
        }

        for module_name, data_list in datasets.items():
            fname = file_prefix_map.get(module_name, f"{module_name}.csv")
            f.write(f"| `{fname}` | {module_name} | {len(data_list)} |\n")

    # 3. Generate cross_table_validation_report.md
    cross_report_path = os.path.join(output_dir, "cross_table_validation_report.md")
    cross_table_validator.run_cross_table_validation(output_dir, cross_report_path)

