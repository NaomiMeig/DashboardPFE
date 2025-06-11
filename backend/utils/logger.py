# utils/logger.py
from models.log import Log
from models.user import User
from sqlalchemy.orm import Session

def log_action(db: Session, user_email: str, action: str):
    user = db.query(User).filter(User.email == user_email).first()
    if user:
        log = Log(action=action, user_id=user.id)
        db.add(log)
        db.commit()
