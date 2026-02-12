import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the apiFetch logic by mocking fetch globally
describe("LaunchDarkly API Client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("throws error when no token configured", async () => {
    // Mock import.meta.env to have no token
    vi.stubEnv("VITE_LD_API_TOKEN", "");

    const { getProjects } = await import("@/services/launchdarkly-client");

    await expect(getProjects()).rejects.toThrow("No API key configured");
  });

  it("includes Authorization header in requests", async () => {
    vi.stubEnv("VITE_LD_API_TOKEN", "test-token-123");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], totalCount: 0 }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getProjects } = await import("@/services/launchdarkly-client");
    await getProjects();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/projects"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "test-token-123",
        }),
      }),
    );
  });

  it("throws ApiError on 401 response", async () => {
    vi.stubEnv("VITE_LD_API_TOKEN", "bad-token");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: () => Promise.resolve("Invalid access token"),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getProjects } = await import("@/services/launchdarkly-client");

    try {
      await getProjects();
      expect.fail("Should have thrown");
    } catch (err: unknown) {
      const e = err as { name: string; status: number };
      expect(e.name).toBe("ApiError");
      expect(e.status).toBe(401);
    }
  });

  it("throws ApiError on 429 rate limit", async () => {
    vi.stubEnv("VITE_LD_API_TOKEN", "test-token");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
      text: () => Promise.resolve("Rate limit exceeded"),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getProjects } = await import("@/services/launchdarkly-client");

    try {
      await getProjects();
      expect.fail("Should have thrown");
    } catch (err: unknown) {
      const e = err as { name: string; status: number };
      expect(e.name).toBe("ApiError");
      expect(e.status).toBe(429);
    }
  });

  it("handles network failure", async () => {
    vi.stubEnv("VITE_LD_API_TOKEN", "test-token");

    const mockFetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", mockFetch);

    const { getProjects } = await import("@/services/launchdarkly-client");

    await expect(getProjects()).rejects.toThrow("Failed to fetch");
  });
});
