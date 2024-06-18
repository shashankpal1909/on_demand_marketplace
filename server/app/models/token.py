import enum
import uuid
from datetime import datetime, timedelta

from sqlalchemy import Column, UUID, ForeignKey, DateTime, func, Enum

from app.db.session import Base


class TokenType(enum.Enum):
    reset_password = "reset_password"
    verify_email = "verify_email"


class Token(Base):
    __tablename__ = "tokens"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    type = Column(Enum(TokenType))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    expires_at = Column(DateTime, default=datetime.now() + timedelta(minutes=15))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
