import yaml
import csv
from decimal import Decimal
from src.schemas.cashbook import CashbookModel
from src.validators import cashbook_validator
from src.generators import master_generator, simulate
import random

rng = random.Random(42)
customers = master_generator.generate_customers(rng)
suppliers = master_generator.generate_suppliers(rng)

customer_map = {str(c.customer_id): c for c in customers}
supplier_map = {str(s.supplier_id): s for s in suppliers}

# Load generated cashbook CSV
with open("data/samples/10_Cashbook.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

results = cashbook_validator.validate_batch(rows, customer_map, supplier_map)
fails = [r for r in results if not r.passed]

print(f"Total failures: {len(fails)}")
by_rule = {}
for f in fails:
    by_rule[f.rule_id] = by_rule.get(f.rule_id, 0) + 1
    if by_rule[f.rule_id] <= 3:
        print(f"[{f.rule_id}] {f.message} -> {f.row_reference}")

print("\nFailures by Rule ID:")
for k, v in by_rule.items():
    print(f"  Rule {k}: {v} failures")
