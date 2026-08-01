import csv
from collections import Counter

# 1. Cashbook & Capital Infusion
with open("data/generated/10_Cashbook.csv", "r", encoding="utf-8") as f:
    cashbook = list(csv.DictReader(f))

cap_entries = [c for c in cashbook if c["party_type"] == "Capital"]

# 2. Sales & Customers
with open("data/generated/09_Sales_Register.csv", "r", encoding="utf-8") as f:
    sales = list(csv.DictReader(f))

with open("data/generated/07_Purchase_Register.csv", "r", encoding="utf-8") as f:
    purchases = list(csv.DictReader(f))

cust_set = set(s["customer_id"] for s in sales)
prod_set = set(s["product_id"] for s in sales)

# 3. Price History Mismatches
with open("data/generated/06_Price_History.csv", "r", encoding="utf-8") as f:
    price_hist = list(csv.DictReader(f))

ph_map = {(ph["effective_date"], ph["product_id"]): ph for ph in price_hist}

pur_mismatches = 0
for p in purchases:
    key = (p["purchase_date"], p["product_id"])
    if key in ph_map:
        if p["unit_price_per_kg"] != ph_map[key]["effective_purchase_price_per_kg"]:
            pur_mismatches += 1

sal_mismatches = 0
for s in sales:
    key = (s["sales_date"], s["product_id"])
    if key in ph_map:
        if s["unit_price_per_kg"] != ph_map[key]["effective_sales_price_per_kg"]:
            sal_mismatches += 1

print("=== FULL-SCALE 2-YEAR METRICS ===")
print(f"Total Sales: {len(sales)}")
print(f"Total Purchases: {len(purchases)}")
print(f"Total Cashbook Entries: {len(cashbook)}")
print(f"Capital Infusion Entries Count: {len(cap_entries)}")
print(f"Customers Touched: {len(cust_set)} / 50")
print(f"Products Sold: {len(prod_set)} / 140")
print(f"Purchase Price Mismatches: {pur_mismatches}")
print(f"Sales Price Mismatches: {sal_mismatches}")
