CREATE TABLE IF NOT EXISTS communities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  when_where TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT NOT NULL,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL DEFAULT '',
  building TEXT NOT NULL DEFAULT '',
  can_help_with TEXT NOT NULL DEFAULT '',
  needs_help_with TEXT NOT NULL DEFAULT '',
  looking_for TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_community ON profiles(community_id);

CREATE TABLE IF NOT EXISTS help_requests (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_requests_community ON help_requests(community_id);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_community ON products(community_id);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  parent_kind TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_kind, parent_id);
