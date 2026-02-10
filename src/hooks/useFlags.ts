import { useQuery } from "@tanstack/react-query";
import { getFlags } from "@/services/launchdarkly-client";

export function useFlags(projectKey: string | undefined) {
  return useQuery({
    queryKey: ["flags", projectKey],
    queryFn: ({ signal }) => getFlags(projectKey!, signal),
    select: (data) => data.items,
    enabled: !!projectKey,
  });
}
