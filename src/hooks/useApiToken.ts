import { isTokenConfigured } from "@/services/launchdarkly-client";

export function useApiToken() {
  const configured = isTokenConfigured();
  return {
    isConfigured: configured,
    token: configured ? import.meta.env.VITE_LD_API_TOKEN : null,
  };
}
