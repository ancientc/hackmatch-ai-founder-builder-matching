"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import type { Community } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whenWhere, setWhenWhere] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Community[]>("/api/communities")
      .then(setCommunities)
      .catch(() => setError("Could not load communities"));
  }, []);

  async function create() {
    try {
      const created = await apiPost<Community>("/api/communities", { name, description, whenWhere });
      router.push(`/admin/?c=${created.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create community");
    }
  }

  return (
    <main>
      <h1>🚀 HackMatch</h1>
      <p>✨ Meet the right person. Right now.</p>

      <div className="card">
        <h2>🏷️ Create a community</h2>
        <label htmlFor="name">🏷️ Community name</label>
        <input id="name" value={name} maxLength={100} onChange={(event) => setName(event.target.value)} placeholder="BUDAPEST AI HACKATON" />
        <label htmlFor="description">📝 Short description</label>
        <input id="description" value={description} maxLength={500} onChange={(event) => setDescription(event.target.value)} />
        <label htmlFor="whenWhere">📅 Date / location</label>
        <input id="whenWhere" value={whenWhere} maxLength={200} onChange={(event) => setWhenWhere(event.target.value)} />
        <div className="row" style={{ marginTop: 16 }}>
          <button className="accent" onClick={create}>🚀 Create</button>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </div>

      <h2>👥 Existing communities</h2>
      {communities.length === 0 ? <p>No communities yet.</p> : null}
      {communities.map((community) => (
        <div key={community.id} className="card clickable" onClick={() => router.push(`/c/?c=${community.id}`)}>
          <div className="between">
            <div>
              <h3>{community.name}</h3>
              <div className="muted">{community.whenWhere || community.description}</div>
            </div>
            <span className="score">Join →</span>
          </div>
        </div>
      ))}
    </main>
  );
}
