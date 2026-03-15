/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/login/route";

jest.mock("@/lib/db", () => ({
  getDb: jest.fn(),
}));

jest.mock("@/lib/auth/magic-link", () => ({
  sendMagicLink: jest.fn(),
}));

import { getDb } from "@/lib/db";
import { sendMagicLink } from "@/lib/auth/magic-link";

const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockSendMagicLink = sendMagicLink as jest.MockedFunction<typeof sendMagicLink>;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("POST /api/auth/login", () => {
  it("returns 503 when database is unavailable", async () => {
    mockGetDb.mockReturnValue(null);

    const res = await POST(makeRequest({ email: "test@test.com" }));
    expect(res.status).toBe(503);

    const data = await res.json();
    expect(data.error).toBe("Service unavailable");
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{{{",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid JSON");
  });

  it("returns 400 when email is missing", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email");
  });

  it("returns 400 when email has no @ sign", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest({ email: "notanemail" }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email");
  });

  it("returns 400 for empty string email", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest({ email: "" }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email");
  });

  it("returns 400 for whitespace-only email", async () => {
    const mockDb = {} as ReturnType<typeof getDb>;
    mockGetDb.mockReturnValue(mockDb);

    const res = await POST(makeRequest({ email: "   " }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email");
  });

  it("returns 404 when no account exists for the email", async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockGetDb.mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof getDb>);

    const res = await POST(makeRequest({ email: "nobody@test.com" }));
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toContain("No account found");
  });

  it("returns 500 when sendMagicLink fails", async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 1, email: "user@test.com" }]),
        }),
      }),
    });
    mockGetDb.mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof getDb>);
    mockSendMagicLink.mockResolvedValue(false);

    const res = await POST(makeRequest({ email: "user@test.com" }));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Failed to send email");
  });

  it("returns 200 and sends magic link for valid existing user", async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 1, email: "user@test.com" }]),
        }),
      }),
    });
    mockGetDb.mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof getDb>);
    mockSendMagicLink.mockResolvedValue(true);

    const res = await POST(makeRequest({ email: "User@Test.COM" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.message).toContain("Link sent");

    expect(mockSendMagicLink).toHaveBeenCalledWith(
      "user@test.com",
      expect.any(String),
      "es"
    );
  });
});
