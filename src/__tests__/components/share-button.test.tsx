import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton } from "@/components/dashboard/ShareButton";

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
  it("renders with 'Compartir' text", () => {
    render(
      <ShareButton
        title="Test title"
        text="Test text"
        url="https://metalorix.com"
      />
    );
    expect(screen.getByText("Compartir")).toBeInTheDocument();
  });

  it("copies URL to clipboard when Web Share API is not available", async () => {
    render(
      <ShareButton
        title="Test"
        text="Test"
        url="https://metalorix.com/precio/oro"
      />
    );
    fireEvent.click(screen.getByText("Compartir"));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        "https://metalorix.com/precio/oro"
      );
    });
  });

  it("shows 'Copiado' after clicking", async () => {
    render(
      <ShareButton title="Test" text="Test" url="https://metalorix.com" />
    );
    fireEvent.click(screen.getByText("Compartir"));
    await waitFor(() => {
      expect(screen.getByText("Copiado")).toBeInTheDocument();
    });
  });
});
