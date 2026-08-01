import csv
from src.validators import cashbook_validator
from src.generators import master_generator
import random

rng = random.Random(42)
products = master_generator.generate_products(rng)
suppliers = master_generator.generate_suppliers(rng)
customers = master_generator.generate_customers(rng)

customer_map = {str(c.customer_id): c for c in customers}
supplier_map = {str(s.supplier_id): s for s in suppliers}

with open("data/generated/10_Cashbook.csv", "r", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

results = cashbook_validator.validate_batch(rows, customer_map, supplier_map)
fails = [r for r in results if not r.passed]

print(f"Total failures: {len(fails)}")
for f in fails:
    print(f"[{f.rule_id}] {f.message} -> {f.row_reference}")
