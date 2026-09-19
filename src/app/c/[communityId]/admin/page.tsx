import QRCode from "qrcode";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { readDb } from "@/lib/store";

export default async function AdminPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = await params;
  const db = readDb();
  const community = db.communities.find((item) => item.id === communityId);
  if (!community) notFound();

  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const joinUrl = `${protocol}://${host}/c/${communityId}`;
  const qr = await QRCode.toDataURL(joinUrl, { width: 320, margin: 1 });
  const participants = db.profiles.filter((item) => item.communityId === communityId).length;

  return (
    <main>
      <h1>🏷️ {community.name}</h1>
      <p>{community.description}</p>
      <div className="card">
        <h2>📱 Join QR code</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Join QR code" width={320} height={320} style={{ borderRadius: 12 }} />
        <h3 style={{ marginTop: 16 }}>🔗 Join link</h3>
        <code>{joinUrl}</code>
        <p>👥 Participants: {participants}</p>
        <Link href={`/c/${communityId}`}>
          <button className="accent">👤 Join as participant</button>
        </Link>
      </div>
    </main>
  );
}
