"""
FastAPI Authentication and Authorization Dependencies for BizPilot AI.
"""

import os
from typing import Generator, List, Union, Optional
from uuid import UUID
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.db.models import User, CompanyMember, Role
from api.auth.jwt import decode_access_token

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Load DB URL from env
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0613@127.0.0.1:5432/bizpilot")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Security schemes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)
http_bearer = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    """Authenticated user context object passed to protected routes."""
    user_id: UUID
    username: str
    email: Optional[str] = None
    company_id: UUID
    role: str


def get_db_session() -> Generator[Session, None, None]:
    """Provide a transactional database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    bearer_credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db_session)
) -> CurrentUser:
    """
    FastAPI dependency validating JWT token from Bearer header or OAuth2 form.
    Resolves user_id, company_id, and role from token claims and database.
    """
    jwt_token = None
    if bearer_credentials and bearer_credentials.credentials:
        jwt_token = bearer_credentials.credentials
    elif token:
        jwt_token = token

    if not jwt_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(jwt_token)
    user_id_str = payload.get("user_id") or payload.get("sub")
    company_id_str = payload.get("company_id")
    role_str = payload.get("role")

    if not user_id_str or not company_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = UUID(str(user_id_str))
    company_id = UUID(str(company_id_str))

    # Verify user exists and is active in DB
    user = db.query(User).filter(User.id == user_id, User.is_active == True, User.deleted_at == None).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify active role and membership for company_id
    if not role_str:
        membership = (
            db.query(CompanyMember, Role)
            .join(Role, CompanyMember.role_id == Role.id)
            .filter(CompanyMember.user_id == user_id, CompanyMember.company_id == company_id, CompanyMember.deleted_at == None)
            .first()
        )
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not an active member of target company",
            )
        role_str = membership[1].name

    return CurrentUser(
        user_id=user.id,
        username=user.username,
        email=user.email,
        company_id=company_id,
        role=role_str.lower()
    )


def require_role(allowed_roles: Union[List[str], str]):
    """
    Dependency factory enforcing Role-Based Access Control (RBAC).
    Raises 403 Forbidden if current_user.role is not in allowed_roles.
    """
    if isinstance(allowed_roles, str):
        allowed_set = {allowed_roles.lower()}
    else:
        allowed_set = {r.lower() for r in allowed_roles}

    def role_checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role.lower() not in allowed_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Action requires one of roles {list(allowed_set)}"
            )
        return current_user

    return role_checker
