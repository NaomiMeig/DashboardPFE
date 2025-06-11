from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str = "user"

class UserUpdate(BaseModel):
    email: Optional[str]
    password: Optional[str]
    role: Optional[str]
    
class UserOut(UserBase):
    id: int
    role: str
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    exp: Optional[datetime] = None