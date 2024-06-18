from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import dependencies
from app.models.service import Service as ServiceModel
from app.models.user import User as UserModel, UserRole
from app.schemas.service import Service as ServiceSchema
from app.schemas.user import User as UserSchema

router = APIRouter()


@router.get("/users", response_model=List[UserSchema])
def list_users(
        db: Session = Depends(dependencies.get_db),
        current_user: UserModel = Depends(dependencies.get_current_user),
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(UserModel).all()
    return users


@router.get("/services", response_model=List[ServiceSchema])
def list_services(
        db: Session = Depends(dependencies.get_db),
        current_user: ServiceModel = Depends(dependencies.get_current_user),
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    services = db.query(ServiceModel).all()
    return services
