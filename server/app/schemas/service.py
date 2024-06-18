import uuid

from pydantic import BaseModel

from app.schemas.user import User


class ServiceBase(BaseModel):
    title: str
    description: str


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: uuid.UUID
    provider: User

    class Config:
        from_attributes = True
