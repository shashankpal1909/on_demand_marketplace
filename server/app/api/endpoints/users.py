from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.api import dependencies
from app.core import security
from app.crud.token import create_token
from app.crud.user import create_user
from app.models.token import Token as TokenModel, TokenType
from app.models.user import User as UserModel, UserRole
from app.schemas.user import (
    UserCreate,
    UserChangePassword,
    AuthToken,
    UserForgotPassword,
    UserResetPassword, UserSignUpResponse,
)
from app.utils.mail import send_verification_email, send_reset_password_email

router = APIRouter()


@router.post("/sign-up", response_model=UserSignUpResponse, status_code=status.HTTP_201_CREATED)
def register_service_provider(
        req_body: UserCreate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(dependencies.get_db),
):
    if req_body.role == UserRole.admin:
        raise HTTPException(status_code=403, detail="forbidden")

    existing_username = (
        db.query(UserModel).filter(UserModel.username == req_body.username).first()
    )

    if existing_username is not None:
        raise HTTPException(status_code=400, detail="username already in use")

    existing_email = (
        db.query(UserModel).filter(UserModel.email == req_body.email).first()
    )

    if existing_email is not None:
        raise HTTPException(status_code=400, detail="email already in use")

    user = create_user(db, req_body)

    token = create_token(db, user, TokenType.verify_email)

    background_tasks.add_task(
        send_verification_email,
        name=user.name,
        email=user.email,
        token=token.id,
    )

    access_token = security.create_access_token(data={"sub": user.username})

    return {"user": user, "access_token": access_token}


@router.post("/sign-in", response_model=AuthToken, status_code=status.HTTP_200_OK)
def login(
        user: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Session = Depends(dependencies.get_db),
):
    db_user = db.query(UserModel).filter(
        UserModel.username == user.username or UserModel.email == user.username).first()
    if not db_user or not security.verify_password(
            user.password, db_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = security.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify", status_code=status.HTTP_204_NO_CONTENT)
def verify_email(
        token: str,
        db: Session = Depends(dependencies.get_db),
):
    token = db.query(TokenModel).filter(TokenModel.id == token).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    if token.type != TokenType.verify_email:
        raise HTTPException(status_code=400, detail="Invalid token")

    if token.expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(UserModel).filter(UserModel.id == token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = True
    db.commit()


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
        req_body: UserChangePassword,
        current_user: UserModel = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    if not security.verify_password(
            req_body.current_password, current_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid current password")

    new_password = security.get_password_hash(req_body.new_password)
    current_user.hashed_password = new_password

    db.commit()


@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
def forgot_password(
        req_body: UserForgotPassword,
        background_tasks: BackgroundTasks,
        db: Session = Depends(dependencies.get_db),
):
    db_user = db.query(UserModel).filter(UserModel.email == req_body.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_token = create_token(db, db_user, TokenType.reset_password)

    background_tasks.add_task(
        send_reset_password_email,
        name=db_user.name,
        email=db_user.email,
        token=db_token.id,
    )


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(
        req_body: UserResetPassword,
        db: Session = Depends(dependencies.get_db),
):
    db_token = db.query(TokenModel).filter(TokenModel.id == req_body.token).first()
    if not db_token or db_token.expires_at <= datetime.now():
        raise HTTPException(status_code=400, detail="Invalid/Expired Token")

    db_user = db.query(UserModel).filter(UserModel.id == db_token.user_id).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid/Expired Token")

    new_password = security.get_password_hash(req_body.password)
    db_user.hashed_password = new_password

    db.commit()


@router.get("/current-user", status_code=status.HTTP_200_OK)
def get_current_user(
        current_user: UserModel = Depends(dependencies.get_current_user),
):
    del current_user.hashed_password
    return current_user
