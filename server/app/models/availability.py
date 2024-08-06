import enum
import uuid

from sqlalchemy import Column, String, Boolean, UUID, Enum, DateTime, func, Time, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class AvailabilityDay(str, enum.Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"


class Availability(Base):
    __tablename__ = "recurring_availabilities"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    user = relationship("User", back_populates="recurring_availabilities")
    day = Column(Enum(AvailabilityDay))
    start_time = Column(Time)
    end_time = Column(Time)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
