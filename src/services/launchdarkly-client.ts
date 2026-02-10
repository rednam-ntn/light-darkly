import { ApiError } from "@/types/api";
import type {
  Project,
  ProjectsResponse,
  FlagsResponse,
  FeatureFlag,
  EnvironmentsResponse,
} from "@/types/launchdarkly";

const BASE_URL = import.meta.env.VITE_LD_API_URL || "https://app.launchdarkly.com/api/v2";

function getToken(): string {
  const token = import.meta.env.VITE_LD_API_TOKEN;
  if (!token) {
    throw new Error("VITE_LD_API_TOKEN is not configured");
  }
  return token;
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

export async function getProjects(signal?: AbortSignal): Promise<ProjectsResponse> {
  const limit = 20;
  let offset = 0;
  let allItems: Project[] = [];
  let totalCount = 0;

  while (true) {
    const page = await apiFetch<ProjectsResponse>(
      `/projects?expand=environments&limit=${limit}&offset=${offset}`,
      signal,
    );
    allItems = allItems.concat(page.items);
    totalCount = page.totalCount;

    if (allItems.length >= totalCount || page.items.length < limit) {
      break;
    }
    offset += limit;
  }

  return { items: allItems, totalCount };
}

export function getFlags(
  projectKey: string,
  signal?: AbortSignal,
): Promise<FlagsResponse> {
  return apiFetch<FlagsResponse>(`/flags/${projectKey}?summary=true`, signal);
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
  return !!import.meta.env.VITE_LD_API_TOKEN;
}
