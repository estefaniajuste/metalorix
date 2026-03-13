import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function buildConnection() {
  const socketPath = process.env.DB_SOCKET_PATH;
  const poolOptions = {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  };

  if (socketPath) {
    return postgres({
      host: socketPath,
      port: 5432,
      database: process.env.DB_NAME || "metalorix",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ...poolOptions,
    });
  }

  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return postgres(url, poolOptions);
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

