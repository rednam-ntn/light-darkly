import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MissingTokenPage } from "@/features/error/MissingTokenPage";
import { InvalidTokenPage } from "@/features/error/InvalidTokenPage";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe("MissingTokenPage", () => {
  it("shows token not configured message", () => {
    render(<MissingTokenPage />, { wrapper: createWrapper() });
    expect(screen.getByText("API Token Not Configured")).toBeInTheDocument();
  });

  it("shows .env setup instructions", () => {
    render(<MissingTokenPage />, { wrapper: createWrapper() });
    expect(screen.getByText("VITE_LD_API_TOKEN=api-xxxx-xxxx")).toBeInTheDocument();
  });

  it("shows how to get a token", () => {
    render(<MissingTokenPage />, { wrapper: createWrapper() });
    expect(screen.getByText("How to get a token")).toBeInTheDocument();
  });
});

describe("InvalidTokenPage", () => {
  it("shows invalid token message", () => {
    render(<InvalidTokenPage />, { wrapper: createWrapper() });
    expect(screen.getByText("Invalid API Token")).toBeInTheDocument();
  });

  it("shows error details when provided", () => {
    render(<InvalidTokenPage error="401 Unauthorized" />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText("401 Unauthorized")).toBeInTheDocument();
  });

  it("shows troubleshooting steps", () => {
    render(<InvalidTokenPage />, { wrapper: createWrapper() });
    expect(screen.getByText("Troubleshooting:")).toBeInTheDocument();
  });
});
