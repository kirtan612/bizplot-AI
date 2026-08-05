"""
Authentication FastAPI Router for BizPilot AI.
Endpoints:
  POST /api/auth/login -> JWT issuance
  GET /api/auth/me    -> Identity & Role introspection
"""

from typing import Optional
from uuid import UUID
import bcrypt
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.models import User, CompanyMember, Role
from api.auth.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_SECONDS
from api.auth.dependencies import get_db_session, get_current_user, CurrentUser

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    expires_in: int = ACCESS_TOKEN_EXPIRE_SECONDS


class UserMeResponse(BaseModel):
    user_id: UUID
    username: str
    email: Optional[str] = None
    company_id: UUID
    role: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against bcrypt hash."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


@router.post("/login", response_model=TokenResponse, summary="Authenticate user and issue JWT token")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db_session)
):
    """
    Authenticate user with username and password.
    Returns access_token, role, and expiry duration.
    """
    username = login_data.username
    password = login_data.password

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )

    # Query user
    user = db.query(User).filter(User.username == username, User.is_active == True, User.deleted_at == None).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Query company membership & role
    membership = (
        db.query(CompanyMember, Role)
        .join(Role, CompanyMember.role_id == Role.id)
        .filter(CompanyMember.user_id == user.id, CompanyMember.deleted_at == None)
        .first()
    )
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not associated with any active company"
        )

    company_member, role = membership
    role_name = role.name.lower()

    # Issue JWT token
    token_claims = {
        "sub": str(user.id),
        "user_id": str(user.id),
        "company_id": str(company_member.company_id),
        "role": role_name,
        "username": user.username,
    }
    access_token = create_access_token(data=token_claims)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=role_name,
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS
    )


@router.get("/me", response_model=UserMeResponse, summary="Get current user identity and role")
def get_me(current_user: CurrentUser = Depends(get_current_user)):
    """Return authenticated user identity, company_id, and assigned role."""
    return UserMeResponse(
        user_id=current_user.user_id,
        username=current_user.username,
        email=current_user.email,
        company_id=current_user.company_id,
        role=current_user.role
    )
