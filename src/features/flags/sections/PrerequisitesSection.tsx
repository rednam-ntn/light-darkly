import type { Prerequisite, Variation } from "@/types/launchdarkly";

interface PrerequisitesSectionProps {
  prerequisites: Prerequisite[];
  variations: Variation[];
}

export function PrerequisitesSection({ prerequisites, variations }: PrerequisitesSectionProps) {
  if (!prerequisites.length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <h3 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
        Prerequisites
      </h3>
      <div className="divide-y divide-gray-50 dark:divide-gray-700">
        {prerequisites.map((prereq) => (
          <div key={prereq.key} className="flex items-center gap-2 px-5 py-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Requires</span>
            <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-primary-700 dark:bg-gray-700 dark:text-primary-400">
              {prereq.key}
            </code>
            <span className="text-gray-600 dark:text-gray-400">=</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {variations[prereq.variation]
                ? String(variations[prereq.variation]!.value)
                : `Variation ${prereq.variation}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
