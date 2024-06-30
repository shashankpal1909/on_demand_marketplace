import enum
import uuid

from sqlalchemy import Column, String, Boolean, UUID, Enum, DateTime, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    customer = "customer"
    provider = "provider"


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.customer)
    services = relationship("Service", back_populates="provider")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
