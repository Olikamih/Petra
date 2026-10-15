
from datetime import datetime
from typing import Any


def prepare_fire_data(fire: Any) -> dict:
    """
    Normaliza um registro Fire para análise pela IA do Petra.
    Não realiza previsões nem altera o registro no banco.
    """

    detected_at = getattr(fire, "detected_at", None)

    if isinstance(detected_at, datetime):
        detected_at = detected_at.isoformat()

    confidence = getattr(fire, "confidence", None)

    return {
        "id": getattr(fire, "id", None),
        "source": getattr(fire, "source", None),
        "detected_at": detected_at,
        "latitude": getattr(fire, "latitude", None),
        "longitude": getattr(fire, "longitude", None),
        "confidence": confidence,
        "frp": getattr(fire, "frp", None),
        "satellite": getattr(fire, "satellite", None),
        "instrument": getattr(fire, "instrument", None),
    }

