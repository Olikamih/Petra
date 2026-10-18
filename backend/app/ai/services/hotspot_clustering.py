import numpy as np
from sklearn.cluster import DBSCAN
from sqlalchemy.orm import Session

from app.database.models import Fire


def _classify_priority(
    detections: int,
    average_frp: float | None,
    high_confidence_ratio: float,
) -> dict:
    """Classifica a prioridade por regras heurísticas, não por previsão."""

    score = 0
    reasons = []

    if detections >= 20:
        score += 2
        reasons.append("Grande quantidade de deteccoes")
    elif detections >= 8:
        score += 1
        reasons.append("Quantidade relevante de deteccoes")

    if average_frp is not None:
        if average_frp >= 20:
            score += 2
            reasons.append("FRP medio elevado")
        elif average_frp >= 8:
            score += 1
            reasons.append("FRP medio moderado")

    if high_confidence_ratio >= 0.5:
        score += 1
        reasons.append("Pelo menos metade das deteccoes tem confianca alta")

    if score >= 5:
        level = "critica"
    elif score >= 3:
        level = "alta"
    elif score >= 1:
        level = "moderada"
    else:
        level = "baixa"

    return {
        "level": level,
        "score": score,
        "reasons": reasons or ["Poucos indicadores de prioridade nos criterios utilizados"],
    }


def cluster_hotspots(
    db: Session,
    radius_km: float = 5.0,
    min_samples: int = 3,
    source: str | None = None,
    confidence: str | None = None,
) -> dict:
    """
    Agrupa deteccoes geograficamente proximas com DBSCAN.

    A prioridade e heuristica e descritiva; nao representa
    previsao validada de incendios futuros.
    """
    if radius_km <= 0:
        raise ValueError("radius_km deve ser maior que zero.")

    if min_samples < 2:
        raise ValueError("min_samples deve ser pelo menos 2.")

    query = db.query(Fire).filter(
        Fire.latitude.isnot(None),
        Fire.longitude.isnot(None),
    )

    if source and source.lower() != "all":
        query = query.filter(Fire.source == source)

    if confidence and confidence.lower() != "all":
        normalized_confidence = confidence.strip().lower()

        confidence_groups = {
            "l": ["l", "low"],
            "low": ["l", "low"],
            "n": ["n", "nominal"],
            "nominal": ["n", "nominal"],
            "h": ["h", "high"],
            "high": ["h", "high"],
        }

        accepted_values = confidence_groups.get(
            normalized_confidence,
            [confidence.strip()],
        )

        query = query.filter(Fire.confidence.in_(accepted_values))

    fires = query.all()

    if not fires:
        return {
            "algorithm": "DBSCAN",
            "radius_km": radius_km,
            "min_samples": min_samples,
            "source_filter": source or "all",
            "confidence_filter": confidence or "all",
            "total_detections": 0,
            "clusters_found": 0,
            "noise_points": 0,
            "clusters": [],
        }

    coordinates = np.radians(
        [[fire.latitude, fire.longitude] for fire in fires]
    )

    earth_radius_km = 6371.0088

    model = DBSCAN(
        eps=radius_km / earth_radius_km,
        min_samples=min_samples,
        metric="haversine",
        algorithm="ball_tree",
    )

    labels = model.fit_predict(coordinates)
    clusters = []

    for label in sorted(set(labels)):
        if label == -1:
            continue

        indexes = np.where(labels == label)[0]
        grouped_fires = [fires[i] for i in indexes]

        frp_values = [
            fire.frp
            for fire in grouped_fires
            if fire.frp is not None
        ]

        average_frp = (
            float(np.mean(frp_values)) if frp_values else None
        )

        high_confidence_count = sum(
            1
            for fire in grouped_fires
            if (fire.confidence or "").strip().lower() in ("h", "high")
        )

        high_confidence_ratio = (
            high_confidence_count / len(grouped_fires)
        )

        priority = _classify_priority(
            detections=len(grouped_fires),
            average_frp=average_frp,
            high_confidence_ratio=high_confidence_ratio,
        )

        clusters.append(
            {
                "cluster_id": int(label),
                "detections": len(grouped_fires),
                "center": {
                    "latitude": float(
                        np.mean([fire.latitude for fire in grouped_fires])
                    ),
                    "longitude": float(
                        np.mean([fire.longitude for fire in grouped_fires])
                    ),
                },
                "average_frp": average_frp,
                "high_confidence_detections": high_confidence_count,
                "high_confidence_ratio": round(high_confidence_ratio, 3),
                "priority": priority,
                "first_detection": min(
                    fire.detected_at for fire in grouped_fires
                ).isoformat(),
                "last_detection": max(
                    fire.detected_at for fire in grouped_fires
                ).isoformat(),
            }
        )

    clusters.sort(
        key=lambda cluster: (
            {"critica": 3, "alta": 2, "moderada": 1, "baixa": 0}[
                cluster["priority"]["level"]
            ],
            cluster["detections"],
        ),
        reverse=True,
    )

    return {
        "algorithm": "DBSCAN",
        "radius_km": radius_km,
        "min_samples": min_samples,
        "source_filter": source or "all",
        "confidence_filter": confidence or "all",
        "total_detections": len(fires),
        "clusters_found": len(clusters),
        "noise_points": int(np.sum(labels == -1)),
        "clusters": clusters,
    }
