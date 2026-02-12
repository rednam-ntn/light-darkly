import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";
import { TargetingRulesSection } from "./sections/TargetingRulesSection";
import { IndividualTargetsSection } from "./sections/IndividualTargetsSection";
import { DefaultRuleSection } from "./sections/DefaultRuleSection";
import { PrerequisitesSection } from "./sections/PrerequisitesSection";
import type { FlagEnvironmentConfig, Variation } from "@/types/launchdarkly";

interface EnvironmentSectionProps {
  envKey: string;
  envName: string;
  envColor: string;
  config: FlagEnvironmentConfig;
  variations: Variation[];
  defaultOpen?: boolean;
}

export function EnvironmentSection({
  envKey,
  envName,
  envColor,
  config,
  variations,
  defaultOpen = false,
}: EnvironmentSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      style={{ borderLeftColor: `#${envColor}`, borderLeftWidth: 4 }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-gray-50"
        aria-expanded={open}
        aria-controls={`env-section-${envKey}`}
      >
        <StatusDot on={config.on} size="md" />
        <span className="font-semibold text-gray-900">{envName}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            config.on
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {config.on ? "ON" : "OFF"}
        </span>
        <div className="ml-auto">
          <ChevronRight
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div id={`env-section-${envKey}`} className="space-y-4 border-t border-gray-100 px-5 py-4">
          <TargetingRulesSection
            rules={config.rules ?? []}
            variations={variations}
            envName={envName}
          />
          <IndividualTargetsSection
            targets={config.targets ?? []}
            variations={variations}
            envName={envName}
          />
          <DefaultRuleSection
            fallthrough={config.fallthrough}
            offVariation={config.offVariation}
            isOn={config.on}
            variations={variations}
            envName={envName}
          />
          <PrerequisitesSection
            prerequisites={config.prerequisites ?? []}
            variations={variations}
          />
        </div>
      )}
    </div>
  );
}
