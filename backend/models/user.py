from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(20), default="user")

    datasources = relationship("DataSource", back_populates="owner", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="user")  # ✅ Ajout de la relation avec les logs
