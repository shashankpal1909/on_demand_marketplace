from pydantic import BaseModel
import uuid


class ReviewBase(BaseModel):
    rating: int
    comment: str


class ReviewCreate(ReviewBase):
    booking_id: uuid.UUID


class Review(ReviewBase):
    id: uuid.UUID

    class Config:
        from_attributes = True
