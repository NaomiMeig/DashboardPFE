from sqlalchemy.orm import Session
from database import SessionLocal
from sqlalchemy import text

def test_connection():
    try:
        db: Session = SessionLocal()
        db.execute(text("SELECT 1"))
        print("✅ Connexion à MySQL réussie")
    except Exception as e:
        print("❌ Erreur de connexion à MySQL :", e)
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()
