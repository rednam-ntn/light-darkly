import { useQuery } from "@tanstack/react-query";
import { getEnvironments } from "@/services/launchdarkly-client";

export function useEnvironments(projectKey: string | undefined) {
  return useQuery({
    queryKey: ["environments", projectKey],
    queryFn: ({ signal }) => getEnvironments(projectKey!, signal),
    select: (data) => data.items,
    enabled: !!projectKey,
  });
}
