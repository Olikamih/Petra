import httpx

from app.database.connection import settings


BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"


def get_fires_from_nasa():
    if not settings.NASA_FIRMS_MAP_KEY:
        raise RuntimeError("NASA_FIRMS_MAP_KEY não foi configurada.")

    source = "VIIRS_NOAA21_NRT"

    url = (
        f"{BASE_URL}/{settings.NASA_FIRMS_MAP_KEY}/"
       f"{source}/-56,-2,-48,3/5"
    )

    response = httpx.get(url, timeout=30)

    response.raise_for_status()

    return response.text