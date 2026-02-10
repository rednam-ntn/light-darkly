import { AlertTriangle } from "lucide-react";

export function MissingTokenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-amber-600">
          <AlertTriangle size={28} />
          <h1 className="text-xl font-semibold">API Token Not Configured</h1>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          To use Light Darkly, add your LaunchDarkly read-only API token to the{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">.env</code> file:
        </p>

        <div className="mb-4 rounded-md bg-gray-900 p-4">
          <code className="font-mono text-sm text-green-400">
            VITE_LD_API_TOKEN=api-xxxx-xxxx
          </code>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          Then restart the application.
        </p>

        <div className="rounded-md bg-blue-50 p-4">
          <h3 className="mb-1 text-sm font-medium text-blue-800">
            How to get a token
          </h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-blue-700">
            <li>Go to LaunchDarkly &rarr; Account Settings</li>
            <li>Click Authorization</li>
            <li>Create a new token with <strong>Reader</strong> role</li>
            <li>Copy the token to your <code className="font-mono">.env</code> file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
