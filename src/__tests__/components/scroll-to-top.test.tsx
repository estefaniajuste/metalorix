import { render, screen, fireEvent, act } from "@testing-library/react";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    window.scrollTo = jest.fn();
  });

  it("is not visible initially", () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText("Volver arriba")).not.toBeInTheDocument();
  });

  it("becomes visible after scrolling past 400px", () => {
    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 500, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByLabelText("Volver arriba")).toBeInTheDocument();
  });

  it("scrolls to top when clicked", () => {
    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 500, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    fireEvent.click(screen.getByLabelText("Volver arriba"));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
