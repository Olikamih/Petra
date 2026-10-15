from sqlalchemy import Column, BigInteger, String, DateTime, Float
from sqlalchemy.orm import declarative_base
from geoalchemy2 import Geometry


Base = declarative_base()


class Fire(Base):
    __tablename__ = "fires"

    id = Column(BigInteger, primary_key=True)

    source = Column(String(50), nullable=False)
    external_id = Column(String(150))

    detected_at = Column(DateTime(timezone=True), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    location = Column(Geometry("POINT", srid=4326), nullable=False)

    confidence = Column(String(30))
    frp = Column(Float)

    satellite = Column(String(50))
    instrument = Column(String(50))

    created_at = Column(
        DateTime(timezone=True),
        nullable=False
    )