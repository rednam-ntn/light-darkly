import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/launchdarkly-client";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => getProjects(signal),
    select: (data) => data.items,
  });
}
