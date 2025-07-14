import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("gemini_api_key")
    Mistral_OCR_API_KEY: str = os.getenv("mistral_ocr_api_key")

    class Config:
        env_file = ".env"

settings = Settings()