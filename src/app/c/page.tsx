"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import type { Community, HelpRequest, Match, Product, Profile } from "@/lib/types";

type Screen =
  | "INTRO"
  | "EDIT-PROFILE"
  | "APP-MAIN-MENU"
  | "COLLABORATE-RESULTS"
  | "MATCH-DETAILS"
  | "GET-HELP-REQUEST-LIST"
  | "GET-HELP-REQUEST-EDIT"
  | "GET-HELP-RESULTS"
  | "BROWSE-HELP-REQUESTS-LIST"
  | "BROWSE-HELP-REQUESTS-DETAILS"
  | "TEST-MY-PRODUCT-LIST"
  | "TEST-MY-PRODUCT-DETAILS"
  | "TEST-PRODUCTS-OF-OTHERS-LIST"
  | "TEST-PRODUCTS-OF-OTHERS-DETAILS"
  | "BROWSE-PROFILES-LIST"
  | "BROWSE-PROFILES-DETAILS";

type State = {
  community: Community;
  profiles: Profile[];
  requests: HelpRequest[];
  products: Product[];
};

const EMPTY_PROFILE = {
  name: "",
  title: "",
  location: "",
  interests: "",
  skills: "",
  experience: "",
  building: "",
  canHelpWith: "",
  needsHelpWith: "",
  lookingFor: "",
};

type ProfileForm = typeof EMPTY_PROFILE;

const PROFILE_FIELDS: { key: keyof ProfileForm; label: string; max: number; lines?: number }[] = [
  { key: "name", label: "👤 Name", max: 100 },
  { key: "title", label: "🪪 Title", max: 100 },
  { key: "location", label: "🪑 Where exactly you are", max: 200 },
  { key: "interests", label: "❤️ Your interests", max: 500, lines: 2 },
  { key: "skills", label: "🛠️ Your skills", max: 500, lines: 2 },
  { key: "experience", label: "📚 Your experience (optional)", max: 1000, lines: 2 },
  { key: "building", label: "🚀 What you're building (optional)", max: 1000, lines: 2 },
  { key: "canHelpWith", label: "🤲 What you can help with (optional)", max: 500, lines: 2 },
  { key: "needsHelpWith", label: "🧩 What you need help with (optional)", max: 500, lines: 2 },
  { key: "lookingFor", label: "👥 Who you are looking for (optional)", max: 500, lines: 2 },
];

