import type { Fallthrough, Variation } from "@/types/launchdarkly";

interface DefaultRuleSectionProps {
  fallthrough: Fallthrough;
  offVariation?: number;
  isOn: boolean;
  variations: Variation[];
  envName: string;
}

function formatVariationValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value);
}

export function DefaultRuleSection({
  fallthrough,
  offVariation,
  isOn,
  variations,
  envName,
}: DefaultRuleSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <h3 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900">
        Default Rule / Fallthrough ({envName})
      </h3>
      <div className="space-y-3 px-5 py-4">
        {/* Default when on */}
        <div className="text-sm">
          <span className="font-medium text-gray-600">When targeting is ON, serve: </span>
          {fallthrough.variation !== undefined && fallthrough.variation !== null ? (
            <span className="font-medium text-gray-800">
              {variations[fallthrough.variation]
                ? formatVariationValue(variations[fallthrough.variation]!.value)
                : `Variation ${fallthrough.variation}`}
            </span>
          ) : fallthrough.rollout ? (
            <span className="text-sm">
              {fallthrough.rollout.variations.map((wv) => {
                const v = variations[wv.variation];
                const pct = (wv.weight / 1000).toFixed(1);
                return (
                  <span key={wv.variation} className="mr-2">
                    <span className="font-medium">{v ? formatVariationValue(v.value) : `var ${wv.variation}`}</span>
                    <span className="text-gray-400"> ({pct}%)</span>
                  </span>
                );
              })}
            </span>
          ) : (
            <span className="text-gray-400">Not configured</span>
          )}
        </div>

        {/* Off variation */}
        {offVariation !== undefined && offVariation !== null && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">When targeting is OFF, serve: </span>
            <span className="font-medium text-gray-800">
              {variations[offVariation]
                ? formatVariationValue(variations[offVariation]!.value)
                : `Variation ${offVariation}`}
            </span>
          </div>
        )}

        {/* Current status */}
        <div className="text-sm">
          <span className="font-medium text-gray-600">Current status: </span>
          <span className={`font-medium ${isOn ? "text-green-700" : "text-red-600"}`}>
            {isOn ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </section>
  );
}
