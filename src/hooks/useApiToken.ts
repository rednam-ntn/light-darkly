import { useCallback, useSyncExternalStore } from "react";
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from "@/services/api-key-store";

// Simple pub/sub so React re-renders when the stored key changes
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  return !!getStoredApiKey() || !!import.meta.env.VITE_LD_API_TOKEN;
}

export function useApiToken() {
  const isConfigured = useSyncExternalStore(subscribe, getSnapshot);

  const setToken = useCallback((key: string) => {
    setStoredApiKey(key);
    notify();
  }, []);

  const clearToken = useCallback(() => {
    clearStoredApiKey();
    notify();
  }, []);

  return { isConfigured, setToken, clearToken };
}
