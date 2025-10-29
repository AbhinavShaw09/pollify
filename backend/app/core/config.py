from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-here"
    DATABASE_URL: str = "sqlite:///./polls.db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost", "http://frontend:3000", "https://pollify.xyz"]
    
    class Config:
        env_file = ".env"

settings = Settings()
