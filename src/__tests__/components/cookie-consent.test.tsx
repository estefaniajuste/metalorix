import { render, screen, fireEvent } from "@testing-library/react";
import { CookieConsent } from "@/components/layout/CookieConsent";

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => {
    const map: Record<string, Record<string, string>> = {
      cookie: { message: "Usamos cookies esenciales.", essentialOnly: "Solo esenciales", accept: "Aceptar" },
      footer: { privacy: "Privacidad" },
    };
    return map[ns]?.[key] ?? key;
  },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
});

describe("CookieConsent", () => {
  it("shows banner when no consent stored", () => {
    render(<CookieConsent />);
    expect(screen.getByText("Aceptar")).toBeInTheDocument();
    expect(screen.getByText("Solo esenciales")).toBeInTheDocument();
  });

  it("hides banner when consent was previously accepted", () => {
    localStorageMock.getItem.mockReturnValueOnce("accepted");
    render(<CookieConsent />);
    expect(screen.queryByText("Aceptar")).not.toBeInTheDocument();
  });

  it("hides banner when consent was previously rejected", () => {
    localStorageMock.getItem.mockReturnValueOnce("rejected");
    render(<CookieConsent />);
    expect(screen.queryByText("Aceptar")).not.toBeInTheDocument();
  });

  it("saves 'accepted' when clicking Aceptar", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText("Aceptar"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "mtx-cookie-consent",
      "accepted"
    );
  });

  it("saves 'rejected' when clicking Solo esenciales", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText("Solo esenciales"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "mtx-cookie-consent",
      "rejected"
    );
  });

  it("contains link to privacy page", () => {
    render(<CookieConsent />);
    const link = screen.getByText("Privacidad");
    expect(link).toHaveAttribute("href", "/privacidad");
  });
});
