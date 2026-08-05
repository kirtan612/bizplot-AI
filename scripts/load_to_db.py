"""
BizPilot AI - Idempotent & Transactional Data Import Pipeline CLI Script.

Usage:
  python scripts/load_to_db.py [--source data/generated/] [--dry-run]
"""

import sys
import os
import argparse
import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Type, Set, Tuple, Any, Optional

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.db.models.auth import Company
from src.db.models.master_data import CompanyMaster, Product, Supplier, Customer, SteelIndex, PriceHistory
from src.db.models.transactions import Purchase, Sale, Cashbook
from src.db.models.inventory import InventorySnapshot
from src.db.models.import_tracking import ImportJob, ImportFile, ImportLog

# Pydantic Schemas
from src.schemas.product_master import ProductMasterModel
from src.schemas.supplier_master import SupplierMasterModel
from src.schemas.customer_master import CustomerMasterModel
from src.schemas.company_master import CompanyMasterModel
from src.schemas.steel_market_index import SteelMarketIndexModel
from src.schemas.price_history import PriceHistoryModel
from src.schemas.purchase_register import PurchaseRegisterModel
from src.schemas.sales_register import SalesRegisterModel
from src.schemas.inventory import InventoryModel
from src.schemas.cashbook import CashbookModel

# Helper utilities
from src.utils.importer import (
    calculate_checksum,
    parse_csv_row,
    validate_row_schema,
    verify_foreign_keys,
    prepare_model_dict,
    upsert_record,
)


