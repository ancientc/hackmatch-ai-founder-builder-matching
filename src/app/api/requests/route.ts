import { NextResponse } from "next/server";
import { mutate, newId } from "@/lib/store";
import type { HelpRequest } from "@/lib/types";

type Body = {
  action: "save" | "delete" | "comment";
  communityId?: string;
  authorId?: string;
  requestId?: string;
  text?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (body.action === "save") {
    const text = (body.text ?? "").trim().slice(0, 1000);
    if (!text) return NextResponse.json({ error: "Describe what you need help with" }, { status: 400 });
    if (!body.communityId || !body.authorId) {
      return NextResponse.json({ error: "communityId and authorId are required" }, { status: 400 });
    }

    const saved = mutate((db) => {
      const existing = db.requests.find((item) => item.id === body.requestId);
      if (existing) {
        existing.text = text;
        return existing;
      }
      const created: HelpRequest = {
        id: newId(),
        communityId: body.communityId as string,
        authorId: body.authorId as string,
        text,
        comments: [],
        createdAt: Date.now(),
      };
      db.requests.push(created);
      return created;
    });
    return NextResponse.json(saved);
  }

  if (body.action === "delete") {
    mutate((db) => {
      db.requests = db.requests.filter((item) => item.id !== body.requestId);
    });
    return NextResponse.json({ ok: true });
  }

  const text = (body.text ?? "").trim().slice(0, 1000);
  if (!text) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const updated = mutate((db) => {
    const target = db.requests.find((item) => item.id === body.requestId);
    if (!target) return undefined;
    target.comments.push({ id: newId(), authorId: body.authorId as string, text, createdAt: Date.now() });
    return target;
  });
  if (!updated) return NextResponse.json({ error: "Help request not found" }, { status: 404 });
  return NextResponse.json(updated);
}
