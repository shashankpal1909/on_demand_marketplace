from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.api import dependencies
from app.core import security
from app.crud.user import create_user
from app.models.token import Token as TokenModel, TokenType
from app.models.user import User as UserModel, UserRole
from app.schemas.user import User, UserCreate, UserChangePassword, AuthToken, UserForgotPassword, UserResetPassword
from app.utils.mail import send_email

router = APIRouter()


@router.post(
    "/register/customer", response_model=User, status_code=status.HTTP_201_CREATED
)
def register_service_customer(
        user: UserCreate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(dependencies.get_db),
):
    db_user = create_user(db, user)

    background_tasks.add_task(
        send_email,
        "welcome",
        [db_user.email],
        "Welcome to the On-Demand Service Marketplace",
    )

    return db_user


@router.post(
    "/register/provider", response_model=User, status_code=status.HTTP_201_CREATED
)
def register_service_provider(
        user: UserCreate, db: Session = Depends(dependencies.get_db)
):
    hashed_password = security.get_password_hash(user.password)
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=UserRole.provider,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/token", response_model=AuthToken, status_code=status.HTTP_200_OK)
def login(
        user: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Session = Depends(dependencies.get_db),
):
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if not db_user or not security.verify_password(
            user.password, db_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = security.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


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

    db_token = TokenModel(type=TokenType.reset_password, user_id=db_user.id)

    db.add(db_token)
    db.commit()

    background_tasks.add_task(
        send_email,
        "forgot_password",
        [db_user.email],
        f"Reset your password: {db_token.id}",
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
