import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0613@127.0.0.1:5432/bizpilot")

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
tables = [r[0] for r in cur.fetchall()]
print(f"Total Tables in DB: {len(tables)}\n" + "-"*40)
for t in tables:
    cur.execute(f'SELECT COUNT(*) FROM "{t}";')
    print(f"  {t:<25}: {cur.fetchone()[0]:>6} rows")
cur.close()
conn.close()
