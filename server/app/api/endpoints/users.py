from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status
from sqlalchemy.orm import Session

from app.api import dependencies
from app.core import security
from app.models.user import User as UserModel, UserRole
from app.schemas.user import User, UserCreate, UserChangePassword, Token
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
    hashed_password = security.get_password_hash(user.password)
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=UserRole.customer,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

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


@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
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
