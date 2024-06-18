from sqlalchemy import Column, Integer, String, ForeignKey, UUID
import uuid

from app.db.session import Base


class Review(Base):
    __tablename__ = "reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"))
    rating = Column(Integer)
    comment = Column(String)
