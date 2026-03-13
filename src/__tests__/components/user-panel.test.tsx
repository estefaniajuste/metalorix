import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { UserPanel } from "@/components/panel/UserPanel";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "es",
}));

const mockUser = {
  id: 1,
  email: "test@metalorix.com",
  tier: "free",
  createdAt: "2025-01-15T00:00:00Z",
};

const mockAlerts = [
  {
    id: 10,
    symbol: "XAU",
    alertType: "price_above",
    threshold: "2800.0000",
    active: true,
    lastTriggered: null,
    createdAt: "2025-06-01T00:00:00Z",
  },
];

beforeEach(() => {
  jest.resetAllMocks();
});

function mockFetchSequence(responses: Array<{ ok: boolean; json: () => Promise<unknown> }>) {
  const fetchMock = jest.fn();
  for (const res of responses) {
    fetchMock.mockResolvedValueOnce(res);
  }
  global.fetch = fetchMock;
  return fetchMock;
}

describe("UserPanel", () => {
  it("renders login form when user is not authenticated", async () => {
    mockFetchSequence([
      { ok: false, json: async () => ({}) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    expect(screen.getByText("loginTitle")).toBeInTheDocument();
    expect(screen.getByText("loginSubtitle")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(screen.getByText("sendLink")).toBeInTheDocument();
    expect(screen.getByText("googleLogin")).toBeInTheDocument();
  });

  it("shows sending state when submitting login form", async () => {
    mockFetchSequence([
      { ok: false, json: async () => ({}) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    // Set up a pending fetch for the login request that won't resolve immediately
    let resolveLogin!: (value: unknown) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    (global.fetch as jest.Mock).mockImplementationOnce(() => loginPromise);

    const emailInput = screen.getByPlaceholderText("tu@email.com");
    fireEvent.change(emailInput, { target: { value: "user@test.com" } });

    await act(async () => {
      fireEvent.submit(screen.getByText("sendLink").closest("form")!);
    });

    expect(screen.getByText("sending")).toBeInTheDocument();

    await act(async () => {
      resolveLogin({ ok: true, json: async () => ({ ok: true }) });
    });
  });

  it("shows success message after login link is sent", async () => {
    mockFetchSequence([
      { ok: false, json: async () => ({}) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const emailInput = screen.getByPlaceholderText("tu@email.com");
    fireEvent.change(emailInput, { target: { value: "user@test.com" } });

    await act(async () => {
      fireEvent.submit(screen.getByText("sendLink").closest("form")!);
    });

    await waitFor(() => {
      expect(screen.getByText("linkSent")).toBeInTheDocument();
    });
  });

  it("renders user info and alerts when logged in", async () => {
    mockFetchSequence([
      { ok: true, json: async () => ({ user: mockUser }) },
      { ok: true, json: async () => ({ alerts: mockAlerts }) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    await waitFor(() => {
      expect(screen.getByText("test@metalorix.com")).toBeInTheDocument();
    });

    expect(screen.getByText("logout")).toBeInTheDocument();
    expect(screen.getByText("createAlert")).toBeInTheDocument();
    expect(screen.getByText("XAU")).toBeInTheDocument();
  });

  it("shows no-alerts message when user has zero alerts", async () => {
    mockFetchSequence([
      { ok: true, json: async () => ({ user: mockUser }) },
      { ok: true, json: async () => ({ alerts: [] }) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    await waitFor(() => {
      expect(screen.getByText("noAlerts")).toBeInTheDocument();
    });
  });

  it("shows error message when login fails", async () => {
    mockFetchSequence([
      { ok: false, json: async () => ({}) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "No account found" }),
    });

    const emailInput = screen.getByPlaceholderText("tu@email.com");
    fireEvent.change(emailInput, { target: { value: "bad@test.com" } });

    await act(async () => {
      fireEvent.submit(screen.getByText("sendLink").closest("form")!);
    });

    await waitFor(() => {
      expect(screen.getByText("No account found")).toBeInTheDocument();
    });
  });

  it("calls logout endpoint and clears state on logout click", async () => {
    const fetchMock = mockFetchSequence([
      { ok: true, json: async () => ({ user: mockUser }) },
      { ok: true, json: async () => ({ alerts: mockAlerts }) },
    ]);

    await act(async () => {
      render(<UserPanel />);
    });

    await waitFor(() => {
      expect(screen.getByText("test@metalorix.com")).toBeInTheDocument();
    });

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await act(async () => {
      fireEvent.click(screen.getByText("logout"));
    });

    await waitFor(() => {
      expect(screen.getByText("loginTitle")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
  });
});
