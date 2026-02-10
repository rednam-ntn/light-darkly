import { ShieldAlert } from "lucide-react";

interface InvalidTokenPageProps {
  error?: string;
}

export function InvalidTokenPage({ error }: InvalidTokenPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-red-600">
          <ShieldAlert size={28} />
          <h1 className="text-xl font-semibold">Invalid API Token</h1>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          The LaunchDarkly API token in your{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">.env</code>{" "}
          file is invalid or expired.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <p className="font-mono text-xs text-red-700">{error}</p>
          </div>
        )}

        <h3 className="mb-2 text-sm font-medium text-gray-700">Troubleshooting:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>Verify the token is correct (no extra spaces)</li>
          <li>Ensure the token has <strong>Reader</strong> permissions</li>
          <li>Check if the token has expired in LaunchDarkly</li>
          <li>Restart the app after updating the token</li>
        </ul>
      </div>
    </div>
  );
}
