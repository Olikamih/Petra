
from app.ai.services.data_preparation import prepare_fire_data


def analyze_fire(fire) -> dict:
    """
    Organiza os dados de um foco de incêndio.
    Esta função ainda não faz previsões com Machine Learning.
    """

    data = prepare_fire_data(fire)

    frp = data["frp"]

    if frp is None:
        frp_status = "unavailable"
    elif frp < 0:
        frp_status = "invalid"
    else:
        frp_status = "available"

    return {
        "fire_id": data["id"],
        "coordinates": {
            "latitude": data["latitude"],
            "longitude": data["longitude"],
        },
        "detected_at": data["detected_at"],
        "confidence": data["confidence"],
        "frp": frp,
        "frp_status": frp_status,
        "analysis_type": "descriptive",
        "model_prediction": None,
    }
