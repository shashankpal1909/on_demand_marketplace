from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from app.api import dependencies
from app.models.review import Review as ReviewModel
from app.models.user import User as UserModel
from app.schemas.review import Review, ReviewCreate

router = APIRouter()


@router.post("/", response_model=Review)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: UserModel = Depends(dependencies.get_current_user),
):
    db_review = ReviewModel(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@router.get("/{service_id}", response_model=list[Review])
def read_reviews(service_id: uuid.UUID, db: Session = Depends(dependencies.get_db)):
    reviews = db.query(ReviewModel).filter(ReviewModel.service_id == service_id).all()
    return reviews
