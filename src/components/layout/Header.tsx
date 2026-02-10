import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface HeaderProps {
  connectionStatus: "connected" | "error" | "loading";
}

export function Header({ connectionStatus }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <Zap size={20} className="text-primary-500" />
          <span>Light Darkly</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {connectionStatus === "connected" && (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span className="text-gray-500">Connected</span>
            </>
          )}
          {connectionStatus === "error" && (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-600">Connection Error</span>
            </>
          )}
          {connectionStatus === "loading" && (
            <>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-gray-500">Connecting...</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
