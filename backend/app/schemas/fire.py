from datetime import datetime
from pydantic import BaseModel


class FireResponse(BaseModel):
    id: int
    source: str
    external_id: str | None
    detected_at: datetime

    latitude: float
    longitude: float

    confidence: str | None
    frp: float | None

    satellite: str | None
    instrument: str | None

    class Config:
        from_attributes = True