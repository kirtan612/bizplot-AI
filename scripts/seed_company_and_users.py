"""
Seed Script: Initial Company, Roles, and Demo Users
BizPilot AI Database Schema

Inserts:
- 1 Organization Company ("APL Pipes & Traders")
- 2 System Roles ('admin', 'staff')
- 2 Demo Users ('admin_demo', 'staff_demo') with bcrypt-hashed passwords printed ONCE on console
- Links users via company_members table

Usage:
  python scripts/seed_company_and_users.py
  python scripts/seed_company_and_users.py --db-url "postgresql://postgres:secret@localhost:5432/bizpilot_ai"
  python scripts/seed_company_and_users.py --sqlite
"""

import os
import sys
import uuid
import secrets
import string
import argparse
from typing import Dict

import bcrypt
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

# Load .env file if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Ensure project root is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.db.models import Base, Company, User, Role, CompanyMember


def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against a bcrypt hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def generate_secure_password(length: int = 14) -> str:
    """Generates a secure random alphanumeric password."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def seed_database(db_url: str = None, engine=None) -> Dict[str, str]:
    """
    Seeds initial company, roles, and users into PostgreSQL database.
    Returns generated plaintext passwords to display ONCE to console.
    """
    if engine is None:
        if db_url is None:
            db_url = os.getenv(
                "DATABASE_URL",
                "postgresql://postgres:postgres@localhost:5432/bizpilot_ai"
            )

        connect_args = {}
        if "sqlite" in db_url:
            connect_args["check_same_thread"] = False

        engine = create_engine(db_url, connect_args=connect_args)
    
    # Ensure tables exist
    Base.metadata.create_all(engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    demo_passwords = {}

    try:
        # 1. Seed Company
        company = session.execute(
            select(Company).where(Company.code == "COMP-001")
        ).scalar_one_or_none()

        if not company:
            company = Company(
                name="APL Pipes & Traders",
                code="COMP-001",
                is_active=True
            )
            session.add(company)
            session.flush()

        # 2. Seed Roles
        admin_role = session.execute(
            select(Role).where(Role.name == "admin")
        ).scalar_one_or_none()
        if not admin_role:
            admin_role = Role(name="admin", description="Full administrative access")
            session.add(admin_role)

        staff_role = session.execute(
            select(Role).where(Role.name == "staff")
        ).scalar_one_or_none()
        if not staff_role:
            staff_role = Role(name="staff", description="Standard staff operational access")
            session.add(staff_role)

        session.flush()

        # 3. Seed Demo Users
        admin_pass = generate_secure_password()
        admin_user = session.execute(
            select(User).where(User.username == "admin_demo")
        ).scalar_one_or_none()

        if not admin_user:
            admin_user = User(
                username="admin_demo",
                email="admin@aplpipes.com",
                password_hash=hash_password(admin_pass),
                is_active=True
            )
            session.add(admin_user)
            session.flush()
            demo_passwords["admin_demo"] = admin_pass

            # Link company member
            admin_member = CompanyMember(
                company_id=company.id,
                user_id=admin_user.id,
                role_id=admin_role.id
            )
            session.add(admin_member)

        staff_pass = generate_secure_password()
        staff_user = session.execute(
            select(User).where(User.username == "staff_demo")
        ).scalar_one_or_none()

        if not staff_user:
            staff_user = User(
                username="staff_demo",
                email="staff@aplpipes.com",
                password_hash=hash_password(staff_pass),
                is_active=True
            )
            session.add(staff_user)
            session.flush()
            demo_passwords["staff_demo"] = staff_pass

            # Link company member
            staff_member = CompanyMember(
                company_id=company.id,
                user_id=staff_user.id,
                role_id=staff_role.id
            )
            session.add(staff_member)

        session.commit()
        return demo_passwords

    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="BizPilot AI Database Seed Script")
    parser.add_argument("--db-url", type=str, help="Custom database URL connection string")
    parser.add_argument("--sqlite", action="store_true", help="Use local SQLite database (bizpilot_ai.db) for testing")
    args = parser.parse_args()

    target_url = args.db_url
    if args.sqlite:
        target_url = "sqlite:///bizpilot_ai.db"

    print("=" * 65)
    print("      BizPilot AI Database Seeding (Company + Users + Roles)")
    print("=" * 65)
    try:
        passwords = seed_database(db_url=target_url)
        if passwords:
            print("\n[SUCCESS] Seeding complete! Generated initial passwords:")
            print("-" * 65)
            for user, pwd in passwords.items():
                print(f"  User: {user:<15} Password: {pwd}")
            print("-" * 65)
            print("  IMPORTANT: Copy these passwords NOW! They are bcrypt hashed and")
            print("  will NEVER be logged or shown again.\n")
        else:
            print("\n[INFO] Database already seeded. No new credentials created.\n")
    except Exception as ex:
        print(f"\n[ERROR] Database seeding failed: {ex}\n")
        print("💡 TROUBLESHOOTING HELP:")
        print("1. Set your PostgreSQL password in a .env file:")
        print("   DATABASE_URL=postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/bizpilot_ai")
        print("2. Or pass your database connection URL via CLI:")
        print("   python scripts/seed_company_and_users.py --db-url \"postgresql://postgres:YOUR_PASSWORD@localhost:5432/bizpilot_ai\"")
        print("3. Or run with a local SQLite file for dry-run testing:")
        print("   python scripts/seed_company_and_users.py --sqlite\n")
        sys.exit(1)
