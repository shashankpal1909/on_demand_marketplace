from sqlalchemy import Column, Integer, String, Boolean, UUID, Enum
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.session import Base


class UserRole(enum.Enum):
    admin = "admin"
    customer = "customer"
    provider = "provider"


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.customer)
    services = relationship("Service", back_populates="provider")
