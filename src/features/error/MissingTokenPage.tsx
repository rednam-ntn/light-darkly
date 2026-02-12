import { useState } from "react";
import { AlertTriangle, KeyRound, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "@/hooks/useApiToken";
import { ApiKeyModal } from "@/components/ApiKeyModal";

export function MissingTokenPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { setToken, clearToken } = useApiToken();
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3 text-amber-600">
            <AlertTriangle size={28} />
            <h1 className="text-xl font-semibold">API Token Not Configured</h1>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            To use Light Darkly, enter your LaunchDarkly read-only API token below, or add it to the{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-700">.env</code> file.
          </p>

          <div className="mb-4 flex gap-3 rounded-md bg-green-50 p-3 dark:bg-green-900/30">
            <Shield size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-800 dark:text-green-300">
              <strong>Privacy:</strong> Your API key is stored <strong>only</strong> in your browser's
              local storage. It is <strong>never</strong> sent to or stored on our servers.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600"
          >
            <KeyRound size={16} />
            Enter API Key
          </button>

          <div className="mb-4 rounded-md bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Alternative: .env file</p>
            <div className="rounded-md bg-gray-900 p-3">
              <code className="font-mono text-sm text-green-400">
                VITE_LD_API_TOKEN=api-xxxx-xxxx
              </code>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Then restart the application.</p>
          </div>

          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
            <h3 className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-300">
              How to get a token
            </h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Go to LaunchDarkly &rarr; Account Settings</li>
              <li>Click Authorization</li>
              <li>Create a new token with <strong>Reader</strong> role</li>
              <li>Enter it above or copy to your <code className="font-mono">.env</code> file</li>
            </ol>
          </div>
        </div>
      </div>
      <ApiKeyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveKey}
        onClear={handleClearKey}
      />
    </>
  );
}
