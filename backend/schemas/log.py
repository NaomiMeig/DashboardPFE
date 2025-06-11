# backend/schemas/log.py
from pydantic import BaseModel
from datetime import datetime

class LogOut(BaseModel):
    id: int
    action: str
    timestamp: datetime
    user_email: str  # Ajout de l'email ici

    class Config:
        orm_mode = True
