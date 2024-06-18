import uuid

from sqlalchemy import Column, String, ForeignKey, UUID, DateTime, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Service(Base):
    __tablename__ = "services"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    title = Column(String, index=True)
    description = Column(String, index=True)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider = relationship("User", back_populates="services")
    bookings = relationship("Booking", back_populates="service")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
