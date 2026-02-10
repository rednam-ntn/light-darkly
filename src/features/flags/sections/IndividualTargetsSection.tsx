import type { Target, Variation } from "@/types/launchdarkly";

interface IndividualTargetsSectionProps {
  targets: Target[];
  variations: Variation[];
  envName: string;
}

function formatVariationValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value);
}

export function IndividualTargetsSection({ targets, variations, envName }: IndividualTargetsSectionProps) {
  if (!targets.length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <h3 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900">
        Individual Targets ({envName})
      </h3>
      <div className="divide-y divide-gray-50">
        {targets.map((target, idx) => {
          const variation = variations[target.variation];
          return (
            <div key={idx} className="px-5 py-3">
              <div className="mb-1 text-sm">
                <span className="font-medium text-gray-700">
                  {variation ? formatVariationValue(variation.value) : `Variation ${target.variation}`}:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {target.values.map((val) => (
                  <span
                    key={val}
                    className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
