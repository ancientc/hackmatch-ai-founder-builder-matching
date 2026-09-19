import { NextResponse } from "next/server";
import { mutate, newId } from "@/lib/store";
import type { Product } from "@/lib/types";

type Body = {
  action: "save" | "delete" | "feedback";
  communityId?: string;
  ownerId?: string;
  authorId?: string;
  productId?: string;
  name?: string;
  description?: string;
  link?: string;
  text?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (body.action === "save") {
    const name = (body.name ?? "").trim().slice(0, 200);
    if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    if (!body.communityId || !body.ownerId) {
      return NextResponse.json({ error: "communityId and ownerId are required" }, { status: 400 });
    }

    const saved = mutate((db) => {
      const existing = db.products.find((item) => item.id === body.productId);
      const description = (body.description ?? "").slice(0, 3000);
      const link = (body.link ?? "").slice(0, 300);
      if (existing) {
        Object.assign(existing, { name, description, link });
        return existing;
      }
      const created: Product = {
        id: newId(),
        communityId: body.communityId as string,
        ownerId: body.ownerId as string,
        name,
        description,
        link,
        feedback: [],
        createdAt: Date.now(),
      };
      db.products.push(created);
      return created;
    });
    return NextResponse.json(saved);
  }

  if (body.action === "delete") {
    mutate((db) => {
      db.products = db.products.filter((item) => item.id !== body.productId);
    });
    return NextResponse.json({ ok: true });
  }

  const text = (body.text ?? "").trim().slice(0, 3000);
  if (!text) return NextResponse.json({ error: "Feedback cannot be empty" }, { status: 400 });

  const updated = mutate((db) => {
    const target = db.products.find((item) => item.id === body.productId);
    if (!target) return undefined;
    target.feedback.push({ id: newId(), authorId: body.authorId as string, text, createdAt: Date.now() });
    return target;
  });
  if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(updated);
}
