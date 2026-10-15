
from sqlalchemy import func

from app.database.connection import SessionLocal
from app.database.models import Fire


def run_data_quality_check():
    db = SessionLocal()

    try:
        print("\n=== PETRA | QUALIDADE DOS DADOS ===")

        print("\n--- Confiança ---")
        rows = (
            db.query(Fire.confidence, func.count(Fire.id))
            .group_by(Fire.confidence)
            .all()
        )

        for confidence, total in rows:
            print(f"{confidence}: {total}")

        print("\n--- Satélites ---")
        rows = (
            db.query(Fire.satellite, func.count(Fire.id))
            .group_by(Fire.satellite)
            .all()
        )

        for satellite, total in rows:
            print(f"{satellite}: {total}")

        print("\n--- Instrumentos ---")
        rows = (
            db.query(Fire.instrument, func.count(Fire.id))
            .group_by(Fire.instrument)
            .all()
        )

        for instrument, total in rows:
            print(f"{instrument}: {total}")

        print("\n--- Focos por dia ---")
        rows = (
            db.query(
                func.date(Fire.detected_at),
                func.count(Fire.id),
            )
            .group_by(func.date(Fire.detected_at))
            .order_by(func.date(Fire.detected_at))
            .all()
        )

        for day, total in rows:
            print(f"{day}: {total}")

        print("\n--- Possíveis duplicatas ---")
        duplicates = (
            db.query(
                Fire.source,
                Fire.external_id,
                func.count(Fire.id).label("total"),
            )
            .filter(Fire.external_id.isnot(None))
            .group_by(Fire.source, Fire.external_id)
            .having(func.count(Fire.id) > 1)
            .all()
        )

        if duplicates:
            for source, external_id, total in duplicates[:20]:
                print(
                    f"Fonte={source}, ID={external_id}, "
                    f"registros={total}"
                )
            print(f"Grupos duplicados encontrados: {len(duplicates)}")
        else:
            print("Nenhuma duplicata por fonte e ID externo.")

        print("\n--- Cobertura geográfica ---")
        bounds = db.query(
            func.min(Fire.latitude),
            func.max(Fire.latitude),
            func.min(Fire.longitude),
            func.max(Fire.longitude),
        ).one()

        print(f"Latitude: {bounds[0]} até {bounds[1]}")
        print(f"Longitude: {bounds[2]} até {bounds[3]}")

    finally:
        db.close()


if __name__ == "__main__":
    run_data_quality_check()
