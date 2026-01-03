# Support pydantic v2 where BaseSettings lives in the pydantic-settings package
try:
    from pydantic import BaseSettings
except Exception:
    try:
        from pydantic_settings import BaseSettings  # type: ignore[reportMissingImports]
    except Exception:
        # Minimal fallback if no pydantic available; tests should provide values via env
        class BaseSettings:  # type: ignore
            pass


class Settings(BaseSettings):
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_url: str = "sqlite:///./fraud_detection.db"

    class Config:
        env_file = ".env"

settings = Settings()
