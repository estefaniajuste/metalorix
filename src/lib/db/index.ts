import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function buildConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  // Cloud SQL Unix socket: detect ?host=/cloudsql/... in the URL
  const parsed = new URL(url);
  const socketHost = parsed.searchParams.get("host");

  if (socketHost && socketHost.startsWith("/cloudsql/")) {
    return postgres({
      host: socketHost,
      port: 5432,
      database: parsed.pathname.replace("/", ""),
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
    });
  }

  return postgres(url);
}

export function getDb() {
  if (_db) return _db;
  try {
    const client = buildConnection();
    if (!client) return null;
    _db = drizzle(client, { schema });
    return _db;
  } catch (err) {
    console.warn("Could not connect to database, running in mock mode", err);
    return null;
  }
}

