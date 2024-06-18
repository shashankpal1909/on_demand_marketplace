import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import dependencies
from app.models.booking import Booking as BookingModel
from app.models.user import User as UserModel
from app.schemas.booking import Booking as BookingSchema, BookingCreate

router = APIRouter()


@router.post("/", response_model=BookingSchema)
def create_booking(
        booking: BookingCreate,
        db: Session = Depends(dependencies.get_db),
        current_user: UserModel = Depends(dependencies.get_current_user),
):
    db_booking = BookingModel(**booking.dict(), customer_id=current_user.id)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/{booking_id}", response_model=BookingSchema)
def read_booking(booking_id: uuid.UUID, db: Session = Depends(dependencies.get_db)):
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
