import { NextResponse } from "next/server";
import { mutate, newId, readDb } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; description?: string; whenWhere?: string };
  const name = (body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Community name is required" }, { status: 400 });

  const community = {
    id: newId(),
    name: name.slice(0, 100),
    description: (body.description ?? "").slice(0, 500),
    whenWhere: (body.whenWhere ?? "").slice(0, 200),
    createdAt: Date.now(),
  };
  mutate((db) => db.communities.push(community));
  return NextResponse.json(community);
}

export async function GET() {
  return NextResponse.json(readDb().communities);
}
