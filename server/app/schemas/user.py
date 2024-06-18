from pydantic import BaseModel
import uuid


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: uuid.UUID
    is_active: bool
    role: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserChangePassword(BaseModel):
    current_password: str
    new_password: str
