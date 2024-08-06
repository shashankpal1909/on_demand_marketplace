from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.api import dependencies
from app.models.user import User
from app.schemas.availability import RecurringAvailabilityRequestBody
from app.models.availability import Availability
from starlette import status
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
def save_recurring_availability(
        req_body: RecurringAvailabilityRequestBody,
        current_user: User = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    for availability in req_body.availabilities:
        db_availability = db.query(Availability).filter(
            Availability.user_id == current_user.id,
            Availability.day == availability.day.strip().lower()
        ).first()

        if db_availability:
            db_availability.start_time = availability.start_time
            db_availability.end_time = availability.end_time
            db_availability.is_available = availability.is_available
        else:
            db_availability = Availability(
                user_id=current_user.id,
                day=availability.day.strip().lower(),
                start_time=availability.start_time,
                end_time=availability.end_time,
                is_available=availability.is_available
            )
            db.add(db_availability)

        logger.info(f"Updated availability for {db_availability.day}")

    db.commit()


@router.get("", status_code=status.HTTP_200_OK)
def get_all_availabilities(
        current_user: User = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    return db.query(Availability).filter(Availability.user_id == current_user.id).all()


@router.get("/{day}", status_code=status.HTTP_200_OK)
def get_availability_by_day(
        day: str,
        current_user: User = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    availability = db.query(Availability).filter(
        and_(Availability.user_id == current_user.id, Availability.day == day.strip().lower())
    ).first()

    if not availability:
        raise HTTPException(status_code=404, detail="Availability not found")

    return availability


@router.delete("/{day}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability_by_day(
        day: str,
        current_user: User = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    availability = db.query(Availability).filter(
        and_(Availability.user_id == current_user.id, Availability.day == day.strip().lower())
    ).first()

    if availability:
        db.delete(availability)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Availability not found")


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_all_availabilities(
        current_user: User = Depends(dependencies.get_current_user),
        db: Session = Depends(dependencies.get_db),
):
    availabilities = db.query(Availability).filter(Availability.user_id == current_user.id).all()

    if availabilities:
        for availability in availabilities:
            db.delete(availability)

        db.commit()
