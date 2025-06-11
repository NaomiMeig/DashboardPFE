from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Widget(Base):
    __tablename__ = "widgets"

    id = Column(Integer, primary_key=True, index=True)
    chart_type = Column(String(50))  # exemple: "Bar", "Pie"
    config = Column(Text)  # JSON stringifié de la config (ex: colonnes, couleurs)
    datasource_id = Column(Integer, ForeignKey("datasources.id", ondelete="CASCADE"), index=True)

    datasource = relationship("DataSource", back_populates="widgets")
