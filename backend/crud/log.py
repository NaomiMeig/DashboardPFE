from sqlalchemy.orm import Session
from models.log import Log
from schemas.log import LogCreate

def create_log(db: Session, log: LogCreate):
    db_log = Log(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Log).offset(skip).limit(limit).all()

def get_logs_by_user(db: Session, user_id: int):
    return db.query(Log).filter(Log.user_id == user_id).all()
