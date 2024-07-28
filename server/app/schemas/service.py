import uuid

from fastapi import UploadFile
from pydantic import BaseModel

from app.schemas.user import User


class ServiceBase(BaseModel):
    title: str
    category: str
    description: str
    price: float
    price_type: str
    media: list[UploadFile] | None
    location: str
    tags: list[str]


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: uuid.UUID
    provider: User

    model_config = {"from_attributes": True}
