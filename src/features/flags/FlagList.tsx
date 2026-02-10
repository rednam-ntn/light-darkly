import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFlags } from "@/hooks/useFlags";
import { useEnvironments } from "@/hooks/useEnvironments";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlagCard } from "./FlagCard";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 5;

export function FlagList() {
  const { projectKey } = useParams<{ projectKey: string }>();
  const { data: flags, isLoading: flagsLoading, isError, error, refetch } = useFlags(projectKey);
  const { data: environments, isLoading: envsLoading } = useEnvironments(projectKey);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!flags) return [];
    if (!search.trim()) return flags;
    const q = search.toLowerCase();
    return flags.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q),
    );
  }, [flags, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isLoading = flagsLoading || envsLoading;

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
          className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
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
          resultCount={filtered.length}
          totalCount={flags?.length}
        />
      </div>

      {paginated.length === 0 ? (
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
          {paginated.map((flag) => (
            <FlagCard
              key={flag.key}
              flag={flag}
              projectKey={projectKey!}
              environments={environments ?? []}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <p className="text-center text-xs text-gray-400">
        {filtered.length} flag{filtered.length !== 1 ? "s" : ""} total &middot; 5 per page
      </p>
    </div>
  );
}
