import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/features/flags/Pagination";

describe("Pagination", () => {
  it("hides when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("hides when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("disables Prev button on page 1", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    const nextBtn = screen.getByLabelText("Next page");
    expect(nextBtn).toBeDisabled();
  });

  it("enables both buttons on middle page", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("displays correct page info", () => {
    render(<Pagination currentPage={2} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("Page 2 of 10")).toBeInTheDocument();
  });

  it("calls onPageChange with correct page on Next click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with correct page on Prev click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Previous page"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
