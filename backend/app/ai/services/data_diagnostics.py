
from sqlalchemy import func

from app.database.connection import SessionLocal
from app.database.models import Fire


def diagnose_fire_data():
    db = SessionLocal()

    try:
        total = db.query(Fire).count()

        print("\n=== PETRA | DIAGNÓSTICO DOS DADOS ===")
        print(f"Total de focos: {total}")

        print("\n--- Distribuição por fonte ---")
        sources = (
            db.query(Fire.source, func.count(Fire.id))
            .group_by(Fire.source)
            .all()
        )

        for source, count in sources:
            print(f"{source}: {count}")

        print("\n--- Período dos registros ---")
        oldest = db.query(func.min(Fire.detected_at)).scalar()
        newest = db.query(func.max(Fire.detected_at)).scalar()

        print(f"Primeira detecção: {oldest}")
        print(f"Última detecção: {newest}")

        print("\n--- Qualidade dos dados ---")
        without_frp = (
            db.query(Fire)
            .filter(Fire.frp.is_(None))
            .count()
        )

        without_confidence = (
            db.query(Fire)
            .filter(Fire.confidence.is_(None))
            .count()
        )

        print(f"Registros sem FRP: {without_frp}")
        print(f"Registros sem confiança: {without_confidence}")

        print("\n--- Estatísticas de FRP ---")
        frp_stats = db.query(
            func.min(Fire.frp),
            func.avg(Fire.frp),
            func.max(Fire.frp),
        ).one()

        print(f"FRP mínimo: {frp_stats[0]}")
        print(f"FRP médio: {frp_stats[1]}")
        print(f"FRP máximo: {frp_stats[2]}")

    finally:
        db.close()


if __name__ == "__main__":
    diagnose_fire_data()
