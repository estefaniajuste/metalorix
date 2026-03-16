import { getDb } from "@/lib/db";
import { errorLogs } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

interface LogErrorParams {
  statusCode: number;
  path: string;
  referer?: string | null;
  userAgent?: string | null;
  locale?: string | null;
  ip?: string | null;
  message?: string | null;
}

/**
 * Logs an error to the error_logs table with deduplication.
 * If the same path+statusCode was seen in the last hour, increments the counter.
 * Fire-and-forget: never throws, never blocks rendering.
 */
export async function logError(params: LogErrorParams): Promise<void> {
  try {
    const db = getDb();
    if (!db) return;

    const oneHourAgo = new Date(Date.now() - 3600_000);

    const existing = await db
      .select({ id: errorLogs.id })
      .from(errorLogs)
      .where(
        and(
          eq(errorLogs.path, params.path),
          eq(errorLogs.statusCode, params.statusCode),
          sql`${errorLogs.lastSeenAt} > ${oneHourAgo}`
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(errorLogs)
        .set({
          count: sql`${errorLogs.count} + 1`,
          lastSeenAt: new Date(),
          referer: params.referer ?? undefined,
          userAgent: params.userAgent ?? undefined,
        })
        .where(eq(errorLogs.id, existing[0].id));
    } else {
      await db.insert(errorLogs).values({
        statusCode: params.statusCode,
        path: params.path,
        referer: params.referer ?? null,
        userAgent: params.userAgent ?? null,
        locale: params.locale ?? null,
        ip: params.ip ?? null,
        message: params.message ?? null,
      });
    }
  } catch {
    // Never let logging break the app
  }
}
