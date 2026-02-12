import { Badge } from "@/components/ui/Badge";
import type { TargetingRule, Variation, Rollout } from "@/types/launchdarkly";

interface TargetingRulesSectionProps {
  rules: TargetingRule[];
  variations: Variation[];
  envName: string;
}

function formatClauseOp(op: string): string {
  const opMap: Record<string, string> = {
    in: "is one of",
    endsWith: "ends with",
    startsWith: "starts with",
    matches: "matches",
    contains: "contains",
    lessThan: "<",
    lessThanOrEqual: "<=",
    greaterThan: ">",
    greaterThanOrEqual: ">=",
    segmentMatch: "is in segment",
  };
  return opMap[op] ?? op;
}

function formatVariationValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value);
}

function RolloutDisplay({ rollout, variations }: { rollout: Rollout; variations: Variation[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {rollout.variations.map((wv) => {
        const v = variations[wv.variation];
        const pct = (wv.weight / 1000).toFixed(1);
        return (
          <span key={wv.variation} className="text-sm">
            <span className="font-medium">{v ? formatVariationValue(v.value) : `var ${wv.variation}`}</span>
            <span className="text-gray-400"> ({pct}%)</span>
          </span>
        );
      })}
    </div>
  );
}

export function TargetingRulesSection({ rules, variations, envName }: TargetingRulesSectionProps) {
  if (rules.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <h3 className="border-b border-gray-100 dark:border-gray-700 px-5 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Targeting Rules ({envName})
        </h3>
        <p className="px-5 py-4 text-sm text-gray-400">No targeting rules configured.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <h3 className="border-b border-gray-100 dark:border-gray-700 px-5 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Targeting Rules ({envName})
      </h3>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {rules.map((rule, idx) => (
          <div key={rule._id} className="px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="info">Rule {idx + 1}</Badge>
              {rule.description && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rule.description}</span>
              )}
            </div>

            {/* Clauses */}
            <div className="mb-2 space-y-1">
              {rule.clauses.map((clause, cIdx) => (
                <div key={cIdx} className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">IF </span>
                  {clause.contextKind && (
                    <span className="text-gray-500">{clause.contextKind}.</span>
                  )}
                  <code className="rounded bg-gray-50 px-1 font-mono text-xs dark:bg-gray-700">{clause.attribute}</code>
                  <span className="text-gray-500">
                    {" "}
                    {clause.negate ? "NOT " : ""}
                    {formatClauseOp(clause.op)}{" "}
                  </span>
                  <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {clause.values.length <= 3
                      ? clause.values.map((v) => JSON.stringify(v)).join(", ")
                      : `${clause.values.slice(0, 3).map((v) => JSON.stringify(v)).join(", ")} +${clause.values.length - 3} more`}
                  </span>
                </div>
              ))}
            </div>

            {/* Serve */}
            <div className="text-sm">
              <span className="font-medium text-gray-600 dark:text-gray-400">THEN serve: </span>
              {rule.variation !== undefined && rule.variation !== null ? (
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {variations[rule.variation]
                    ? formatVariationValue(variations[rule.variation]!.value)
                    : `Variation ${rule.variation}`}
                </span>
              ) : rule.rollout ? (
                <RolloutDisplay rollout={rule.rollout} variations={variations} />
              ) : (
                <span className="text-gray-400">Unknown</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
