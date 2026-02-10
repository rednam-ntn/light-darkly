import { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useFlagDetail } from "@/hooks/useFlagDetail";
import { useEnvironments } from "@/hooks/useEnvironments";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { EnvironmentSelector } from "./EnvironmentSelector";
import { VariationsSection } from "./sections/VariationsSection";
import { TargetingRulesSection } from "./sections/TargetingRulesSection";
import { IndividualTargetsSection } from "./sections/IndividualTargetsSection";
import { DefaultRuleSection } from "./sections/DefaultRuleSection";
import { PrerequisitesSection } from "./sections/PrerequisitesSection";

export function FlagDetail() {
  const { projectKey, flagKey } = useParams<{ projectKey: string; flagKey: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: flag, isLoading: flagLoading, isError, error, refetch } = useFlagDetail(projectKey, flagKey);
  const { data: environments, isLoading: envsLoading } = useEnvironments(projectKey);

  const selectedEnvKey = searchParams.get("env") ?? environments?.[0]?.key ?? "";

  const envConfig = useMemo(() => {
    if (!flag || !selectedEnvKey) return null;
    return flag.environments[selectedEnvKey] ?? null;
  }, [flag, selectedEnvKey]);

  const selectedEnvName = useMemo(() => {
    return environments?.find((e) => e.key === selectedEnvKey)?.name ?? selectedEnvKey;
  }, [environments, selectedEnvKey]);

  function handleEnvChange(envKey: string) {
    setSearchParams({ env: envKey });
  }

  const isLoading = flagLoading || envsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-red-600">Failed to load flag details</p>
        <p className="mb-4 text-sm text-gray-500">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!flag) return null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        to={`/projects/${projectKey}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <ArrowLeft size={14} />
        Back to Flags
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{flag.name}</h1>
          <Badge variant={flag.kind === "boolean" ? "info" : "warning"}>
            {flag.kind === "boolean" ? "Boolean" : "Multivariate"}
          </Badge>
          {envConfig && (
            <div className="flex items-center gap-1.5">
              <StatusDot on={envConfig.on} size="md" />
              <span className={`text-sm font-medium ${envConfig.on ? "text-green-700" : "text-red-600"}`}>
                {envConfig.on ? "On" : "Off"}
              </span>
            </div>
          )}
        </div>
        <p className="mt-1 font-mono text-sm text-gray-400">{flag.key}</p>
        {flag.description && (
          <p className="mt-2 text-sm text-gray-600">{flag.description}</p>
        )}
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={12} />
          Created {format(new Date(flag.creationDate), "MMM d, yyyy")}
        </div>
      </div>

      {/* Environment Selector */}
      {environments && environments.length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white px-5 py-3">
          <EnvironmentSelector
            environments={environments}
            selectedEnvKey={selectedEnvKey}
            onChange={handleEnvChange}
          />
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        <VariationsSection variations={flag.variations} />

        {envConfig && (
          <>
            <TargetingRulesSection
              rules={envConfig.rules ?? []}
              variations={flag.variations}
              envName={selectedEnvName}
            />

            <IndividualTargetsSection
              targets={envConfig.targets ?? []}
              variations={flag.variations}
              envName={selectedEnvName}
            />

            <DefaultRuleSection
              fallthrough={envConfig.fallthrough}
              offVariation={envConfig.offVariation}
              isOn={envConfig.on}
              variations={flag.variations}
              envName={selectedEnvName}
            />

            <PrerequisitesSection
              prerequisites={envConfig.prerequisites ?? []}
              variations={flag.variations}
            />
          </>
        )}

        {!envConfig && selectedEnvKey && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            No configuration found for environment "{selectedEnvKey}".
          </div>
        )}
      </div>
    </div>
  );
}
