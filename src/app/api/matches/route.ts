import { NextResponse } from "next/server";
import { collaborateMatches, helpMatches } from "@/lib/match";
import { readDb } from "@/lib/store";

type Body = {
  communityId: string;
  profileId: string;
  mode: "collaborate" | "help";
  requestText?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const db = readDb();
  const me = db.profiles.find((item) => item.id === body.profileId);
  if (!me) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const others = db.profiles.filter(
    (item) => item.communityId === body.communityId && item.id !== me.id,
  );

  const matches =
    body.mode === "help"
      ? helpMatches(body.requestText ?? "", me, others)
      : collaborateMatches(me, others);

  return NextResponse.json(matches.slice(0, 10));
}
