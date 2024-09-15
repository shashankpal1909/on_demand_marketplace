from sqlalchemy.orm import Session

from app.models.token import TokenType, Token
from app.models.user import User


def create_token(
    db: Session, user: User, token_type: TokenType = TokenType.reset_password
):
    token = Token(type=token_type, user_id=user.id)

    db.add(token)
    db.commit()

    return token
