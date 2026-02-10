import { useQuery } from "@tanstack/react-query";
import { getFlag } from "@/services/launchdarkly-client";

export function useFlagDetail(
  projectKey: string | undefined,
  flagKey: string | undefined,
) {
  return useQuery({
    queryKey: ["flag", projectKey, flagKey],
    queryFn: ({ signal }) => getFlag(projectKey!, flagKey!, signal),
    enabled: !!projectKey && !!flagKey,
  });
}
