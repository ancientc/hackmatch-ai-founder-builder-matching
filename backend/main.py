"""Entrypoint alias so `main:app` and `app.main:app` both work."""

from app.main import app

__all__ = ["app"]
