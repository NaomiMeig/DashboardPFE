from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, APIRouter, Path
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
import pandas as pd
import secrets
import io
import uvicorn
from database import get_db
from database import Base, engine
from models.user import User
from models.log import Log
from models.datasource import DataSource
from models.widget import Widget
from routers import upload
from routers import auth  # Import du routeur d'authentification
from routers import admin
from routers import log as log_router  # Import du routeur de logs
from fastapi.middleware.cors import CORSMiddleware

# --- Database Setup ---
Base.metadata.create_all(bind=engine)

# --- Configuration ---
SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Stockage temporaire en mémoire ---
temporary_storage = {}

# --- App FastAPI ---
app = FastAPI()

# --- Middleware CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Pour la prod, restreindre les origines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)

# Création des tables
Base.metadata.create_all(bind=engine)

# --- Include routers ---
app.include_router(auth.router)  # Inclusion du routeur d'authentification
app.include_router(admin.admin_router)
app.include_router(log_router.router)  # Inclusion du routeur de logs
app.include_router(upload.router)

# --- Modèles Pydantic ---
class UserSchema(BaseModel):
    email: str
    role: str = "user"

class UserInDB(UserSchema):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "user"

# --- Base de données simulée ---
fake_users_db = {
    "admin@example.com": {
        "email": "admin@example.com",
        "hashed_password": "secret",  # mot de passe en clair
        "role": "admin",
    },
    "user@example.com": {
        "email": "user@example.com",
        "hashed_password": "secret",  # mot de passe en clair
        "role": "user",
    },
}

# --- Route d'enregistrement ---
@app.post("/register")
async def register_user(new_user: UserCreate):
    if new_user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Utilisateur déjà existant")
    
    # En pratique on hacherait le mot de passe ici
    fake_users_db[new_user.email] = {
        "email": new_user.email,
        "hashed_password": new_user.password,
        "role": new_user.role
    }
    
    return {"message": "Utilisateur enregistré avec succès"}

# --- Authentification ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

def get_user(db, email: str):
    if email in db:
        return UserInDB(**db[email])

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Token invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user(fake_users_db, email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès admin requis")
    return current_user

# --- Route de login ---
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect",
        )
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Routes protégées ---
@app.get("/users/me")
async def read_users_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user

@app.get("/admin/users")
async def read_all_users(admin: UserSchema = Depends(get_current_admin)):
    return [
        {"email": user["email"], "role": user["role"]}
        for user in fake_users_db.values()
    ]
# --- Clear data (admin only) ---
@app.get("/api/clear")
async def clear_data(current_user: UserSchema = Depends(get_current_admin)):
    temporary_storage.clear()
    return {"message": "Données effacées avec succès"}

# --- Route pour supprimer un utilisateur ---
@app.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int = Path(..., title="ID de l'utilisateur à supprimer"),
    db: Session = Depends(get_db),
    current_user: UserSchema = Depends(get_current_admin)  # Seul un admin peut supprimer
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    db.delete(user)
    db.commit()

    return {"message": f"Utilisateur avec ID {user_id} supprimé avec succès."}

# --- Création du router admin ---
admin_router = APIRouter()

@admin_router.get("/stats")
async def get_stats(admin: UserSchema = Depends(get_current_admin)):
    return {
        "row_count": temporary_storage.get("row_count", 0),
        "stats": temporary_storage.get("stats", {})
    }

# --- Inclusion du router dans l'app avec préfixe /admin ---
app.include_router(admin_router, prefix="/admin")

# --- Lancer l'application ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)