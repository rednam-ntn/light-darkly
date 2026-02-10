import type { Environment } from "@/types/launchdarkly";

interface EnvironmentSelectorProps {
  environments: Environment[];
  selectedEnvKey: string;
  onChange: (envKey: string) => void;
}

export function EnvironmentSelector({
  environments,
  selectedEnvKey,
  onChange,
}: EnvironmentSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="env-select" className="text-sm font-medium text-gray-700">
        Environment:
      </label>
      <select
        id="env-select"
        value={selectedEnvKey}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        {environments.map((env) => (
          <option key={env.key} value={env.key}>
            {env.name}
          </option>
        ))}
      </select>
    </div>
  );
}
