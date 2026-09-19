import { NextResponse } from "next/server";
import { mutate, newId } from "@/lib/store";
import type { Profile } from "@/lib/types";

const REQUIRED: (keyof Profile)[] = ["name", "title", "location", "interests", "skills"];

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Profile> & { communityId?: string };
  if (!body.communityId) return NextResponse.json({ error: "communityId is required" }, { status: 400 });

  const missing = REQUIRED.filter((field) => !String(body[field] ?? "").trim());
  if (missing.length) return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });

  const profile = mutate((db) => {
    const existing = body.id ? db.profiles.find((item) => item.id === body.id) : undefined;
    const next: Profile = {
      id: existing?.id ?? newId(),
      communityId: body.communityId as string,
      name: String(body.name).slice(0, 100),
      title: String(body.title).slice(0, 100),
      location: String(body.location).slice(0, 200),
      interests: String(body.interests).slice(0, 500),
      skills: String(body.skills).slice(0, 500),
      experience: String(body.experience ?? "").slice(0, 1000),
      building: String(body.building ?? "").slice(0, 1000),
      canHelpWith: String(body.canHelpWith ?? "").slice(0, 500),
      needsHelpWith: String(body.needsHelpWith ?? "").slice(0, 500),
      lookingFor: String(body.lookingFor ?? "").slice(0, 500),
      createdAt: existing?.createdAt ?? Date.now(),
    };
    if (existing) Object.assign(existing, next);
    else db.profiles.push(next);
    return next;
  });

  return NextResponse.json(profile);
}
