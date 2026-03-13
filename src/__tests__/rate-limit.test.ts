import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const id = `test-allow-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const { allowed } = rateLimit(id, { maxRequests: 5, windowMs: 10_000 });
      expect(allowed).toBe(true);
    }
  });

  it("blocks requests exceeding the limit", () => {
    const id = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(id, { maxRequests: 3, windowMs: 10_000 });
    }
    const { allowed, remaining } = rateLimit(id, { maxRequests: 3, windowMs: 10_000 });
    expect(allowed).toBe(false);
    expect(remaining).toBe(0);
  });

  it("tracks remaining correctly", () => {
    const id = `test-remaining-${Date.now()}`;
    const r1 = rateLimit(id, { maxRequests: 5, windowMs: 10_000 });
    expect(r1.remaining).toBe(4);
    const r2 = rateLimit(id, { maxRequests: 5, windowMs: 10_000 });
    expect(r2.remaining).toBe(3);
  });

  it("isolates different identifiers", () => {
    const a = `test-a-${Date.now()}`;
    const b = `test-b-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(a, { maxRequests: 3, windowMs: 10_000 });
    }
    const { allowed: aAllowed } = rateLimit(a, { maxRequests: 3, windowMs: 10_000 });
    const { allowed: bAllowed } = rateLimit(b, { maxRequests: 3, windowMs: 10_000 });
    expect(aAllowed).toBe(false);
    expect(bAllowed).toBe(true);
  });

  it("returns resetAt in the future", () => {
    const id = `test-reset-${Date.now()}`;
    const { resetAt } = rateLimit(id, { maxRequests: 10, windowMs: 60_000 });
    expect(resetAt).toBeGreaterThan(Date.now());
  });
});
