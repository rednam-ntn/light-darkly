import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/launchdarkly-client";
import type { Project } from "@/types/launchdarkly";

const PAGE_SIZE = 20;

export function useProjects(options?: { offset?: number }) {
  const offset = options?.offset ?? 0;

  return useQuery({
    queryKey: ["projects", offset] as const,
    queryFn: ({ signal }) =>
      getProjects({ limit: PAGE_SIZE, offset }, signal),
    select: (data): Project[] => data.items,
  });
}
