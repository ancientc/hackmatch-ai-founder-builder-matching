"""Turn the JSON-file database of the FastAPI backend into D1 INSERT statements.

Usage: python3 migrate_from_json.py /path/to/db.json > seed.sql
"""

import json
import sys


def quote(value: object) -> str:
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value or "").replace("'", "''") + "'"


def row(table: str, values: dict[str, object]) -> str:
    columns = ", ".join(values)
    literals = ", ".join(quote(value) for value in values.values())
    return f"INSERT OR REPLACE INTO {table} ({columns}) VALUES ({literals});"


def main() -> None:
    db = json.load(open(sys.argv[1]))

    for community in db["communities"]:
        print(row("communities", {
            "id": community["id"], "name": community["name"],
            "description": community["description"], "when_where": community["whenWhere"],
            "created_at": community["createdAt"],
        }))

    for profile in db["profiles"]:
        print(row("profiles", {
            "id": profile["id"], "community_id": profile["communityId"], "name": profile["name"],
            "title": profile["title"], "location": profile["location"],
            "interests": profile["interests"], "skills": profile["skills"],
            "experience": profile["experience"], "building": profile["building"],
            "can_help_with": profile["canHelpWith"], "needs_help_with": profile["needsHelpWith"],
            "looking_for": profile["lookingFor"], "created_at": profile["createdAt"],
        }))

    for request in db["requests"]:
        print(row("help_requests", {
            "id": request["id"], "community_id": request["communityId"],
            "author_id": request["authorId"], "text": request["text"],
            "created_at": request["createdAt"],
        }))
        for comment in request.get("comments", []):
            print(row("comments", {
                "id": comment["id"], "parent_kind": "request", "parent_id": request["id"],
                "author_id": comment["authorId"], "text": comment["text"],
                "created_at": comment["createdAt"],
            }))

    for product in db["products"]:
        print(row("products", {
            "id": product["id"], "community_id": product["communityId"],
            "owner_id": product["ownerId"], "name": product["name"],
            "description": product["description"], "link": product["link"],
            "created_at": product["createdAt"],
        }))
        for feedback in product.get("feedback", []):
            print(row("comments", {
                "id": feedback["id"], "parent_kind": "product", "parent_id": product["id"],
                "author_id": feedback["authorId"], "text": feedback["text"],
                "created_at": feedback["createdAt"],
            }))


if __name__ == "__main__":
    main()
