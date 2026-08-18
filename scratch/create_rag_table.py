from ml.data.extract import get_db_engine
from src.db.base import Base
import src.db.models  # Imports all models

engine = get_db_engine()
Base.metadata.create_all(engine)
print("Phase 11 RAG DocumentChunk table created successfully in PostgreSQL!")
