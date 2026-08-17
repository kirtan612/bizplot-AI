from ml.data.extract import get_db_engine
import pandas as pd

engine = get_db_engine()
for t in ['import_jobs', 'import_files', 'import_logs']:
    df = pd.read_sql(f"SELECT * FROM {t} LIMIT 1;", engine)
    print(f"{t.upper()} COLUMNS:", df.columns.tolist())
