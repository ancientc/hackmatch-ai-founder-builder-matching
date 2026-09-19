import { collaborateMatches, helpMatches } from "./matching";
import type { Comment, Community, HelpRequest, Product, Profile } from "./types";

export type Env = { DB: D1Database };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function fail(detail: string, status = 400): Response {
  return json({ detail }, status);
}

const now = () => Date.now();
const trim = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

function rowToCommunity(row: Record<string, unknown>): Community {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    whenWhere: row.when_where as string,
    createdAt: row.created_at as number,
  };
}

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    communityId: row.community_id as string,
    name: row.name as string,
    title: row.title as string,
    location: row.location as string,
    interests: row.interests as string,
    skills: row.skills as string,
    experience: row.experience as string,
    building: row.building as string,
    canHelpWith: row.can_help_with as string,
    needsHelpWith: row.needs_help_with as string,
    lookingFor: row.looking_for as string,
    createdAt: row.created_at as number,
  };
}

function rowToComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    authorId: row.author_id as string,
    text: row.text as string,
    createdAt: row.created_at as number,
  };
}

async function commentsFor(env: Env, kind: "request" | "product", ids: string[]) {
  const grouped = new Map<string, Comment[]>();
  if (ids.length === 0) return grouped;
  const placeholders = ids.map(() => "?").join(",");
  const { results } = await env.DB.prepare(
    `SELECT * FROM comments WHERE parent_kind = ? AND parent_id IN (${placeholders}) ORDER BY created_at`,
  )
    .bind(kind, ...ids)
    .all<Record<string, unknown>>();
  for (const row of results) {
    const parent = row.parent_id as string;
    const list = grouped.get(parent) ?? [];
    list.push(rowToComment(row));
    grouped.set(parent, list);
  }
  return grouped;
}

async function loadProfile(env: Env, id: string): Promise<Profile | null> {
  const row = await env.DB.prepare("SELECT * FROM profiles WHERE id = ?")
    .bind(id)
    .first<Record<string, unknown>>();
  return row ? rowToProfile(row) : null;
}

async function loadRequest(env: Env, id: string): Promise<HelpRequest | null> {
  const row = await env.DB.prepare("SELECT * FROM help_requests WHERE id = ?")
    .bind(id)
    .first<Record<string, unknown>>();
  if (!row) return null;
  const comments = await commentsFor(env, "request", [id]);
  return {
    id: row.id as string,
    communityId: row.community_id as string,
    authorId: row.author_id as string,
    text: row.text as string,
    comments: comments.get(id) ?? [],
    createdAt: row.created_at as number,
  };
}

