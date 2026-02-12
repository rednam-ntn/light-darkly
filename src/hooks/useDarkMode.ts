import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "light-darkly-theme";

function getSnapshot(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

// Apply on load
applyTheme(getSnapshot());

export function useDarkMode() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot);

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
    applyTheme(next);
    notify();
  }, []);

  return { isDark, toggle };
}
