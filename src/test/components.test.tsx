import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Test Label</Badge>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies success variant classes", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-700");
  });

  it("applies default variant when no variant specified", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-gray-100");
  });
});

describe("StatusDot", () => {
  it("renders green dot when on", () => {
    render(<StatusDot on={true} />);
    const dot = screen.getByLabelText("On");
    expect(dot.className).toContain("bg-green-500");
  });

  it("renders red dot when off", () => {
    render(<StatusDot on={false} />);
    const dot = screen.getByLabelText("Off");
    expect(dot.className).toContain("bg-red-400");
  });
});

describe("Spinner", () => {
  it("renders with default md size", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    const cls = svg?.getAttribute("class") ?? "";
    expect(cls).toContain("h-6");
    expect(cls).toContain("w-6");
  });

  it("renders with sm size", () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector("svg");
    const cls = svg?.getAttribute("class") ?? "";
    expect(cls).toContain("h-4");
    expect(cls).toContain("w-4");
  });

  it("renders with lg size", () => {
    const { container } = render(<Spinner size="lg" />);
    const svg = container.querySelector("svg");
    const cls = svg?.getAttribute("class") ?? "";
    expect(cls).toContain("h-8");
    expect(cls).toContain("w-8");
  });
});

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="No items" description="Try again later" />);
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByText("Try again later")).not.toBeInTheDocument();
  });
});
