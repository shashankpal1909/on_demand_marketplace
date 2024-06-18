import uuid

from pydantic import BaseModel


class ReviewBase(BaseModel):
    rating: int
    comment: str


class ReviewCreate(ReviewBase):
    booking_id: uuid.UUID


class Review(ReviewBase):
    id: uuid.UUID

    class Config:
        from_attributes = True
