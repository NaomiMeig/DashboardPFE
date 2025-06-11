from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List

from database import get_db
from models.user import User
from models.widget import Widget
from models.log import Log
from schemas.user import UserOut, UserUpdate
from schemas.log import LogOut
from utils.auth import hash_password  # Assurez-vous que cette fonction existe

# Création du routeur admin unique
admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# --- Routes de gestion des utilisateurs ---
@admin_router.get("/users", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    """Récupère la liste de tous les utilisateurs"""
    return db.query(User).all()

@admin_router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Supprime un utilisateur par son ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprimé"}

@admin_router.put("/users/{user_id}")
def update_user(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):
    """Modifie un utilisateur (email, mot de passe, rôle)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    if update.email:
        user.email = update.email
    if update.password:
        user.hashed_password = hash_password(update.password)
    if update.role:
        user.role = update.role
    db.commit()
    return {"message": "Utilisateur modifié avec succès"}

# --- Routes de gestion des logs ---
@admin_router.get("/logs/today-count")
def logs_today_count(db: Session = Depends(get_db)):
    """Compte le nombre de logs pour aujourd'hui"""
    today = datetime.utcnow().date()
    count = db.query(Log).filter(func.date(Log.timestamp) == today).count()
    return {"count": count}

@admin_router.get("/logs", response_model=List[LogOut])
def get_action_logs(db: Session = Depends(get_db)):
    """Récupère les 100 dernières actions enregistrées dans les logs"""
    logs = db.query(Log).order_by(Log.timestamp.desc()).limit(100).all()
    return [
        LogOut(
            id=log.id,
            action=log.action,
            timestamp=log.timestamp,
            user_email=log.user.email if log.user else "Utilisateur inconnu"
        )
        for log in logs
    ]

# --- Routes de statistiques ---
@admin_router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Récupère les statistiques générales de l'application"""
    user_count = db.query(User).count()
    widget_count = db.query(Widget).count()
    log_count = db.query(Log).count()
    return {
        "stats": {
            "users": user_count,
            "widgets": widget_count,
            "logs": log_count
        }
    }
