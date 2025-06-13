from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from models.datasource import DataSource
from schemas.datasource import DataSourceOut
from database import get_db
from routers.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/api", tags=["DataSources"])

@router.get("/datasources/me", response_model=List[DataSourceOut])
def get_my_datasources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(DataSource).filter(DataSource.user_id == current_user.id).order_by(DataSource.import_date.desc()).all()
