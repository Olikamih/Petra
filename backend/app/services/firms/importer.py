
import csv
from datetime import datetime, timezone
from io import StringIO

from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from app.database.models import Fire
from app.services.firms.client import get_fires_from_nasa


def import_fires_from_nasa(db: Session) -> dict:
    csv_data = get_fires_from_nasa()
    reader = csv.DictReader(StringIO(csv_data))

    received = 0
    imported = 0
    skipped = 0

    for row in reader:
        received += 1

        latitude = float(row["latitude"])
        longitude = float(row["longitude"])

        satellite = row["satellite"]
        instrument = row["instrument"]
        acq_date = row["acq_date"]
        acq_time = str(row["acq_time"]).zfill(4)

        detected_at = datetime.strptime(
            f"{acq_date} {acq_time}",
            "%Y-%m-%d %H%M",
        ).replace(tzinfo=timezone.utc)

        external_id = (
            f"{satellite}-{acq_date}-{acq_time}-"
            f"{latitude:.5f}-{longitude:.5f}"
        )

        existing = (
            db.query(Fire.id)
            .filter(Fire.external_id == external_id)
            .first()
        )

        if existing:
            skipped += 1
            continue

        fire = Fire(
            source="NASA_FIRMS",
            external_id=external_id,
            detected_at=detected_at,
            latitude=latitude,
            longitude=longitude,
            location=WKTElement(
                f"POINT({longitude} {latitude})",
                srid=4326,
            ),
            confidence=row.get("confidence"),
            frp=float(row["frp"]) if row.get("frp") else None,
            satellite=satellite,
            instrument=instrument,
            created_at=datetime.now(timezone.utc),
        )

        db.add(fire)
        imported += 1

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "received": received,
        "imported": imported,
        "skipped": skipped,
    }
