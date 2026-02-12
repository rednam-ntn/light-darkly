import type { Variation } from "@/types/launchdarkly";

interface VariationsSectionProps {
  variations: Variation[];
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value, null, 2);
}

export function VariationsSection({ variations }: VariationsSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <h3 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
        Variations
      </h3>
      <div className="divide-y divide-gray-50 dark:divide-gray-700">
        {variations.map((v, i) => (
          <div key={v._id} className="flex items-start gap-3 px-5 py-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {i}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <code className="rounded bg-gray-50 px-2 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {formatValue(v.value)}
                </code>
                {v.name && (
                  <span className="text-sm text-gray-500">{v.name}</span>
                )}
              </div>
              {v.description && (
                <p className="mt-0.5 text-xs text-gray-400">{v.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