function CommunityApp() {
  const communityId = useSearchParams().get("c") ?? "";
  const storageKey = `hackmatch:profile:${communityId}`;

  const [screen, setScreen] = useState<Screen>("INTRO");
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchOrigin, setMatchOrigin] = useState<Screen>("COLLABORATE-RESULTS");
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);
  const [requestText, setRequestText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", link: "" });
  const [feedbackText, setFeedbackText] = useState("");
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await apiGet<State>(`/api/state?communityId=${communityId}`);
      setState(data);
      setLoading(false);
      return data;
    } catch {
      setError("Could not load community");
      setLoading(false);
      return null;
    }
  }, [communityId]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    refresh().then((data) => {
      if (!data) return;
      const mine = data.profiles.find((item) => item.id === stored);
      if (mine) {
        setMeId(mine.id);
        setForm({ ...EMPTY_PROFILE, ...mine });
        setScreen("APP-MAIN-MENU");
      }
    });
  }, [refresh, storageKey]);

  const me = state?.profiles.find((item) => item.id === meId) ?? null;
  const others = state?.profiles.filter((item) => item.id !== meId) ?? [];
  const myRequests = state?.requests.filter((item) => item.authorId === meId) ?? [];
  const myProducts = state?.products.filter((item) => item.ownerId === meId) ?? [];
  const otherProducts = state?.products.filter((item) => item.ownerId !== meId) ?? [];

  function profileName(id: string): string {
    return state?.profiles.find((item) => item.id === id)?.name ?? "Someone";
  }

  async function post<T>(url: string, body: unknown): Promise<T | null> {
    setError("");
    try {
      return await apiPost<T>(url, body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      return null;
    }
  }

  async function saveProfile() {
    const saved = await post<Profile>("/api/profiles", { ...form, communityId, id: meId });
    if (!saved) return;
    localStorage.setItem(storageKey, saved.id);
    setMeId(saved.id);
    await refresh();
    setScreen("APP-MAIN-MENU");
  }

  async function loadMatches(mode: "collaborate" | "help", text?: string) {
    setMatches(null);
    setScreen(mode === "collaborate" ? "COLLABORATE-RESULTS" : "GET-HELP-RESULTS");
    const result = await post<Match[]>("/api/matches", {
      communityId,
      profileId: meId,
      mode,
      requestText: text,
    });
    setMatches(result ?? []);
  }

  if (loading) return <p>⏳ Loading…</p>;
  if (!state) return <p className="error">{error || "Community not found"}</p>;

  const back = (target: Screen) => (
    <button onClick={() => setScreen(target)}>⬅️ Back</button>
  );

  const topbar = (
    <div className="topbar">
      <strong>🚀 {state.community.name}</strong>
      <span className="row">
        {me ? <span className="muted">👤 {me.name}</span> : null}
        <button onClick={() => refresh()}>🔄</button>
      </span>
    </div>
  );

  function renderScreen() {
    switch (screen) {
      case "INTRO":
        return (
          <>
            <h1>🚀 {state!.community.name}</h1>
            <p>✨ Enter your details, find the right person.</p>
            <p>{state!.community.description}</p>
            <button className="accent" onClick={() => setScreen("EDIT-PROFILE")}>👍 OK</button>
            <p className="muted">🪑 {state!.community.whenWhere}</p>
          </>
        );

      case "EDIT-PROFILE":
        return (
          <>
            <h2>👤 Your profile</h2>
            {PROFILE_FIELDS.map((field) =>
              field.lines ? (
                <div key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>
                  <textarea
                    id={field.key}
                    rows={field.lines}
                    maxLength={field.max}
                    value={form[field.key]}
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  />
                </div>
              ) : (
                <div key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>
                  <input
                    id={field.key}
                    maxLength={field.max}
                    value={form[field.key]}
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  />
                </div>
              ),
            )}
            <div className="row" style={{ marginTop: 18 }}>
              <button className="accent" onClick={saveProfile}>✅ Submit</button>
              <button onClick={() => setScreen(me ? "APP-MAIN-MENU" : "INTRO")}>✖️ Cancel</button>
            </div>
          </>
        );

      case "APP-MAIN-MENU":
        return (
          <>
            <h2>🧭 What do you want to do?</h2>
            <div className="menu-grid">
              <button className="accent" onClick={() => loadMatches("collaborate")}>🤝 Collaborate</button>
              <button onClick={() => setScreen("GET-HELP-REQUEST-LIST")}>🧠 Get help</button>
              <button onClick={() => setScreen("BROWSE-HELP-REQUESTS-LIST")}>👀 See questions/requests</button>
              <button onClick={() => setScreen("TEST-MY-PRODUCT-LIST")}>🧪 Test my product</button>
              <button onClick={() => setScreen("TEST-PRODUCTS-OF-OTHERS-LIST")}>🔬 Test products of others</button>
              <button onClick={() => setScreen("EDIT-PROFILE")}>✏️ Edit own profile</button>
              <button onClick={() => setScreen("BROWSE-PROFILES-LIST")}>👥 Browse other profiles</button>
            </div>
          </>
        );

      case "COLLABORATE-RESULTS":
      case "GET-HELP-RESULTS":
        return (
          <>
            <h2>{screen === "COLLABORATE-RESULTS" ? "🤝 People you should meet" : "🧠 These people may be able to help"}</h2>
            {matches === null ? <p>🤖 Matching…</p> : null}
            {matches?.length === 0 ? <p>😶 No matches yet — more people are still joining.</p> : null}
            {matches?.map((match) => (
              <div
                key={match.profile.id}
                className="card clickable"
                onClick={() => {
                  setSelectedMatch(match);
                  setMatchOrigin(screen);
                  setScreen("MATCH-DETAILS");
                }}
              >
                <div className="between">
                  <div>
                    <h3>👤 {match.profile.name}</h3>
                    <div className="muted">🪪 {match.profile.title} · 🪑 {match.profile.location}</div>
                  </div>
                  <span className="score">🔥 {match.score}%</span>
                </div>
              </div>
            ))}
            <div className="row">
              {back("APP-MAIN-MENU")}
              {screen === "GET-HELP-RESULTS" ? (
                <button onClick={() => setScreen("GET-HELP-REQUEST-EDIT")}>✏️ Reformulate request</button>
              ) : null}
            </div>
          </>
        );

      case "MATCH-DETAILS": {
        if (!selectedMatch) return back("APP-MAIN-MENU");
        const match = selectedMatch;
        return (
          <>
            <h2>👤 {match.profile.name}</h2>
            <div className="row">
              <span className="score">🔥 Match {match.score}%</span>
              <span className="muted">🪪 {match.profile.title} · 🪑 {match.profile.location}</span>
            </div>
            <div className="card" style={{ marginTop: 14 }}>
              <h3>💡 Why you should meet</h3>
              <ul className="clean">
                {match.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            {match.complementary.length ? (
              <div className="card">
                <h3>🧩 Complementary</h3>
                <ul className="clean">
                  {match.complementary.map((pair, index) => (
                    <li key={index}>You: {pair.you} ←→ Them: {pair.them}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="card">
              <h3>💬 Conversation starter</h3>
              <p>{match.starter}</p>
            </div>
            <div className="row">
              <button
                onClick={() => {
                  setViewedProfile(match.profile);
                  setScreen("BROWSE-PROFILES-DETAILS");
                }}
              >
                👤 View full profile
              </button>
              {back(matchOrigin)}
            </div>
          </>
        );
      }

      case "GET-HELP-REQUEST-LIST":
        return (
          <>
            <h2>🧠 My help requests</h2>
            {myRequests.length === 0 ? <p>😶 No requests yet.</p> : null}
            {myRequests.map((request) => (
              <div key={request.id} className="card">
                <div className="between">
                  <div
                    className="clickable"
                    onClick={() => {
                      setActiveRequest(request);
                      setRequestText(request.text);
                      setScreen("GET-HELP-REQUEST-EDIT");
                    }}
                  >
                    {request.text}
                    <div className="muted">💬 {request.comments.length} comments</div>
                  </div>
                  <button
                    className="danger"
                    onClick={async () => {
                      await post("/api/requests", { action: "delete", requestId: request.id });
                      await refresh();
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <div className="row">
              <button
                className="accent"
                onClick={() => {
                  setActiveRequest(null);
                  setRequestText("");
                  setScreen("GET-HELP-REQUEST-EDIT");
                }}
              >
                ➕ Create new
              </button>
              {back("APP-MAIN-MENU")}
            </div>
          </>
        );

      case "GET-HELP-REQUEST-EDIT":
        return (
          <>
            <h2>🧩 What do you need help with?</h2>
            <textarea
              rows={3}
              maxLength={1000}
              value={requestText}
              onChange={(event) => setRequestText(event.target.value)}
              placeholder="I need help deploying an MCP server…"
            />
            {activeRequest?.comments.length ? (
              <div className="card" style={{ marginTop: 14 }}>
                <h3>💬 Comments from others</h3>
                <ul className="clean">
                  {activeRequest.comments.map((comment) => (
                    <li key={comment.id}>
                      <strong>{profileName(comment.authorId)}:</strong> {comment.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="row" style={{ marginTop: 14 }}>
              <button
                className="accent"
                onClick={async () => {
                  const saved = await post<HelpRequest>("/api/requests", {
                    action: "save",
                    communityId,
                    authorId: meId,
                    requestId: activeRequest?.id,
                    text: requestText,
                  });
                  if (!saved) return;
                  setActiveRequest(saved);
                  await refresh();
                  await loadMatches("help", saved.text);
                }}
              >
                ✅ Submit
              </button>
              <button onClick={() => setScreen("GET-HELP-REQUEST-LIST")}>✖️ Cancel</button>
            </div>
          </>
        );

      case "BROWSE-HELP-REQUESTS-LIST":
        return (
          <>
            <h2>👀 Help requests in the community</h2>
            {state!.requests.length === 0 ? <p>😶 No requests yet.</p> : null}
            {state!.requests.map((request) => (
              <div
                key={request.id}
                className="card clickable"
                onClick={() => {
                  setActiveRequest(request);
                  setCommentText("");
                  setScreen("BROWSE-HELP-REQUESTS-DETAILS");
                }}
              >
                <h3>🧩 {request.text}</h3>
                <div className="muted">👤 {profileName(request.authorId)} · 💬 {request.comments.length}</div>
              </div>
            ))}
            {back("APP-MAIN-MENU")}
          </>
        );

      case "BROWSE-HELP-REQUESTS-DETAILS": {
        if (!activeRequest) return back("BROWSE-HELP-REQUESTS-LIST");
        const current = state!.requests.find((item) => item.id === activeRequest.id) ?? activeRequest;
        return (
          <>
            <h2>🧩 Help request</h2>
            <div className="card">
              <p>{current.text}</p>
              <div className="muted">👤 {profileName(current.authorId)}</div>
            </div>
            <label htmlFor="comment">💬 My comment</label>
            <textarea
              id="comment"
              rows={3}
              maxLength={1000}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />
            <div className="row" style={{ marginTop: 12 }}>
              <button
                className="accent"
                onClick={async () => {
                  const saved = await post<HelpRequest>("/api/requests", {
                    action: "comment",
                    requestId: current.id,
                    authorId: meId,
                    text: commentText,
                  });
                  if (!saved) return;
                  setCommentText("");
                  setActiveRequest(saved);
                  await refresh();
                }}
              >
                ✅ Submit comment
              </button>
              {back("BROWSE-HELP-REQUESTS-LIST")}
            </div>
            <div className="card" style={{ marginTop: 14 }}>
              <h3>💬 Comments</h3>
              {current.comments.length === 0 ? <p>😶 No comments yet.</p> : null}
              <ul className="clean">
                {current.comments.map((comment) => (
                  <li key={comment.id}>
                    <strong>{profileName(comment.authorId)}:</strong> {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      }

      case "TEST-MY-PRODUCT-LIST":
        return (
          <>
            <h2>🧪 My products</h2>
            {myProducts.length === 0 ? <p>😶 No products yet.</p> : null}
            {myProducts.map((product) => (
              <div key={product.id} className="card">
                <div className="between">
                  <div
                    className="clickable"
                    onClick={() => {
                      setActiveProduct(product);
                      setProductForm({ name: product.name, description: product.description, link: product.link });
                      setScreen("TEST-MY-PRODUCT-DETAILS");
                    }}
                  >
                    <h3>🚀 {product.name}</h3>
                    <div className="muted">💬 {product.feedback.length} feedback</div>
                  </div>
                  <button
                    className="danger"
                    onClick={async () => {
                      await post("/api/products", { action: "delete", productId: product.id });
                      await refresh();
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <div className="row">
              <button
                className="accent"
                onClick={() => {
                  setActiveProduct(null);
                  setProductForm({ name: "", description: "", link: "" });
                  setScreen("TEST-MY-PRODUCT-DETAILS");
                }}
              >
                ➕ Create new product
              </button>
              {back("APP-MAIN-MENU")}
            </div>
          </>
        );

      case "TEST-MY-PRODUCT-DETAILS": {
        const current = activeProduct
          ? state!.products.find((item) => item.id === activeProduct.id) ?? activeProduct
          : null;
        return (
          <>
            <h2>🚀 Product</h2>
            <label htmlFor="pname">🏷️ Name</label>
            <input
              id="pname"
              maxLength={200}
              value={productForm.name}
              onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
            />
            <label htmlFor="pdesc">📝 Description</label>
            <textarea
              id="pdesc"
              rows={5}
              maxLength={3000}
              value={productForm.description}
              onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
            />
            <label htmlFor="plink">🔗 Link to your product</label>
            <input
              id="plink"
              maxLength={300}
              value={productForm.link}
              onChange={(event) => setProductForm({ ...productForm, link: event.target.value })}
            />
            <div className="row" style={{ marginTop: 14 }}>
              <button
                className="accent"
                onClick={async () => {
                  const saved = await post<Product>("/api/products", {
                    action: "save",
                    communityId,
                    ownerId: meId,
                    productId: current?.id,
                    ...productForm,
                  });
                  if (!saved) return;
                  await refresh();
                  setScreen("TEST-MY-PRODUCT-LIST");
                }}
              >
                ✅ Submit
              </button>
              <button onClick={() => setScreen("TEST-MY-PRODUCT-LIST")}>✖️ Cancel</button>
            </div>
            {current ? (
              <div className="card" style={{ marginTop: 16 }}>
                <h3>💬 Feedback received</h3>
                {current.feedback.length === 0 ? <p>😶 No feedback yet.</p> : null}
                <ul className="clean">
                  {current.feedback.map((item) => (
                    <li key={item.id}>
                      <strong>{profileName(item.authorId)}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        );
      }

      case "TEST-PRODUCTS-OF-OTHERS-LIST":
        return (
          <>
            <h2>🔬 Products of others</h2>
            {otherProducts.length === 0 ? <p>😶 No products yet.</p> : null}
            {otherProducts.map((product) => (
              <div
                key={product.id}
                className="card clickable"
                onClick={() => {
                  setActiveProduct(product);
                  setFeedbackText("");
                  setScreen("TEST-PRODUCTS-OF-OTHERS-DETAILS");
                }}
              >
                <h3>🚀 {product.name}</h3>
                <div className="muted">👤 {profileName(product.ownerId)}</div>
              </div>
            ))}
            {back("APP-MAIN-MENU")}
          </>
        );

      case "TEST-PRODUCTS-OF-OTHERS-DETAILS": {
        if (!activeProduct) return back("TEST-PRODUCTS-OF-OTHERS-LIST");
        const current = state!.products.find((item) => item.id === activeProduct.id) ?? activeProduct;
        return (
          <>
            <h2>🚀 {current.name}</h2>
            <div className="card">
              <p>{current.description}</p>
              {current.link ? (
                <a href={current.link} target="_blank" rel="noreferrer"><code>{current.link}</code></a>
              ) : null}
              <div className="muted" style={{ marginTop: 8 }}>👤 {profileName(current.ownerId)}</div>
            </div>
            <label htmlFor="feedback">💬 My feedback</label>
            <textarea
              id="feedback"
              rows={4}
              maxLength={3000}
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
            />
            <div className="row" style={{ marginTop: 12 }}>
              <button
                className="accent"
                onClick={async () => {
                  const saved = await post<Product>("/api/products", {
                    action: "feedback",
                    productId: current.id,
                    authorId: meId,
                    text: feedbackText,
                  });
                  if (!saved) return;
                  setFeedbackText("");
                  setActiveProduct(saved);
                  await refresh();
                }}
              >
                ✅ Submit feedback
              </button>
              {back("TEST-PRODUCTS-OF-OTHERS-LIST")}
            </div>
            <div className="card" style={{ marginTop: 14 }}>
              <h3>💬 Feedback from others</h3>
              {current.feedback.length === 0 ? <p>😶 No feedback yet.</p> : null}
              <ul className="clean">
                {current.feedback.map((item) => (
                  <li key={item.id}>
                    <strong>{profileName(item.authorId)}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      }

      case "BROWSE-PROFILES-LIST":
        return (
          <>
            <h2>👥 People in the community</h2>
            {others.length === 0 ? <p>😶 Nobody else has joined yet.</p> : null}
            {others.map((profile) => (
              <div
                key={profile.id}
                className="card clickable"
                onClick={() => {
                  setViewedProfile(profile);
                  setScreen("BROWSE-PROFILES-DETAILS");
                }}
              >
                <h3>👤 {profile.name}</h3>
                <div className="muted">🪪 {profile.title} · 🪑 {profile.location}</div>
              </div>
            ))}
            {back("APP-MAIN-MENU")}
          </>
        );

      case "BROWSE-PROFILES-DETAILS": {
        if (!viewedProfile) return back("BROWSE-PROFILES-LIST");
        const profile = viewedProfile;
        const theirRequests = state!.requests.filter((item) => item.authorId === profile.id);
        const theirProducts = state!.products.filter((item) => item.ownerId === profile.id);
        return (
          <>
            <h2>👤 {profile.name}</h2>
            <div className="card">
              <div className="muted">🪪 {profile.title} · 🪑 {profile.location}</div>
              <ul className="clean">
                <li>❤️ Interests: {profile.interests}</li>
                <li>🛠️ Skills: {profile.skills}</li>
                {profile.experience ? <li>📚 Experience: {profile.experience}</li> : null}
                {profile.building ? <li>🚀 Building: {profile.building}</li> : null}
                {profile.canHelpWith ? <li>🤲 Can help with: {profile.canHelpWith}</li> : null}
                {profile.needsHelpWith ? <li>🧩 Needs help with: {profile.needsHelpWith}</li> : null}
                {profile.lookingFor ? <li>👥 Looking for: {profile.lookingFor}</li> : null}
              </ul>
            </div>
            <div className="card">
              <h3>🧩 Help requests</h3>
              {theirRequests.length === 0 ? <p>😶 None.</p> : null}
              <ul className="clean">
                {theirRequests.map((request) => (
                  <li key={request.id}>
                    <button
                      className="link"
                      onClick={() => {
                        setActiveRequest(request);
                        setCommentText("");
                        setScreen("BROWSE-HELP-REQUESTS-DETAILS");
                      }}
                    >
                      {request.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>🧪 Products</h3>
              {theirProducts.length === 0 ? <p>😶 None.</p> : null}
              <ul className="clean">
                {theirProducts.map((product) => (
                  <li key={product.id}>
                    <button
                      className="link"
                      onClick={() => {
                        setActiveProduct(product);
                        setFeedbackText("");
                        setScreen("TEST-PRODUCTS-OF-OTHERS-DETAILS");
                      }}
                    >
                      {product.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {back("BROWSE-PROFILES-LIST")}
          </>
        );
      }
    }
  }

  return (
    <main>
      {topbar}
      {renderScreen()}
      {error ? <div className="error">{error}</div> : null}
    </main>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<p>⏳ Loading…</p>}>
      <CommunityApp />
    </Suspense>
  );
}
