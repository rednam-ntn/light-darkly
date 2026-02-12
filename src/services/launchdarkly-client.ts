import { ApiError } from "@/types/api";
import { getStoredApiKey } from "./api-key-store";
import type {
  ProjectsResponse,
  FlagsResponse,
  FeatureFlag,
  EnvironmentsResponse,
} from "@/types/launchdarkly";

const BASE_URL = import.meta.env.VITE_LD_API_URL || "https://app.launchdarkly.com/api/v2";

function getToken(): string {
  // Priority: localStorage key > .env key
  const storedKey = getStoredApiKey();
  if (storedKey) return storedKey;

  const envKey = import.meta.env.VITE_LD_API_TOKEN;
  if (envKey) return envKey;

  throw new Error("No API key configured. Please enter your LaunchDarkly API key.");
}

async function apiFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(response.status, response.statusText, body || undefined);
  }

  return response.json() as Promise<T>;
}

export function getProjects(
  options?: { limit?: number; offset?: number },
  signal?: AbortSignal,
): Promise<ProjectsResponse> {
  const params = new URLSearchParams({ expand: "environments" });
  if (options?.limit !== undefined) params.set("limit", String(options.limit));
  if (options?.offset !== undefined) params.set("offset", String(options.offset));
  return apiFetch<ProjectsResponse>(`/projects?${params.toString()}`, signal);
}

export function getFlags(
  projectKey: string,
  options?: { limit?: number; offset?: number; query?: string },
  signal?: AbortSignal,
): Promise<FlagsResponse> {
  const params = new URLSearchParams({ summary: "true" });
  if (options?.limit !== undefined) params.set("limit", String(options.limit));
  if (options?.offset !== undefined) params.set("offset", String(options.offset));
  if (options?.query) params.set("filter", `query:${options.query}`);
  return apiFetch<FlagsResponse>(`/flags/${projectKey}?${params.toString()}`, signal);
}

export function getFlag(
  projectKey: string,
  flagKey: string,
  signal?: AbortSignal,
): Promise<FeatureFlag> {
  return apiFetch<FeatureFlag>(`/flags/${projectKey}/${flagKey}`, signal);
}

export function getEnvironments(
  projectKey: string,
  signal?: AbortSignal,
): Promise<EnvironmentsResponse> {
  return apiFetch<EnvironmentsResponse>(
    `/projects/${projectKey}/environments`,
    signal,
  );
}

export function isTokenConfigured(): boolean {
  return !!getStoredApiKey() || !!import.meta.env.VITE_LD_API_TOKEN;
}
