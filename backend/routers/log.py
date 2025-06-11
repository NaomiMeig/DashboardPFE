from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.log import Log
from models.user import User
from schemas.log import LogOut  # Tu dois créer ce schéma (voir plus bas)

router = APIRouter(tags=["Logs"], prefix="/logs")

def apply_filters(query, user_email: Optional[str], start_date: Optional[datetime], end_date: Optional[datetime], db: Session):
    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            query = query.filter(Log.user_id == user.id)
        else:
            # Si l'email n'existe pas, retourne rien
            query = query.filter(False)
    if start_date:
        query = query.filter(Log.timestamp >= start_date)
    if end_date:
        query = query.filter(Log.timestamp <= end_date)
    return query

@router.get("/", response_model=List[LogOut])
def get_logs(
    user_email: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Log).order_by(Log.timestamp.desc())
    query = apply_filters(query, user_email, start_date, end_date, db)
    logs = query.all()
    return logs
