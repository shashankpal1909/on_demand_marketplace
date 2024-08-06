import uuid
from typing import List

from alembic.util import status
from fastapi import APIRouter, Depends, HTTPException
from fastapi import File, Form, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from app.api import dependencies
from app.crud.service import create_service
from app.models.service import Service as ServiceModel, PricingType, Service
from app.models.user import User as UserModel, UserRole
from app.schemas.service import Service as ServiceSchema, ServiceCreate
from tests.conftest import db_session

router = APIRouter()


# @router.post("/outdated", response_model=ServiceSchema, deprecated=True)
# def create_service(
#         service: ServiceCreate,
#         db: Session = Depends(dependencies.get_db),
#         current_user: UserModel = Depends(dependencies.get_current_user),
# ):
#     if current_user.role != UserRole.provider:
#         raise HTTPException(status_code=403, detail="Not authorized to create service")
#     db_service = ServiceModel(**service.dict(), provider_id=current_user.id)
#     db.add(db_service)
#     db.commit()
#     db.refresh(db_service)
#     return db_service


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_new_service(
        name: str = Form(...),
        category: str = Form(...),
        description: str = Form(...),
        pricing_type: PricingType = Form(...),
        pricing: float = Form(...),
        location: str = Form(...),
        tags: List[str] = Form(...),
        media: List[UploadFile] = File(...),
        db: Session = Depends(dependencies.get_db),
        current_user: UserModel = Depends(dependencies.get_current_user),
):
    req_body = ServiceCreate(
        title=name,
        category=category,
        description=description,
        pricing_type=pricing_type,
        pricing=pricing,
        location=location,
        tags=tags,
        media=media,
    )

    db_service = create_service(db, current_user, req_body)
    return {"service": db_service}


@router.get("")
def get_services(db: Session = Depends(dependencies.get_db)):
    return db.query(ServiceModel).all()


@router.get("/{service_id}")
def read_service(service_id: uuid.UUID, db: Session = Depends(dependencies.get_db)):
    service = db.query(ServiceModel).options(joinedload(Service.media)).filter(ServiceModel.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")

    return service
