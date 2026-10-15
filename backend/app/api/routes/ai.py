from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Fire
from app.ai.services.fire_analysis import analyze_fire
from app.ai.services.hotspot_clustering import cluster_hotspots

router = APIRouter(
    prefix="/api/ai",
    tags=["Artificial Intelligence"],
)


@router.get("/fires/{fire_id}")
def analyze_fire_by_id(
    fire_id: int,
    db: Session = Depends(get_db),
):
    fire = db.query(Fire).filter(Fire.id == fire_id).first()

    if fire is None:
        raise HTTPException(
            status_code=404,
            detail="Fire record not found",
        )

    return analyze_fire(fire)


@router.get("/hotspots")
def get_hotspots(
    source: str | None = Query(default=None),
    confidence: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return cluster_hotspots(
        db,
        source=source,
        confidence=confidence,
    )