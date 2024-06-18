from sqlalchemy import Column, Integer, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.session import Base


class Service(Base):
    __tablename__ = "services"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    title = Column(String, index=True)
    description = Column(String, index=True)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider = relationship("User", back_populates="services")
    bookings = relationship("Booking", back_populates="service")
