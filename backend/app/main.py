"""HackMatch API: same contract as the local Next.js API routes."""

import json
import os
import threading
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = Path(os.environ.get("HACKMATCH_DB_PATH", "/data/db.json"))
LOCK = threading.Lock()
EMPTY: dict[str, list[Any]] = {"communities": [], "profiles": [], "requests": [], "products": []}

app = FastAPI(title="HackMatch API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_db() -> dict[str, list[Any]]:
    if not DB_PATH.exists():
        return json.loads(json.dumps(EMPTY))
    try:
        stored = json.loads(DB_PATH.read_text())
    except json.JSONDecodeError:
        return json.loads(json.dumps(EMPTY))
    return {**json.loads(json.dumps(EMPTY)), **stored}


def write_db(db: dict[str, list[Any]]) -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    DB_PATH.write_text(json.dumps(db, indent=2, ensure_ascii=False))


def now() -> int:
    return int(time.time() * 1000)


def new_id() -> str:
    return str(uuid.uuid4())


class CommunityIn(BaseModel):
    name: str
    description: str = ""
    whenWhere: str = ""


class ProfileIn(BaseModel):
    id: str | None = None
    communityId: str
    name: str
    title: str
    location: str
    interests: str
    skills: str
    experience: str = ""
    building: str = ""
    canHelpWith: str = ""
    needsHelpWith: str = ""
    lookingFor: str = ""


class RequestIn(BaseModel):
    action: str
    communityId: str | None = None
    authorId: str | None = None
    requestId: str | None = None
    text: str = ""


class ProductIn(BaseModel):
    action: str
    communityId: str | None = None
    ownerId: str | None = None
    authorId: str | None = None
    productId: str | None = None
    name: str = ""
    description: str = ""
    link: str = ""
    text: str = ""


class MatchIn(BaseModel):
    communityId: str
    profileId: str
    mode: str
    requestText: str = ""


@app.get("/healthz")
def healthz() -> dict[str, bool]:
    return {"ok": True}


@app.get("/api/communities")
def list_communities() -> list[dict[str, Any]]:
    return read_db()["communities"]


@app.post("/api/communities")
def create_community(body: CommunityIn) -> dict[str, Any]:
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Community name is required")
    community = {
        "id": new_id(),
        "name": name[:100],
        "description": body.description[:500],
        "whenWhere": body.whenWhere[:200],
        "createdAt": now(),
    }
    with LOCK:
        db = read_db()
        db["communities"].append(community)
        write_db(db)
    return community


@app.get("/api/state")
def state(communityId: str) -> dict[str, Any]:
    db = read_db()
    community = next((item for item in db["communities"] if item["id"] == communityId), None)
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return {
        "community": community,
        "profiles": [item for item in db["profiles"] if item["communityId"] == communityId],
        "requests": [item for item in db["requests"] if item["communityId"] == communityId],
        "products": [item for item in db["products"] if item["communityId"] == communityId],
    }


@app.post("/api/profiles")
def save_profile(body: ProfileIn) -> dict[str, Any]:
    missing = [
        field
        for field in ("name", "title", "location", "interests", "skills")
        if not getattr(body, field).strip()
    ]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing: {', '.join(missing)}")

    with LOCK:
        db = read_db()
        existing = next((item for item in db["profiles"] if item["id"] == body.id), None)
        profile = {
            "id": existing["id"] if existing else new_id(),
            "communityId": body.communityId,
            "name": body.name[:100],
            "title": body.title[:100],
            "location": body.location[:200],
            "interests": body.interests[:500],
            "skills": body.skills[:500],
            "experience": body.experience[:1000],
            "building": body.building[:1000],
            "canHelpWith": body.canHelpWith[:500],
            "needsHelpWith": body.needsHelpWith[:500],
            "lookingFor": body.lookingFor[:500],
            "createdAt": existing["createdAt"] if existing else now(),
        }
        if existing:
            existing.update(profile)
        else:
            db["profiles"].append(profile)
        write_db(db)
    return profile


@app.post("/api/requests")
def requests_endpoint(body: RequestIn) -> dict[str, Any]:
    with LOCK:
        db = read_db()

        if body.action == "save":
            text = body.text.strip()[:1000]
            if not text:
                raise HTTPException(status_code=400, detail="Describe what you need help with")
            existing = next((item for item in db["requests"] if item["id"] == body.requestId), None)
            if existing:
                existing["text"] = text
                saved = existing
            else:
                saved = {
                    "id": new_id(),
                    "communityId": body.communityId,
                    "authorId": body.authorId,
                    "text": text,
                    "comments": [],
                    "createdAt": now(),
                }
                db["requests"].append(saved)
            write_db(db)
            return saved

        if body.action == "delete":
            db["requests"] = [item for item in db["requests"] if item["id"] != body.requestId]
            write_db(db)
            return {"ok": True}

        text = body.text.strip()[:1000]
        if not text:
            raise HTTPException(status_code=400, detail="Comment cannot be empty")
        target = next((item for item in db["requests"] if item["id"] == body.requestId), None)
        if target is None:
            raise HTTPException(status_code=404, detail="Help request not found")
        target["comments"].append(
            {"id": new_id(), "authorId": body.authorId, "text": text, "createdAt": now()}
        )
        write_db(db)
        return target


@app.post("/api/products")
def products_endpoint(body: ProductIn) -> dict[str, Any]:
    with LOCK:
        db = read_db()

        if body.action == "save":
            name = body.name.strip()[:200]
            if not name:
                raise HTTPException(status_code=400, detail="Product name is required")
            existing = next((item for item in db["products"] if item["id"] == body.productId), None)
            if existing:
                existing.update(
                    {"name": name, "description": body.description[:3000], "link": body.link[:300]}
                )
                saved = existing
            else:
                saved = {
                    "id": new_id(),
                    "communityId": body.communityId,
                    "ownerId": body.ownerId,
                    "name": name,
                    "description": body.description[:3000],
                    "link": body.link[:300],
                    "feedback": [],
                    "createdAt": now(),
                }
                db["products"].append(saved)
            write_db(db)
            return saved

        if body.action == "delete":
            db["products"] = [item for item in db["products"] if item["id"] != body.productId]
            write_db(db)
            return {"ok": True}

        text = body.text.strip()[:3000]
        if not text:
            raise HTTPException(status_code=400, detail="Feedback cannot be empty")
        target = next((item for item in db["products"] if item["id"] == body.productId), None)
        if target is None:
            raise HTTPException(status_code=404, detail="Product not found")
        target["feedback"].append(
            {"id": new_id(), "authorId": body.authorId, "text": text, "createdAt": now()}
        )
        write_db(db)
        return target


@app.post("/api/matches")
def matches_endpoint(body: MatchIn) -> list[dict[str, Any]]:
    from app.matching import collaborate_matches, help_matches

    db = read_db()
    me = next((item for item in db["profiles"] if item["id"] == body.profileId), None)
    if me is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    others = [
        item
        for item in db["profiles"]
        if item["communityId"] == body.communityId and item["id"] != me["id"]
    ]
    matches = (
        help_matches(body.requestText, me, others)
        if body.mode == "help"
        else collaborate_matches(me, others)
    )
    return matches[:10]
