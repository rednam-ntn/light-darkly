import { Routes, Route, Navigate } from "react-router-dom";
import { useApiToken } from "@/hooks/useApiToken";
import { AppLayout } from "@/components/layout/AppLayout";
import { MissingTokenPage } from "@/features/error/MissingTokenPage";
import { ProjectList } from "@/features/projects/ProjectList";
import { FlagList } from "@/features/flags/FlagList";
import { FlagDetail } from "@/features/flags/FlagDetail";
import { DurationCalculator } from "@/features/tools/DurationCalculator";

export default function App() {
  const { isConfigured } = useApiToken();

  return (
    <Routes>
      {/* Tools routes — accessible without an API token */}
      <Route element={<AppLayout showConnectionStatus={isConfigured} />}>
        <Route path="/tools/duration" element={<DurationCalculator />} />
      </Route>

      {/* Auth-required routes */}
      <Route element={<AppLayout showConnectionStatus={isConfigured} />}>
        {!isConfigured ? (
          <Route path="*" element={<MissingTokenPage />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:projectKey" element={<FlagList />} />
            <Route path="/projects/:projectKey/flags/:flagKey" element={<FlagDetail />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </>
        )}
      </Route>
    </Routes>
  );
}
