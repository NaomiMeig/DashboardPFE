from pydantic import BaseModel
from datetime import datetime

class DataSourceOut(BaseModel):
    id: int
    filename: str
    import_date: datetime

    class Config:
        orm_mode = True
