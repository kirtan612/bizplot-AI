from ml.data.extract import get_db_engine
import pandas as pd

engine = get_db_engine()
sales_df = pd.read_sql("SELECT * FROM sales LIMIT 1;", engine)
purch_df = pd.read_sql("SELECT * FROM purchases LIMIT 1;", engine)

print("SALES COLUMNS:", sales_df.columns.tolist())
print("PURCHASES COLUMNS:", purch_df.columns.tolist())
