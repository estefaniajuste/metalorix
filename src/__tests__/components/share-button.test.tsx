import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton } from "@/components/dashboard/ShareButton";

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => {
    const map: Record<string, Record<string, string>> = {
      common: { share: "Compartir" },
    };
    return map[ns]?.[key] ?? key;
  },
}));

const mockWriteText = jest.fn().mockResolvedValue(undefined);

beforeAll(() => {
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });
});

beforeEach(() => {
  mockWriteText.mockClear();
});

describe("ShareButton", () => {
  it("renders WhatsApp and Telegram links with encoded share targets", () => {
    render(
      <ShareButton
        title="Gold price"
        text="Share this"
        url="https://metalorix.com/en/price/gold"
      />
    );
    const wa = screen.getByRole("link", { name: "WhatsApp" });
    expect(wa).toHaveAttribute(
      "href",
      `https://wa.me/?text=${encodeURIComponent("Gold price\nhttps://metalorix.com/en/price/gold")}`
    );
    const tg = screen.getByRole("link", { name: "Telegram" });
    expect(tg).toHaveAttribute(
      "href",
      `https://t.me/share/url?url=${encodeURIComponent("https://metalorix.com/en/price/gold")}&text=${encodeURIComponent("Gold price")}`
    );
  });

  it("copies URL to clipboard when copy button is clicked", async () => {
    render(
      <ShareButton
        title="Test"
        text="Test"
        url="https://metalorix.com/precio/oro"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Compartir" }));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("https://metalorix.com/precio/oro");
    });
  });
});
