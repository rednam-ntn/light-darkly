import { useQuery } from "@tanstack/react-query";
import { getFlags } from "@/services/launchdarkly-client";
import type { FeatureFlag } from "@/types/launchdarkly";

const PAGE_SIZE = 5;

export function useFlags(
  projectKey: string | undefined,
  options?: { query?: string; offset?: number },
) {
  const query = options?.query?.trim() || "";
  const offset = options?.offset ?? 0;

  return useQuery({
    queryKey: ["flags", projectKey, query, offset] as const,
    queryFn: ({ signal }) =>
      getFlags(
        projectKey!,
        { limit: PAGE_SIZE, offset, query: query || undefined },
        signal,
      ),
    select: (data): FeatureFlag[] => data.items,
    enabled: !!projectKey,
  });
}
