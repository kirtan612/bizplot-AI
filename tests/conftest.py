"""
Shared Pytest Fixtures & Test Setup for BizPilot AI.
Ensures test users (admin_demo, staff_demo) exist with deterministic credentials
in whichever database engine is active during test runs.
"""

import os
import sys
# pyrefly: ignore [missing-import]
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.db.models import Base, User, Role, CompanyMember, Company
from scripts.seed_company_and_users import hash_password, seed_database
from api.auth.dependencies import engine as db_engine


@pytest.fixture(scope="session", autouse=True)
def setup_test_credentials():
    """
    Autouse session fixture ensuring database tables are initialized
    and demo users have predictable credentials for API tests.
    """
    try:
        Base.metadata.create_all(bind=db_engine)
        seed_database(engine=db_engine)
        
        SessionLocal = sessionmaker(bind=db_engine)
        db = SessionLocal()
        
        admin_user = db.query(User).filter_by(username="admin_demo").first()
        staff_user = db.query(User).filter_by(username="staff_demo").first()
        
        if admin_user:
            admin_user.password_hash = hash_password("AdminDemo123!")
        if staff_user:
            staff_user.password_hash = hash_password("StaffDemo123!")
            
        db.commit()
        db.close()
    except Exception as e:
        print(f"[conftest] Note: DB credential setup skipped or encounter error: {e}")
