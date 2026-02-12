import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types/launchdarkly";

const PAGE_SIZE = 20;

export function ProjectList() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [accumulated, setAccumulated] = useState<Project[]>([]);
  const lastAppliedOffset = useRef<number | null>(null);

  const { data: projects, isLoading, isFetching, isError, error, refetch } = useProjects({ offset });

  useEffect(() => {
    if (!projects) return;
    if (lastAppliedOffset.current === offset) return;

    lastAppliedOffset.current = offset;

    if (offset === 0) {
      setAccumulated(projects);
    } else {
      setAccumulated((prev) => [...prev, ...projects]);
    }
  }, [projects, offset]);

  const hasMore = projects ? projects.length >= PAGE_SIZE : false;

  const handleLoadMore = useCallback(() => {
    setOffset((prev) => prev + PAGE_SIZE);
  }, []);

  const isInitialLoading = isLoading && accumulated.length === 0;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-red-600">Failed to load projects</p>
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

  if (!accumulated.length) {
    return <EmptyState title="No projects found" description="No LaunchDarkly projects are accessible with this API token." />;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accumulated.map((project) => (
          <button
            key={project.key}
            onClick={() => navigate(`/projects/${project.key}`)}
            className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 flex items-center gap-2">
              <FolderKanban size={18} className="text-primary-500" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h2>
            </div>
            <p className="mb-3 font-mono text-xs text-gray-400">{project.key}</p>
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
            {project.environments && (
              <p className="mt-2 text-xs text-gray-500">
                {project.environments.totalCount} environment{project.environments.totalCount !== 1 ? "s" : ""}
              </p>
            )}
          </button>
        ))}
      </div>

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
        Showing {accumulated.length} project{accumulated.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
