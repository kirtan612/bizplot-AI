from ml.data.extract import get_db_engine
import pandas as pd

engine = get_db_engine()
df = pd.read_sql("SELECT table_name FROM information_schema.tables WHERE table_schema='public';", engine)
print("EXISTING TABLES:", df['table_name'].tolist())