async function loadProduct(env: Env, id: string): Promise<Product | null> {
  const row = await env.DB.prepare("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .first<Record<string, unknown>>();
  if (!row) return null;
  const feedback = await commentsFor(env, "product", [id]);
  return {
    id: row.id as string,
    communityId: row.community_id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    description: row.description as string,
    link: row.link as string,
    feedback: feedback.get(id) ?? [],
    createdAt: row.created_at as number,
  };
}

async function getState(env: Env, communityId: string) {
  const communityRow = await env.DB.prepare("SELECT * FROM communities WHERE id = ?")
    .bind(communityId)
    .first<Record<string, unknown>>();
  if (!communityRow) return null;

  const [profileRows, requestRows, productRows] = await env.DB.batch<Record<string, unknown>>([
    env.DB.prepare("SELECT * FROM profiles WHERE community_id = ? ORDER BY created_at").bind(communityId),
    env.DB.prepare("SELECT * FROM help_requests WHERE community_id = ? ORDER BY created_at").bind(communityId),
    env.DB.prepare("SELECT * FROM products WHERE community_id = ? ORDER BY created_at").bind(communityId),
  ]);

  const requestComments = await commentsFor(env, "request", requestRows.results.map((row) => row.id as string));
  const productComments = await commentsFor(env, "product", productRows.results.map((row) => row.id as string));

  const requests: HelpRequest[] = requestRows.results.map((row) => ({
    id: row.id as string,
    communityId: row.community_id as string,
    authorId: row.author_id as string,
    text: row.text as string,
    comments: requestComments.get(row.id as string) ?? [],
    createdAt: row.created_at as number,
  }));

  const products: Product[] = productRows.results.map((row) => ({
    id: row.id as string,
    communityId: row.community_id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    description: row.description as string,
    link: row.link as string,
    feedback: productComments.get(row.id as string) ?? [],
    createdAt: row.created_at as number,
  }));

  return {
    community: rowToCommunity(communityRow),
    profiles: profileRows.results.map(rowToProfile),
    requests,
    products,
  };
}

async function handleCommunities(env: Env, body: Record<string, unknown>) {
  const name = trim(body.name, 100);
  if (!name) return fail("Community name is required");
  const community: Community = {
    id: crypto.randomUUID(),
    name,
    description: trim(body.description, 500),
    whenWhere: trim(body.whenWhere, 200),
    createdAt: now(),
  };
  await env.DB.prepare(
    "INSERT INTO communities (id, name, description, when_where, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(community.id, community.name, community.description, community.whenWhere, community.createdAt)
    .run();
  return json(community);
}

async function handleProfiles(env: Env, body: Record<string, unknown>) {
  const required = ["name", "title", "location", "interests", "skills"] as const;
  const missing = required.filter((field) => !trim(body[field], 1000));
  if (missing.length > 0) return fail(`Please fill in: ${missing.join(", ")}`);

  const communityId = String(body.communityId ?? "");
  const community = await env.DB.prepare("SELECT id FROM communities WHERE id = ?").bind(communityId).first();
  if (!community) return fail("Community not found", 404);

  const existingId = body.id ? String(body.id) : null;
  const existing = existingId ? await loadProfile(env, existingId) : null;

  const profile: Profile = {
    id: existing?.id ?? crypto.randomUUID(),
    communityId,
    name: trim(body.name, 100),
    title: trim(body.title, 100),
    location: trim(body.location, 200),
    interests: trim(body.interests, 500),
    skills: trim(body.skills, 500),
    experience: trim(body.experience, 1000),
    building: trim(body.building, 1000),
    canHelpWith: trim(body.canHelpWith, 500),
    needsHelpWith: trim(body.needsHelpWith, 500),
    lookingFor: trim(body.lookingFor, 500),
    createdAt: existing?.createdAt ?? now(),
  };

  await env.DB.prepare(
    `INSERT INTO profiles (id, community_id, name, title, location, interests, skills, experience,
       building, can_help_with, needs_help_with, looking_for, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, title = excluded.title,
       location = excluded.location, interests = excluded.interests, skills = excluded.skills,
       experience = excluded.experience, building = excluded.building,
       can_help_with = excluded.can_help_with, needs_help_with = excluded.needs_help_with,
       looking_for = excluded.looking_for`,
  )
    .bind(
      profile.id,
      profile.communityId,
      profile.name,
      profile.title,
      profile.location,
      profile.interests,
      profile.skills,
      profile.experience,
      profile.building,
      profile.canHelpWith,
      profile.needsHelpWith,
      profile.lookingFor,
      profile.createdAt,
    )
    .run();

  return json(profile);
}

async function handleRequests(env: Env, body: Record<string, unknown>) {
  const action = String(body.action ?? "");

  if (action === "save") {
    const text = trim(body.text, 1000);
    if (!text) return fail("Please describe what you need help with");
    const requestId = body.requestId ? String(body.requestId) : null;
    if (requestId) {
      const updated = await env.DB.prepare("UPDATE help_requests SET text = ? WHERE id = ?")
        .bind(text, requestId)
        .run();
      if (!updated.meta.changes) return fail("Request not found", 404);
      const saved = await loadRequest(env, requestId);
      if (!saved) return fail("Request not found", 404);
      return json(saved);
    }
    const request = {
      id: crypto.randomUUID(),
      communityId: String(body.communityId ?? ""),
      authorId: String(body.authorId ?? ""),
      text,
      createdAt: now(),
    };
    await env.DB.prepare(
      "INSERT INTO help_requests (id, community_id, author_id, text, created_at) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(request.id, request.communityId, request.authorId, request.text, request.createdAt)
      .run();
    return json({ ...request, comments: [] });
  }

  if (action === "delete") {
    const requestId = String(body.requestId ?? "");
    await env.DB.batch([
      env.DB.prepare("DELETE FROM help_requests WHERE id = ?").bind(requestId),
      env.DB.prepare("DELETE FROM comments WHERE parent_kind = 'request' AND parent_id = ?").bind(requestId),
    ]);
    return json({ ok: true });
  }

  if (action === "comment") {
    const text = trim(body.text, 500);
    if (!text) return fail("Comment cannot be empty");
    const comment = {
      id: crypto.randomUUID(),
      authorId: String(body.authorId ?? ""),
      text,
      createdAt: now(),
    };
    await env.DB.prepare(
      "INSERT INTO comments (id, parent_kind, parent_id, author_id, text, created_at) VALUES (?, 'request', ?, ?, ?, ?)",
    )
      .bind(comment.id, String(body.requestId ?? ""), comment.authorId, comment.text, comment.createdAt)
      .run();
    const updated = await loadRequest(env, String(body.requestId ?? ""));
    if (!updated) return fail("Help request not found", 404);
    return json(updated);
  }

  return fail("Unknown action");
}

async function handleProducts(env: Env, body: Record<string, unknown>) {
  const action = String(body.action ?? "");

  if (action === "save") {
    const name = trim(body.name, 200);
    if (!name) return fail("Product name is required");
    const description = trim(body.description, 1000);
    const link = trim(body.link, 500);
    const productId = body.productId ? String(body.productId) : null;
    if (productId) {
      const updated = await env.DB.prepare(
        "UPDATE products SET name = ?, description = ?, link = ? WHERE id = ?",
      )
        .bind(name, description, link, productId)
        .run();
      if (!updated.meta.changes) return fail("Product not found", 404);
      const saved = await loadProduct(env, productId);
      if (!saved) return fail("Product not found", 404);
      return json(saved);
    }
    const product = {
      id: crypto.randomUUID(),
      communityId: String(body.communityId ?? ""),
      ownerId: String(body.ownerId ?? ""),
      name,
      description,
      link,
      createdAt: now(),
    };
    await env.DB.prepare(
      "INSERT INTO products (id, community_id, owner_id, name, description, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        product.id,
        product.communityId,
        product.ownerId,
        product.name,
        product.description,
        product.link,
        product.createdAt,
      )
      .run();
    return json({ ...product, feedback: [] });
  }

  if (action === "delete") {
    const productId = String(body.productId ?? "");
    await env.DB.batch([
      env.DB.prepare("DELETE FROM products WHERE id = ?").bind(productId),
      env.DB.prepare("DELETE FROM comments WHERE parent_kind = 'product' AND parent_id = ?").bind(productId),
    ]);
    return json({ ok: true });
  }

  if (action === "feedback") {
    const text = trim(body.text, 1000);
    if (!text) return fail("Feedback cannot be empty");
    const feedback = {
      id: crypto.randomUUID(),
      authorId: String(body.authorId ?? ""),
      text,
      createdAt: now(),
    };
    await env.DB.prepare(
      "INSERT INTO comments (id, parent_kind, parent_id, author_id, text, created_at) VALUES (?, 'product', ?, ?, ?, ?)",
    )
      .bind(feedback.id, String(body.productId ?? ""), feedback.authorId, feedback.text, feedback.createdAt)
      .run();
    const updated = await loadProduct(env, String(body.productId ?? ""));
    if (!updated) return fail("Product not found", 404);
    return json(updated);
  }

  return fail("Unknown action");
}

async function handleMatches(env: Env, body: Record<string, unknown>) {
  const communityId = String(body.communityId ?? "");
  const me = await loadProfile(env, String(body.profileId ?? ""));
  if (!me) return fail("Profile not found", 404);

  const { results } = await env.DB.prepare("SELECT * FROM profiles WHERE community_id = ? AND id != ?")
    .bind(communityId, me.id)
    .all<Record<string, unknown>>();
  const others = results.map(rowToProfile);

  const mode = String(body.mode ?? "collaborate");
  if (mode === "help") {
    return json(helpMatches(trim(body.requestText, 1000), me, others));
  }
  return json(collaborateMatches(me, others));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    try {
      if (request.method === "GET") {
        if (path === "/healthz") return json({ ok: true });
        if (path === "/api/communities") {
          const { results } = await env.DB.prepare("SELECT * FROM communities ORDER BY created_at")
            .all<Record<string, unknown>>();
          return json(results.map(rowToCommunity));
        }
        if (path === "/api/state") {
          const communityId = url.searchParams.get("communityId") ?? "";
          const state = await getState(env, communityId);
          return state ? json(state) : fail("Community not found", 404);
        }
      }

      if (request.method === "POST") {
        const body = (await request.json()) as Record<string, unknown>;
        if (path === "/api/communities") return handleCommunities(env, body);
        if (path === "/api/profiles") return handleProfiles(env, body);
        if (path === "/api/requests") return handleRequests(env, body);
        if (path === "/api/products") return handleProducts(env, body);
        if (path === "/api/matches") return handleMatches(env, body);
      }

      return fail("Not found", 404);
    } catch (cause) {
      return fail(cause instanceof Error ? cause.message : "Server error", 500);
    }
  },
};
