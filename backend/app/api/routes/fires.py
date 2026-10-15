
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services.firms.importer import import_fires_from_nasa
from app.database.connection import get_db
from app.database.models import Fire
from app.schemas.fire import FireResponse


router = APIRouter(
    prefix="/api/fires",
    tags=["Fires"]
)


@router.get("/", response_model=list[FireResponse])
def get_fires(db: Session = Depends(get_db)):
    fires = (
        db.query(Fire)
        .order_by(Fire.detected_at.desc())
        .all()
    )
    return fires


@router.post("/import")
def import_nasa_fires(db: Session = Depends(get_db)):
    try:
        result = import_fires_from_nasa(db)
        return {
            "status": "success",
            "source": "NASA FIRMS",
            **result,
        }
    except Exception:
        db.rollback()
        raise
