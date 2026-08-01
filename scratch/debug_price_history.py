from src.schemas.price_history import PriceHistoryModel
from src.validators import price_history_validator
from src.generators import master_generator
import random
import csv

rng = random.Random(42)
products = master_generator.generate_products(rng)
product_map = {str(p.product_id): p for p in products}

with open("data/samples/06_Price_History.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

results = price_history_validator.validate_batch(rows, product_map)
fails = [r for r in results if not r.passed]

print(f"Total failures: {len(fails)}")
for f in fails:
    print(f"[{f.rule_id}] {f.message} -> {f.row_reference}")
