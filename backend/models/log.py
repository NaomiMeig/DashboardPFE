# backend/models/log.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Log(Base):  # ✅ renommé ici
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="logs")
