from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.schemas.user import UserCreate


def create_user(db: Session, user: UserCreate, role: str = UserRole.customer) -> User:
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        role=role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user
