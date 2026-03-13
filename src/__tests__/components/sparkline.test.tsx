import { render } from "@testing-library/react";
import { Sparkline } from "@/components/dashboard/Sparkline";

describe("Sparkline", () => {
  it("renders an SVG with polyline", () => {
    const { container } = render(
      <Sparkline data={[10, 20, 15, 25, 30]} color="#D6B35A" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const polyline = container.querySelector("polyline");
    expect(polyline).toBeInTheDocument();
    expect(polyline).toHaveAttribute("stroke", "#D6B35A");
  });

  it("renders nothing with less than 2 data points", () => {
    const { container } = render(<Sparkline data={[10]} color="#D6B35A" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders nothing with empty data", () => {
    const { container } = render(<Sparkline data={[]} color="#D6B35A" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("uses provided width and height", () => {
    const { container } = render(
      <Sparkline data={[10, 20, 30]} color="#A7B0BE" width={100} height={40} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("generates valid points string", () => {
    const { container } = render(
      <Sparkline data={[0, 50, 100]} color="#000" width={80} height={28} />
    );
    const polyline = container.querySelector("polyline");
    const points = polyline?.getAttribute("points") ?? "";
    const coords = points.split(" ");
    expect(coords.length).toBe(3);
    for (const coord of coords) {
      const [x, y] = coord.split(",").map(Number);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(80);
      expect(y).toBeLessThanOrEqual(28);
    }
  });
});
