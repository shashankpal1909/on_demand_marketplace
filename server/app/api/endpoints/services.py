from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from app.api import dependencies
from app.models.service import Service as ServiceModel
from app.models.user import User as UserModel, UserRole
from app.schemas.service import Service as ServiceSchema, ServiceCreate

router = APIRouter()


@router.post("/", response_model=ServiceSchema)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: UserModel = Depends(dependencies.get_current_user),
):
    if current_user.role != UserRole.provider:
        raise HTTPException(status_code=403, detail="Not authorized to create service")
    db_service = ServiceModel(**service.dict(), provider_id=current_user.id)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


@router.get("/{service_id}", response_model=ServiceSchema)
def read_service(service_id: uuid.UUID, db: Session = Depends(dependencies.get_db)):
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
