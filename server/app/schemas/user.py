import uuid

from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str
    role: UserRole

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "name": "johndoe",
                "password": "password",
                "role": "customer",
            }
        }
    }


class User(UserBase):
    id: uuid.UUID
    is_active: bool
    role: str

    model_config = {"from_attributes": True}


class UserSignUpResponse(BaseModel):
    user: User
    access_token: str


class UserLogin(BaseModel):
    username: str
    password: str


class AuthToken(BaseModel):
    access_token: str
    token_type: str


class UserChangePassword(BaseModel):
    current_password: str
    new_password: str


class UserForgotPassword(BaseModel):
    email: EmailStr


class UserResetPassword(BaseModel):
    password: str
    token: uuid.UUID
