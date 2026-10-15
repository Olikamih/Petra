from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text


from app.database.connection import engine
from app.api.routes.fires import router as fires_router
from app.api.routes.ai import router as ai_router


app = FastAPI(
    title="Petra API",
    description="API de monitoramento e análise de risco de queimadas.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fires_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "application": "Petra",
        "status": "online",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }