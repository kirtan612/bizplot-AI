from ml.data.extract import get_db_engine
from src.db.base import Base
import src.db.models  # Imports all models including Phase 12 Executive models

engine = get_db_engine()
Base.metadata.create_all(engine)
print("Phase 12 Multi-Agent Executive tables created successfully in PostgreSQL!")
