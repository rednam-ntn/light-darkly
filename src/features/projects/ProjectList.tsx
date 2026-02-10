import { useNavigate } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export function ProjectList() {
  const { data: projects, isLoading, isError, error, refetch } = useProjects();
  const navigate = useNavigate();

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

  if (!projects?.length) {
    return <EmptyState title="No projects found" description="No LaunchDarkly projects are accessible with this API token." />;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Projects</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <button
            key={project.key}
            onClick={() => navigate(`/projects/${project.key}`)}
            className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary-300 hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2">
              <FolderKanban size={18} className="text-primary-500" />
              <h2 className="font-semibold text-gray-900">{project.name}</h2>
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
    </div>
  );
}
