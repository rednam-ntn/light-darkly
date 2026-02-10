import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/features/flags/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search flags by name or key...")).toBeInTheDocument();
  });

  it("debounces input by 300ms", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Search flags by name or key...");

    // Simulate typing by firing change events directly
    fireEvent.change(input, { target: { value: "test" } });

    // Should not have called onChange yet (debounced)
    expect(onChange).not.toHaveBeenCalled();

    // Advance past debounce timer
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onChange).toHaveBeenCalledWith("test");
    vi.useRealTimers();
  });

  it("shows clear button when value is present", () => {
    render(<SearchBar value="hello" onChange={() => {}} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("hides clear button when value is empty", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("calls onChange with empty string on clear click", async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchBar value="hello" onChange={onChange} />);

    // Use fireEvent instead of userEvent with fake timers
    fireEvent.click(screen.getByLabelText("Clear search"));

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onChange).toHaveBeenCalledWith("");
    vi.useRealTimers();
  });

  it("shows result count when provided", () => {
    render(<SearchBar value="test" onChange={() => {}} resultCount={3} totalCount={10} />);
    expect(screen.getByText("3 of 10 flags")).toBeInTheDocument();
  });
});
