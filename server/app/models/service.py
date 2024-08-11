import enum
import uuid

from sqlalchemy import Column, String, ForeignKey, UUID, DateTime, func, Enum, Float, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.session import Base


class PricingType(str, enum.Enum):
    fixed = "fixed"
    hourly = "hourly"


class ServiceMedia(Base):
    __tablename__ = 'services_media'
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    url = Column(String, nullable=False)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"))
    service = relationship("Service", back_populates="media")


class ServiceTag(Base):
    __tablename__ = 'services_tags'
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    text = Column(String)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"))
    service = relationship("Service", back_populates="tags")


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    title = Column(String, index=True)
    description = Column(String, index=True)
    category = Column(String, index=True)
    pricing = Column(Float, nullable=False)
    pricing_type = Column(Enum(PricingType), index=True)
    media = relationship('ServiceMedia', back_populates='service')
    location = Column(String, index=True)
    tags = relationship('ServiceTag', back_populates='service')
    provider_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider = relationship("User", back_populates="services")
    bookings = relationship("Booking", back_populates="service")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        CheckConstraint('pricing > 0', name='check_price'),
    )
