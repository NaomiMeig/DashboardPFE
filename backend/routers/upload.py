# routers/upload.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import pandas as pd
import io
from database import get_db
from models.log import Log
from models.user import User
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Upload"])

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        content = await file.read()
        filename = file.filename

        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(content))
        else:
            return JSONResponse(status_code=400, content={"error": "Format de fichier non supporté"})

        df = df.dropna(how='all')
        numeric_columns = df.select_dtypes(include='number').columns.tolist()
        columns = df.columns.tolist()

        stats = {
            col: {
                "sum": float(df[col].sum()),
                "avg": float(df[col].mean()),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "count": int(df[col].count()),
            }
            for col in numeric_columns
        }

        # Stockage temporaire (à remplacer par un stockage en base si nécessaire)
        temporary_storage = {
            "data": df.to_dict(orient="records"),
            "columns": columns,
            "numeric_columns": numeric_columns,
            "stats": stats,
            "row_count": int(len(df))
        }
        
        new_log = Log(
            action=f"Importation de fichier '{filename}'",
            user_id=current_user.id
        )
        db.add(new_log)
        db.commit()
        
        return temporary_storage

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Erreur de traitement : {str(e)}"})