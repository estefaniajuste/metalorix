import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const client = postgres(url);
    _db = drizzle(client, { schema });
    return _db;
  } catch {
    console.warn("Could not connect to database, running in mock mode");
    return null;
  }
}

export const db = null as unknown as ReturnType<typeof drizzle<typeof schema>>;

