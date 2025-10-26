from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.session import Base, engine
from .api.v1.router import api_router
from .utils.websocket_manager import ConnectionManager

# Import all models to ensure relationships work
from .models import user, polls, vote, comment, like

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pollify API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

app.include_router(api_router, prefix="/api/v1")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"message": data})
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {"message": "Pollify API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
