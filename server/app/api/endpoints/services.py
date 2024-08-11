import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi import File, Form, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from app.api import dependencies
from app.crud.service import create_service, update_service
from app.models.service import Service as ServiceModel, PricingType
from app.models.user import User as UserModel
from app.schemas.service import ServiceCreate

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_new_service(
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
    """
    This route creates a new service
    """
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
    return db.query(ServiceModel).filter_by(id=db_service.id).first()


@router.get("")
def get_services(db: Session = Depends(dependencies.get_db),
                 current_user: UserModel = Depends(dependencies.get_current_user)):
    """
    This route returns all services available
    """
    return db.query(ServiceModel).options(joinedload(ServiceModel.tags)).filter(
        ServiceModel.provider_id == current_user.id).order_by(ServiceModel.updated_at.asc()).all()


@router.get("/{service_id}")
def read_service(service_id: uuid.UUID, db: Session = Depends(dependencies.get_db)):
    """
    This route returns a service by its id.

    params
    params
    - service_id: unique id of the service
    """
    service = db.query(ServiceModel).options(joinedload(ServiceModel.media), joinedload(ServiceModel.tags)).filter(
        ServiceModel.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")

    return service


@router.put("/{service_id}")
def update_existing_service(
        service_id: uuid.UUID,
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

    db_service = db.query(ServiceModel).options(joinedload(ServiceModel.media), joinedload(ServiceModel.tags)).filter(
        ServiceModel.id == service_id).first()

    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")

    if db_service.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db_service = update_service(db, db_service, req_body)
    return db.query(ServiceModel).filter_by(id=db_service.id).first()
