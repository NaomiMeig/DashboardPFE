from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class DataSource(Base):
    __tablename__ = "datasources"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    import_date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    widgets = relationship("Widget", back_populates="datasource", cascade="all, delete-orphan")


    # Optionnel si tu veux une relation SQLAlchemy complète
    owner = relationship("User", back_populates="datasources")
