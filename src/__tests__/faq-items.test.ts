import { FAQ_ITEMS } from "@/lib/data/faq-items";

describe("FAQ_ITEMS", () => {
  it("has at least 5 items", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(5);
  });

  it("each item has question and answer", () => {
    for (const item of FAQ_ITEMS) {
      expect(typeof item.question).toBe("string");
      expect(typeof item.answer).toBe("string");
      expect(item.question.length).toBeGreaterThan(10);
      expect(item.answer.length).toBeGreaterThan(30);
    }
  });

  it("questions end with ?", () => {
    for (const item of FAQ_ITEMS) {
      expect(item.question.endsWith("?")).toBe(true);
    }
  });

  it("no duplicate questions", () => {
    const questions = FAQ_ITEMS.map((i) => i.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
