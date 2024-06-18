import uuid

from sqlalchemy import Column, ForeignKey, String, UUID, DateTime, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    booking_time = Column(DateTime)
    status = Column(String, default="pending")
    service = relationship("Service", back_populates="bookings")
    customer = relationship("User")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
