const STORAGE_KEY = "light-darkly-api-key";

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // localStorage may be unavailable (e.g. private browsing)
  }
}

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
