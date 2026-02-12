import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import type { FeatureFlag, Environment } from "@/types/launchdarkly";

interface FlagCardProps {
  flag: FeatureFlag;
  projectKey: string;
  environments: Environment[];
}

export function FlagCard({ flag, projectKey, environments }: FlagCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/projects/${projectKey}/flags/${flag.key}`)}
      className="w-full rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{flag.name}</h3>
        <Badge variant={flag.kind === "boolean" ? "info" : "warning"}>
          {flag.kind === "boolean" ? "Boolean" : "Multivariate"}
        </Badge>
      </div>

      <p className="mb-1 font-mono text-xs text-gray-400">{flag.key}</p>

      {flag.description && (
        <p className="mb-3 line-clamp-1 text-sm text-gray-500">{flag.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {environments.map((env) => {
          const envConfig = flag.environments?.[env.key];
          if (!envConfig) return null;

          const ruleCount = envConfig._summary
            ? Object.values(envConfig._summary.variations).reduce(
                (sum, v) => sum + v.rules,
                0,
              )
            : 0;

          return (
            <div key={env.key} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: `#${env.color}` }}
                title={env.name}
              />
              <span className="text-gray-600 dark:text-gray-400">{env.name}:</span>
              <StatusDot on={envConfig.on} />
              <span className={envConfig.on ? "font-medium text-green-700 dark:text-green-400" : "text-gray-400"}>
                {envConfig.on ? "On" : "Off"}
              </span>
              {ruleCount > 0 && (
                <span className="text-gray-400">
                  ({ruleCount} rule{ruleCount !== 1 ? "s" : ""})
                </span>
              )}
            </div>
          );
        })}
      </div>

      {flag.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {flag.tags.slice(0, 5).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {flag.tags.length > 5 && (
            <Badge>+{flag.tags.length - 5}</Badge>
          )}
        </div>
      )}
    </button>
  );
}
