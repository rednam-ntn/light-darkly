import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useProjects } from "@/hooks/useProjects";

export function AppLayout() {
  const { isError, isLoading } = useProjects();

  const connectionStatus = isLoading
    ? "loading"
    : isError
      ? "error"
      : "connected";

  return (
    <div className="flex min-h-screen flex-col">
      <Header connectionStatus={connectionStatus as "connected" | "error" | "loading"} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