FILE_CONFIGS = [
    {
        "filename": "01_Product_Master.csv",
        "model_cls": Product,
        "schema_cls": ProductMasterModel,
        "pk_attr": "product_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["product_code"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.product_code)),
        "fk_cache_type": "products",
        "fk_id_attr": lambda obj: str(obj.id),
    },
    {
        "filename": "02_Supplier_Master.csv",
        "model_cls": Supplier,
        "schema_cls": SupplierMasterModel,
        "pk_attr": "supplier_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["supplier_code"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.supplier_code)),
        "fk_cache_type": "suppliers",
        "fk_id_attr": lambda obj: str(obj.id),
    },
    {
        "filename": "03_Customer_Master.csv",
        "model_cls": Customer,
        "schema_cls": CustomerMasterModel,
        "pk_attr": "customer_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["customer_code"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.customer_code)),
        "fk_cache_type": "customers",
        "fk_id_attr": lambda obj: str(obj.id),
    },
    {
        "filename": "04_Company_Master.csv",
        "model_cls": CompanyMaster,
        "schema_cls": CompanyMasterModel,
        "pk_attr": None,  # company_id is FK to companies.id
        "natural_key_func": lambda row, cid: (str(cid), str(row["company_code"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.company_code)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
    {
        "filename": "05_Steel_Market_Index.csv",
        "model_cls": SteelIndex,
        "schema_cls": SteelMarketIndexModel,
        "pk_attr": "index_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["effective_date"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.effective_date)),
        "fk_cache_type": "steel_index",
        "fk_id_attr": lambda obj: str(obj.id),
    },
    {
        "filename": "06_Price_History.csv",
        "model_cls": PriceHistory,
        "schema_cls": PriceHistoryModel,
        "pk_attr": "price_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["product_id"]), str(row["effective_date"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.product_id), str(obj.effective_date)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
    {
        "filename": "07_Purchase_Register.csv",
        "model_cls": Purchase,
        "schema_cls": PurchaseRegisterModel,
        "pk_attr": "purchase_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["invoice_number"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.invoice_number)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
    {
        "filename": "08_Inventory.csv",
        "model_cls": InventorySnapshot,
        "schema_cls": InventoryModel,
        "pk_attr": "inventory_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["product_id"]), str(row["snapshot_date"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.product_id), str(obj.snapshot_date)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
    {
        "filename": "09_Sales_Register.csv",
        "model_cls": Sale,
        "schema_cls": SalesRegisterModel,
        "pk_attr": "sales_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["invoice_number"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.invoice_number)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
    {
        "filename": "10_Cashbook.csv",
        "model_cls": Cashbook,
        "schema_cls": CashbookModel,
        "pk_attr": "entry_id",
        "natural_key_func": lambda row, cid: (str(cid), str(row["voucher_number"])),
        "db_key_func": lambda obj: (str(obj.company_id), str(obj.voucher_number)),
        "fk_cache_type": None,
        "fk_id_attr": None,
    },
]


def load_fk_cache(session: Session, company_id: Any) -> Dict[str, Set[str]]:
    """Load existing foreign key UUIDs for company_id into in-memory sets."""
    cache: Dict[str, Set[str]] = {
        "products": set(),
        "suppliers": set(),
        "customers": set(),
        "steel_index": set(),
    }
    
    for p in session.query(Product.id).filter_by(company_id=company_id).all():
        cache["products"].add(str(p.id))
    for s in session.query(Supplier.id).filter_by(company_id=company_id).all():
        cache["suppliers"].add(str(s.id))
    for c in session.query(Customer.id).filter_by(company_id=company_id).all():
        cache["customers"].add(str(c.id))
    for idx in session.query(SteelIndex.id).filter_by(company_id=company_id).all():
        cache["steel_index"].add(str(idx.id))
        
    return cache


def process_import(
    source_dir: str,
    dry_run: bool = False,
    db_url: Optional[str] = None,
    session: Optional[Session] = None
) -> bool:
    """Execute the data import pipeline."""
    close_session_at_end = False
    if session is None:
        if not db_url:
            db_url = os.getenv("DATABASE_URL", "postgresql://postgres:0613@localhost:5432/bizpilot")
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        session = SessionLocal()
        close_session_at_end = True

    try:
        # 1. Resolve Company
        company = session.query(Company).first()
        if not company:
            print("[ERROR] No company found in database. Please run seed script first: python scripts/seed_company_and_users.py")
            return False

        company_id = company.id
        print(f"=================================================================")
        print(f"  BizPilot AI Data Import Pipeline ({'DRY RUN' if dry_run else 'REAL LOAD'})")
        print(f"=================================================================")
        print(f"Target Company: {company.name} (Code: {company.code}, ID: {company_id})")
        print(f"Source Directory: {os.path.abspath(source_dir)}")
        print(f"Dry Run Mode: {dry_run}")
        print(f"-----------------------------------------------------------------")

        # 2. Create Import Job
        import_job = ImportJob(
            company_id=company_id,
            source_type="csv",
            status="running",
            started_at=datetime.now(timezone.utc),
        )
        session.add(import_job)
        session.flush()

        fk_cache = load_fk_cache(session, company_id)

        job_has_errors = False
        total_summary = {"read": 0, "inserted": 0, "updated": 0, "skipped": 0, "errored": 0}

        # 3. Process CSV Files in Dependency Order
        for config in FILE_CONFIGS:
            filename = config["filename"]
            file_path = os.path.join(source_dir, filename)

            if not os.path.exists(file_path):
                msg = f"File not found: {filename}. Skipping."
                print(f"[WARNING] {msg}")
                session.add(ImportLog(
                    import_job_id=import_job.id,
                    level="WARNING",
                    message=msg
                ))
                continue

            # Calculate SHA256 & line count
            checksum = calculate_checksum(file_path)
            with open(file_path, "r", encoding="utf-8") as f:
                row_count = max(0, sum(1 for _ in f) - 1)

            # Record ImportFile
            import_file = ImportFile(
                import_job_id=import_job.id,
                filename=filename,
                row_count=row_count,
                checksum=checksum
            )
            session.add(import_file)
            session.flush()

            # Load existing DB records for upsert matching
            model_cls = config["model_cls"]
            existing_records = session.query(model_cls).filter_by(company_id=company_id).all()
            existing_cache = {config["db_key_func"](obj): obj for obj in existing_records}

            # File load counters
            read_cnt = 0
            ins_cnt = 0
            upd_cnt = 0
            skip_cnt = 0
            err_cnt = 0

            # Process file in transaction savepoint
            sp = session.begin_nested()
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for row_idx, raw_row in enumerate(reader, start=2): # 1-indexed, header is line 1
                        read_cnt += 1

                        # Clean & parse row
                        cleaned_dict = parse_csv_row(raw_row)

                        # Schema Validation
                        parsed_model, schema_err = validate_row_schema(config["schema_cls"], cleaned_dict)
                        if schema_err:
                            err_msg = f"[{filename}:Row {row_idx}] Schema Error: {schema_err}"
                            session.add(ImportLog(
                                import_job_id=import_job.id,
                                level="ERROR",
                                message=err_msg,
                                row_ref=row_idx
                            ))
                            err_cnt += 1
                            job_has_errors = True
                            continue

                        # FK Validation
                        fk_valid, fk_err = verify_foreign_keys(filename, parsed_model, fk_cache)
                        if not fk_valid:
                            err_msg = f"[{filename}:Row {row_idx}] {fk_err}"
                            session.add(ImportLog(
                                import_job_id=import_job.id,
                                level="ERROR",
                                message=err_msg,
                                row_ref=row_idx
                            ))
                            err_cnt += 1
                            job_has_errors = True
                            continue

                        # Prepare model dict & execute upsert
                        model_data = prepare_model_dict(parsed_model, company_id, pk_column_name=config["pk_attr"])
                        nk_tuple = config["natural_key_func"](model_data, company_id)

                        status = upsert_record(session, model_cls, nk_tuple, model_data, existing_cache)
                        if status == "inserted":
                            ins_cnt += 1
                        elif status == "updated":
                            upd_cnt += 1
                        else:
                            skip_cnt += 1

                        # Update FK cache if new parent inserted
                        if status in ("inserted", "updated") and config["fk_cache_type"]:
                            obj = existing_cache.get(nk_tuple)
                            if obj:
                                fk_cache[config["fk_cache_type"]].add(config["fk_id_attr"](obj))

                sp.commit()

            except Exception as e:
                sp.rollback()
                job_has_errors = True
                err_msg = f"[{filename}] Critical Error during load: {str(e)}"
                session.add(ImportLog(import_job_id=import_job.id, level="ERROR", message=err_msg))
                print(f"[ERROR] {err_msg}")
                continue

            # Log File Summary Row
            file_summary_msg = (
                f"Completed {filename}: read={read_cnt}, inserted={ins_cnt}, "
                f"updated={upd_cnt}, skipped={skip_cnt}, errored={err_cnt}"
            )
            session.add(ImportLog(
                import_job_id=import_job.id,
                level="INFO",
                message=file_summary_msg
            ))

            print(f" -> {filename:<30} | Read: {read_cnt:<5} | Ins: {ins_cnt:<5} | Upd: {upd_cnt:<5} | Skip: {skip_cnt:<5} | Err: {err_cnt:<5}")

            total_summary["read"] += read_cnt
            total_summary["inserted"] += ins_cnt
            total_summary["updated"] += upd_cnt
            total_summary["skipped"] += skip_cnt
            total_summary["errored"] += err_cnt

        # 4. Finalize Job Status & Logs
        import_job.status = "completed_with_errors" if job_has_errors else "completed"
        import_job.finished_at = datetime.now(timezone.utc)

        final_msg = (
            f"Import Job Final Summary: status={import_job.status}, read={total_summary['read']}, "
            f"inserted={total_summary['inserted']}, updated={total_summary['updated']}, "
            f"skipped={total_summary['skipped']}, errored={total_summary['errored']}"
        )
        session.add(ImportLog(
            import_job_id=import_job.id,
            level="INFO",
            message=final_msg
        ))
        session.flush()

        print(f"-----------------------------------------------------------------")
        print(f"TOTALS | Read: {total_summary['read']} | Inserted: {total_summary['inserted']} | Updated: {total_summary['updated']} | Skipped: {total_summary['skipped']} | Errored: {total_summary['errored']}")
        print(f"Job Status: {import_job.status.upper()}")

        if dry_run:
            session.rollback()
            print(f"=================================================================")
            print(f"[DRY RUN COMPLETE] All validation completed. 0 DB changes committed.")
            print(f"=================================================================")
        else:
            session.commit()
            print(f"=================================================================")
            print(f"[IMPORT COMPLETE] Data successfully committed to database.")
            print(f"=================================================================")

        return not job_has_errors

    except Exception as e:
        session.rollback()
        print(f"[FATAL ERROR] Pipeline aborted: {str(e)}")
        return False
    finally:
        if close_session_at_end:
            session.close()


def main():
    parser = argparse.ArgumentParser(description="BizPilot AI Data Import Pipeline CLI (PostgreSQL)")
    parser.add_argument(
        "--source",
        type=str,
        default="data/generated/",
        help="Path to directory containing source CSV files (default: data/generated/)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Perform pre-flight validation and calculation without committing DB changes"
    )
    parser.add_argument(
        "--db-url",
        type=str,
        default=None,
        help="Target PostgreSQL connection URL (defaults to DATABASE_URL from .env)"
    )

    args = parser.parse_args()
    success = process_import(source_dir=args.source, dry_run=args.dry_run, db_url=args.db_url)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
