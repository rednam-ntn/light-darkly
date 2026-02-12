import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFlags } from "@/hooks/useFlags";
import { useEnvironments } from "@/hooks/useEnvironments";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlagCard } from "./FlagCard";
import { SearchBar } from "./SearchBar";
import type { FeatureFlag } from "@/types/launchdarkly";

const PAGE_SIZE = 5;

export function FlagList() {
  const { projectKey } = useParams<{ projectKey: string }>();
  const { data: environments, isLoading: envsLoading } = useEnvironments(projectKey);

  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [accumulated, setAccumulated] = useState<FeatureFlag[]>([]);
  const lastAppliedRef = useRef<{ search: string; offset: number } | null>(null);

  const { data: flags, isLoading: flagsLoading, isFetching, isError, error, refetch } = useFlags(
    projectKey,
    { query: search, offset },
  );

  // Accumulate results in useEffect — only when fresh data arrives for current query
  useEffect(() => {
    if (!flags) return;

    const key = { search, offset };
    const last = lastAppliedRef.current;

    // Skip if we already processed this exact (search, offset) combination
    if (last && last.search === key.search && last.offset === key.offset) return;

    lastAppliedRef.current = key;

    if (offset === 0) {
      // New search or initial load — replace
      setAccumulated(flags);
    } else {
      // Load more — append
      setAccumulated((prev) => [...prev, ...flags]);
    }
  }, [flags, search, offset]);

  const hasMore = flags ? flags.length >= PAGE_SIZE : false;

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setOffset(0);
    setAccumulated([]);
    lastAppliedRef.current = null;
  }, []);

  function handleLoadMore() {
    setOffset((prev) => prev + PAGE_SIZE);
  }

  const isLoading = (flagsLoading && accumulated.length === 0) || envsLoading;

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
        <p className="mb-4 text-red-600">Failed to load feature flags</p>
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

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/projects"
          className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Feature Flags
          <span className="ml-2 text-base font-normal text-gray-400">
            {projectKey}
          </span>
        </h1>
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          isSearching={isFetching && !!search}
        />
      </div>

      {accumulated.length === 0 ? (
        <EmptyState
          title={search ? "No matching flags" : "No feature flags"}
          description={
            search
              ? "Try a different search term."
              : "This project has no feature flags."
          }
        />
      ) : (
        <div className="space-y-3">
          {accumulated.map((flag) => (
            <FlagCard
              key={flag.key}
              flag={flag}
              projectKey={projectKey!}
              environments={environments ?? []}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isFetching ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        Showing {accumulated.length} flag{accumulated.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
