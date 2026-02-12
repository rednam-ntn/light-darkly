import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useFlagDetail } from "@/hooks/useFlagDetail";
import { useEnvironments } from "@/hooks/useEnvironments";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { VariationsSection } from "./sections/VariationsSection";
import { EnvironmentSection } from "./EnvironmentSection";

export function FlagDetail() {
  const { projectKey, flagKey } = useParams<{ projectKey: string; flagKey: string }>();
  const { data: flag, isLoading: flagLoading, isError, error, refetch } = useFlagDetail(projectKey, flagKey);
  const { data: environments, isLoading: envsLoading } = useEnvironments(projectKey);

  // Build ordered list of environments with their configs
  const envEntries = useMemo(() => {
    if (!flag?.environments || !environments) return [];

    const ENV_ORDER = ["local-dev", "dev", "test", "stage", "production"];
    const orderIndex = (key: string) => {
      const idx = ENV_ORDER.indexOf(key);
      return idx === -1 ? ENV_ORDER.length : idx;
    };

    return environments
      .filter((env) => flag.environments![env.key])
      .map((env) => ({
        key: env.key,
        name: env.name,
        color: env.color,
        config: flag.environments![env.key]!,
      }))
      .sort((a, b) => orderIndex(a.key) - orderIndex(b.key));
  }, [flag, environments]);

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
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400"
      >
        <ArrowLeft size={14} />
        Back to Flags
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{flag.name}</h1>
          <Badge variant={flag.kind === "boolean" ? "info" : "warning"}>
            {flag.kind === "boolean" ? "Boolean" : "Multivariate"}
          </Badge>
        </div>
        <p className="mt-1 font-mono text-sm text-gray-400">{flag.key}</p>
        {flag.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{flag.description}</p>
        )}
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={12} />
          Created {format(new Date(flag.creationDate), "MMM d, yyyy")}
        </div>
      </div>

      {/* Variations (shared across all environments) */}
      <div className="mb-6">
        <VariationsSection variations={flag.variations} />
      </div>

      {/* All Environments - Expandable Sections */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Environments
      </h2>
      <div className="space-y-3">
        {envEntries.map((entry) => (
          <EnvironmentSection
            key={entry.key}
            envKey={entry.key}
            envName={entry.name}
            envColor={entry.color}
            config={entry.config}
            variations={flag.variations}
          />
        ))}

        {envEntries.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            No environment configurations found for this flag.
          </div>
        )}
      </div>
    </div>
  );
}
