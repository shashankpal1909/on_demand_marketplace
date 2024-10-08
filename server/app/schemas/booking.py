import uuid
from datetime import datetime

from pydantic import BaseModel

from app.schemas.service import Service
from app.schemas.user import User


class BookingBase(BaseModel):
    booking_time: datetime


class BookingCreate(BookingBase):
    service_id: uuid.UUID


class Booking(BookingBase):
    id: uuid.UUID
    service: Service
    customer: User
    status: str

    model_config = {"from_attributes": True}
