"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { apiGet } from "@/lib/api";
import type { Community, Profile } from "@/lib/types";

function Admin() {
  const communityId = useSearchParams().get("c") ?? "";
  const [community, setCommunity] = useState<Community | null>(null);
  const [participants, setParticipants] = useState(0);
  const [qr, setQr] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!communityId) return;
    const url = `${window.location.origin}/c/?c=${communityId}`;
    setJoinUrl(url);
    QRCode.toDataURL(url, { width: 320, margin: 1 }).then(setQr);
    apiGet<{ community: Community; profiles: Profile[] }>(`/api/state?communityId=${communityId}`)
      .then((state) => {
        setCommunity(state.community);
        setParticipants(state.profiles.length);
      })
      .catch(() => setError("Community not found"));
  }, [communityId]);

  if (error) return <p className="error">{error}</p>;
  if (!community) return <p>⏳ Loading…</p>;

  return (
    <main>
      <h1>🏷️ {community.name}</h1>
      <p>{community.description}</p>
      <div className="card">
        <h2>📱 Join QR code</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {qr ? <img src={qr} alt="Join QR code" width={320} height={320} style={{ borderRadius: 12 }} /> : null}
        <h3 style={{ marginTop: 16 }}>🔗 Join link</h3>
        <code>{joinUrl}</code>
        <p>👥 Participants: {participants}</p>
        <div className="row">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(joinUrl);
              setCopied(true);
            }}
          >
            {copied ? "✅ Copied" : "📋 Copy link"}
          </button>
          <Link href={`/c/?c=${communityId}`}>
            <button className="accent">👤 Join as participant</button>
          </Link>
          <Link href="/">
            <button>⬅️ Back</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p>⏳ Loading…</p>}>
      <Admin />
    </Suspense>
  );
}
