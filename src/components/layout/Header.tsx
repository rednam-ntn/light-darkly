import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, KeyRound, Moon, Sun } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "@/hooks/useApiToken";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ApiKeyModal } from "@/components/ApiKeyModal";

interface HeaderProps {
  connectionStatus: "connected" | "error" | "loading";
}

export function Header({ connectionStatus }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { setToken, clearToken } = useApiToken();
  const { isDark, toggle } = useDarkMode();
  const queryClient = useQueryClient();

  function handleSaveKey(key: string) {
    setToken(key);
    queryClient.invalidateQueries();
  }

  function handleClearKey() {
    clearToken();
    queryClient.invalidateQueries();
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Zap size={20} className="text-primary-500" />
            <span>Light Darkly</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {connectionStatus === "connected" && (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                <span className="text-gray-500 dark:text-gray-400">Connected</span>
              </>
            )}
            {connectionStatus === "error" && (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-600 dark:text-red-400">Connection Error</span>
              </>
            )}
            {connectionStatus === "loading" && (
              <>
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <span className="text-gray-500 dark:text-gray-400">Connecting...</span>
              </>
            )}
            <button
              onClick={toggle}
              className="ml-1 rounded-md border border-gray-300 p-1.5 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Change API Key"
            >
              <KeyRound size={14} />
              <span className="hidden sm:inline">API Key</span>
            </button>
          </div>
        </div>
      </header>
      <ApiKeyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveKey}
        onClear={handleClearKey}
      />
    </>
  );
}
