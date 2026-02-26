import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/launchdarkly-client";
import type { Project } from "@/types/launchdarkly";

const PAGE_SIZE = 20;

export function useProjects(options?: { offset?: number; enabled?: boolean }) {
  const offset = options?.offset ?? 0;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["projects", offset] as const,
    queryFn: ({ signal }) =>
      getProjects({ limit: PAGE_SIZE, offset }, signal),
    select: (data): Project[] => data.items,
    enabled,
  });
}
