import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Db } from "./types";

const DB_PATH = process.env.HACKMATCH_DB_PATH ?? join(process.cwd(), ".data", "db.json");

const EMPTY: Db = { communities: [], profiles: [], requests: [], products: [] };

export function readDb(): Db {
  if (!existsSync(DB_PATH)) return structuredClone(EMPTY);
  try {
    return { ...structuredClone(EMPTY), ...(JSON.parse(readFileSync(DB_PATH, "utf8")) as Partial<Db>) };
  } catch {
    return structuredClone(EMPTY);
  }
}

export function writeDb(db: Db): void {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function mutate<T>(fn: (db: Db) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

export function newId(): string {
  return randomUUID();
}
