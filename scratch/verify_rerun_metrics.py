import csv
from collections import Counter

# 1. Product Master distribution
with open("data/samples/01_Product_Master.csv", "r", encoding="utf-8") as f:
    products = list(csv.DictReader(f))

wc_counts = Counter(p["weight_class"] for p in products)
cat_counts = Counter(p["category"] for p in products)
brand_counts = Counter(p["brand"] for p in products)
shape_cat_counts = Counter((p["category"], p["shape"]) for p in products)

gp_round_count = sum(1 for p in products if p["category"] == "GP" and p["shape"] == "Round")

print("=== PRODUCT MASTER DISTRIBUTION ===")
print(f"Total Products: {len(products)}")
print(f"Weight Class: {dict(wc_counts)} -> Light: {wc_counts['Light']/140:.1%}, Medium: {wc_counts['Medium']/140:.1%}, Heavy: {wc_counts['Heavy']/140:.1%}")
print(f"Category: {dict(cat_counts)} -> GI: {cat_counts['GI']/140:.1%}, MS: {cat_counts['MS']/140:.1%}, GP: {cat_counts['GP']/140:.1%}")
print(f"GP Round Pipe Count: {gp_round_count}")
print("Shape-Category Breakdowns:")
for (cat, sh), cnt in sorted(shape_cat_counts.items()):
    print(f"  {cat} - {sh}: {cnt}")

# 2. Sales and Purchases
with open("data/samples/09_Sales_Register.csv", "r", encoding="utf-8") as f:
    sales = list(csv.DictReader(f))

with open("data/samples/07_Purchase_Register.csv", "r", encoding="utf-8") as f:
    purchases = list(csv.DictReader(f))

sales_by_date = Counter(s["sales_date"] for s in sales)
print("\n=== TRANSACTION VOLUMES ===")
print(f"Total Sales: {len(sales)} across {len(sales_by_date)} business days (Avg: {len(sales)/38:.2f} sales/day)")
print(f"Total Purchases: {len(purchases)}")

sales_cust_set = set(s["customer_id"] for s in sales)
sales_prod_set = set(s["product_id"] for s in sales)
print(f"Unique Customers touched: {len(sales_cust_set)} / 15")
print(f"Unique Products sold: {len(sales_prod_set)} / 140")

# 3. Cashbook & Capital Infusion
with open("data/samples/10_Cashbook.csv", "r", encoding="utf-8") as f:
    cashbook = list(csv.DictReader(f))

cap_entries = [c for c in cashbook if c["party_type"] == "Capital"]
print("\n=== CASHBOOK METRICS ===")
print(f"Total Cashbook Entries: {len(cashbook)}")
print(f"Capital Infusion Entries Count: {len(cap_entries)}")

# 4. Payment status sync
pur_paid = sum(1 for p in purchases if p["payment_status"] == "Paid")
pur_unpaid = sum(1 for p in purchases if p["payment_status"] == "Unpaid")
sal_paid = sum(1 for s in sales if s["payment_status"] == "Paid")
sal_unpaid = sum(1 for s in sales if s["payment_status"] == "Unpaid")

cb_pur_refs = set(c["reference_invoice_number"] for c in cashbook if c["party_type"] == "Supplier" and c["reference_invoice_number"])
cb_sal_refs = set(c["reference_invoice_number"] for c in cashbook if c["party_type"] == "Customer" and c["reference_invoice_number"])

print("\n=== PAYMENT STATUS SYNC ===")
print(f"Purchases Paid: {pur_paid}, Unpaid: {pur_unpaid} (Cashbook supplier receipts matched: {len(cb_pur_refs)})")
print(f"Sales Paid: {sal_paid}, Unpaid: {sal_unpaid} (Cashbook customer receipts matched: {len(cb_sal_refs)})")

# 5. Price Mismatch Check across Price History vs Registers
with open("data/samples/06_Price_History.csv", "r", encoding="utf-8") as f:
    price_hist = list(csv.DictReader(f))

ph_map = {(ph["effective_date"], ph["product_id"]): ph for ph in price_hist}

pur_mismatches = 0
for p in purchases:
    key = (p["purchase_date"], p["product_id"])
    if key in ph_map:
        ph_rate = ph_map[key]["effective_purchase_price_per_kg"]
        if p["unit_price_per_kg"] != ph_rate:
            pur_mismatches += 1

sal_mismatches = 0
for s in sales:
    key = (s["sales_date"], s["product_id"])
    if key in ph_map:
        ph_rate = ph_map[key]["effective_sales_price_per_kg"]
        if s["unit_price_per_kg"] != ph_rate:
            sal_mismatches += 1

print("\n=== PRICE MISMATCH CHECK ===")
print(f"Purchase price mismatches: {pur_mismatches}")
print(f"Sales price mismatches: {sal_mismatches}")
