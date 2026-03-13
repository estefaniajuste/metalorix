import { getMetalSEO } from "@/lib/seo/metal-content";

describe("getMetalSEO", () => {
  it("returns data for 'oro'", () => {
    const seo = getMetalSEO("oro");
    expect(seo).toBeDefined();
    expect(seo!.name).toBe("Oro");
    expect(seo!.symbol).toBe("XAU");
    expect(seo!.slug).toBe("oro");
  });

  it("returns data for 'plata'", () => {
    const seo = getMetalSEO("plata");
    expect(seo).toBeDefined();
    expect(seo!.name).toBe("Plata");
    expect(seo!.symbol).toBe("XAG");
  });

  it("returns data for 'platino'", () => {
    const seo = getMetalSEO("platino");
    expect(seo).toBeDefined();
    expect(seo!.name).toBe("Platino");
    expect(seo!.symbol).toBe("XPT");
  });

  it("returns null/undefined for invalid slug", () => {
    expect(getMetalSEO("cobre")).toBeFalsy();
    expect(getMetalSEO("")).toBeFalsy();
  });

  it("each metal has description, keywords, and facts", () => {
    for (const slug of ["oro", "plata", "platino"]) {
      const seo = getMetalSEO(slug)!;
      expect(seo.description.length).toBeGreaterThan(50);
      expect(seo.keywords.length).toBeGreaterThan(3);
      expect(seo.facts.length).toBeGreaterThan(0);
      for (const fact of seo.facts) {
        if (typeof fact === "string") {
          expect(fact.length).toBeGreaterThan(10);
        } else {
          expect(fact).toHaveProperty("label");
          expect(fact).toHaveProperty("value");
        }
      }
    }
  });
});
