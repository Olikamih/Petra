import numpy as np
from sklearn.cluster import DBSCAN
from sqlalchemy.orm import Session

from app.database.models import Fire


def cluster_hotspots(
    db: Session,
    radius_km: float = 5.0,
    min_samples: int = 3,
    source: str | None = None,
    confidence: str | None = None,
) -> dict:
    """
    Agrupa detecções de calor geograficamente próximas.

    Os filtros de fonte e confiança são aplicados antes do DBSCAN.
    Os agrupamentos são descritivos, não previsões de incêndios futuros.
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
                "average_frp": (
                    float(np.mean(frp_values)) if frp_values else None
                ),
                "first_detection": min(
                    fire.detected_at for fire in grouped_fires
                ).isoformat(),
                "last_detection": max(
                    fire.detected_at for fire in grouped_fires
                ).isoformat(),
            }
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