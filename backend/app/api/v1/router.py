from fastapi import APIRouter
from .endpoints import auth, polls

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(polls.router, prefix="/polls", tags=["polls"])
