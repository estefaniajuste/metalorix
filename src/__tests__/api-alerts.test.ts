/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "@/app/api/user/alerts/route";

jest.mock("@/lib/db", () => ({
  getDb: jest.fn(),
}));

import { getDb } from "@/lib/db";

const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;

function makeRequest(
  method: string,
  opts?: { body?: unknown; cookies?: Record<string, string>; searchParams?: Record<string, string> }
): NextRequest {
  const url = new URL("http://localhost:3000/api/user/alerts");
  if (opts?.searchParams) {
    for (const [k, v] of Object.entries(opts.searchParams)) {
      url.searchParams.set(k, v);
    }
  }

  const init: RequestInit & { headers: Record<string, string> } = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (opts?.body) {
    init.body = JSON.stringify(opts.body);
  }

  const req = new NextRequest(url, init);

  if (opts?.cookies) {
    for (const [name, value] of Object.entries(opts.cookies)) {
      req.cookies.set(name, value);
    }
  }

  return req;
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("GET /api/user/alerts", () => {
  it("returns 401 when no session cookie is present", async () => {
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 401 when session cookie has invalid format", async () => {
    const res = await GET(makeRequest("GET", { cookies: { metalorix_session: "garbage" } }));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 503 when database is unavailable", async () => {
    mockGetDb.mockReturnValue(null);

    const res = await GET(makeRequest("GET", { cookies: { metalorix_session: "1:token" } }));
    expect(res.status).toBe(503);

    const data = await res.json();
    expect(data.error).toBe("Service unavailable");
  });

  it("returns alerts for authenticated user", async () => {
    const mockAlerts = [
      { id: 1, symbol: "XAU", alertType: "price_above", threshold: "2800.0000", active: true },
    ];
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(mockAlerts),
      }),
    });
    mockGetDb.mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof getDb>);

    const res = await GET(makeRequest("GET", { cookies: { metalorix_session: "42:token" } }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.alerts).toEqual(mockAlerts);
  });
});

describe("POST /api/user/alerts", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await POST(makeRequest("POST", { body: { symbol: "XAU", alertType: "price_above", threshold: 2800 } }));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 400 for missing required fields", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest("POST", {
      cookies: { metalorix_session: "1:token" },
      body: { symbol: "XAU" },
    }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 when body has no symbol", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest("POST", {
      cookies: { metalorix_session: "1:token" },
      body: { alertType: "price_above", threshold: 2800 },
    }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const req = new NextRequest("http://localhost:3000/api/user/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "broken{json",
    });
    req.cookies.set("metalorix_session", "1:token");

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid JSON");
  });

  it("creates alert for authenticated user with valid data", async () => {
    const insertedAlert = {
      id: 5,
      userId: 1,
      symbol: "XAG",
      alertType: "price_below",
      threshold: "25.0000",
      active: true,
    };
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([insertedAlert]),
      }),
    });
    mockGetDb.mockReturnValue({ insert: mockInsert } as unknown as ReturnType<typeof getDb>);

    const res = await POST(makeRequest("POST", {
      cookies: { metalorix_session: "1:token" },
      body: { symbol: "XAG", alertType: "price_below", threshold: 25 },
    }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.alert.symbol).toBe("XAG");
  });
});

describe("DELETE /api/user/alerts", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await DELETE(makeRequest("DELETE", { searchParams: { id: "5" } }));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 400 when id param is missing", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await DELETE(makeRequest("DELETE", { cookies: { metalorix_session: "1:token" } }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("ID required");
  });

  it("deletes alert for authenticated user", async () => {
    const mockDeleteFn = jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });
    mockGetDb.mockReturnValue({ delete: mockDeleteFn } as unknown as ReturnType<typeof getDb>);

    const res = await DELETE(makeRequest("DELETE", {
      cookies: { metalorix_session: "1:token" },
      searchParams: { id: "10" },
    }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
