import { NextResponse } from "next/server";
import { readDb } from "@/lib/store";

export async function GET(request: Request) {
  const communityId = new URL(request.url).searchParams.get("communityId");
  if (!communityId) return NextResponse.json({ error: "communityId is required" }, { status: 400 });

  const db = readDb();
  const community = db.communities.find((item) => item.id === communityId);
  if (!community) return NextResponse.json({ error: "Community not found" }, { status: 404 });

  return NextResponse.json({
    community,
    profiles: db.profiles.filter((item) => item.communityId === communityId),
    requests: db.requests.filter((item) => item.communityId === communityId),
    products: db.products.filter((item) => item.communityId === communityId),
  });
}
