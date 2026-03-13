import { render, screen, fireEvent } from "@testing-library/react";
import { ProductFilter } from "@/components/products/ProductFilter";
import { PRODUCTS } from "@/lib/data/products";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/products/ProductCard", () => ({
  ProductCard: ({ product }: { product: { shortName: string } }) => (
    <div data-testid={`product-${product.shortName}`}>{product.shortName}</div>
  ),
}));

describe("ProductFilter", () => {
  it("renders all five filter buttons", () => {
    render(<ProductFilter />);
    expect(screen.getByText("all")).toBeInTheDocument();
    expect(screen.getByText("gold")).toBeInTheDocument();
    expect(screen.getByText("silver")).toBeInTheDocument();
    expect(screen.getByText("coins")).toBeInTheDocument();
    expect(screen.getByText("bars")).toBeInTheDocument();
  });

  it("shows all products by default", () => {
    render(<ProductFilter />);
    for (const p of PRODUCTS) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
  });

  it("filters to gold products when clicking gold button", () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByText("gold"));

    const goldProducts = PRODUCTS.filter((p) => p.metal === "oro");
    const silverProducts = PRODUCTS.filter((p) => p.metal === "plata");

    for (const p of goldProducts) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
    for (const p of silverProducts) {
      if (!goldProducts.some((g) => g.shortName === p.shortName)) {
        expect(screen.queryByText(p.shortName)).not.toBeInTheDocument();
      }
    }
  });

  it("filters to silver products when clicking silver button", () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByText("silver"));

    const silverProducts = PRODUCTS.filter((p) => p.metal === "plata");
    const goldProducts = PRODUCTS.filter((p) => p.metal === "oro");

    for (const p of silverProducts) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
    for (const p of goldProducts) {
      if (!silverProducts.some((s) => s.shortName === p.shortName)) {
        expect(screen.queryByText(p.shortName)).not.toBeInTheDocument();
      }
    }
  });

  it("filters to coins when clicking coins button", () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByText("coins"));

    const coins = PRODUCTS.filter((p) => p.type === "moneda");
    const bars = PRODUCTS.filter((p) => p.type === "lingote");

    for (const p of coins) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
    for (const p of bars) {
      expect(screen.queryByText(p.shortName)).not.toBeInTheDocument();
    }
  });

  it("filters to bars when clicking bars button", () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByText("bars"));

    const bars = PRODUCTS.filter((p) => p.type === "lingote");
    const coins = PRODUCTS.filter((p) => p.type === "moneda");

    for (const p of bars) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
    for (const p of coins) {
      expect(screen.queryByText(p.shortName)).not.toBeInTheDocument();
    }
  });

  it("returns to all products when clicking all after a filter", () => {
    render(<ProductFilter />);

    fireEvent.click(screen.getByText("gold"));
    fireEvent.click(screen.getByText("all"));

    for (const p of PRODUCTS) {
      expect(screen.getByText(p.shortName)).toBeInTheDocument();
    }
  });

  it("has a filter group with the correct aria-label", () => {
    render(<ProductFilter />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "filterProducts");
  });
});
