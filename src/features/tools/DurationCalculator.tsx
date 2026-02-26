import { useState, useEffect, useCallback } from "react";
import { Timer, AlertCircle, Clock } from "lucide-react";

interface TimeEntry {
  id: string;
  start: string;
  end: string | null;
  [key: string]: unknown;
}

interface ParsedEntry {
  id: string;
  start: Date;
  end: Date | null;
  durationMs: number | null;
}

interface ParseResult {
  entries: ParsedEntry[];
  totalMs: number;
  hasOpenEntries: boolean;
}

function parseDurationMs(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}

function formatDuration(ms: number): string {
  if (ms < 0) return "Invalid";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

function formatDateTime(date: Date): string {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseJson(raw: string): ParseResult | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    let totalMs = 0;
    let hasOpenEntries = false;

    const entries: ParsedEntry[] = parsed.map((item: TimeEntry, idx: number) => {
      const start = new Date(item.start);
      const end = item.end ? new Date(item.end) : null;

      if (isNaN(start.getTime())) throw new Error(`Invalid start at index ${idx}`);
      if (end && isNaN(end.getTime())) throw new Error(`Invalid end at index ${idx}`);

      const durationMs = end ? parseDurationMs(start, end) : null;
      if (durationMs !== null) totalMs += durationMs;
      else hasOpenEntries = true;

      return { id: String(item.id ?? idx), start, end, durationMs };
    });

    return { entries, totalMs, hasOpenEntries };
  } catch {
    return null;
  }
}

export function DurationCalculator() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [parseError, setParseError] = useState(false);
  const [formatted, setFormatted] = useState("");

  const handleChange = useCallback((value: string) => {
    setRaw(value);

    if (!value.trim()) {
      setResult(null);
      setParseError(false);
      setFormatted("");
      return;
    }

    const parsed = parseJson(value);
    if (parsed) {
      setResult(parsed);
      setParseError(false);
      // Auto-format
      try {
        setFormatted(JSON.stringify(JSON.parse(value), null, 4));
      } catch {
        setFormatted(value);
      }
    } else {
      setResult(null);
      setParseError(true);
      setFormatted(value);
    }
  }, []);

  // Sync textarea value to formatted version after a short delay
  useEffect(() => {
    if (!formatted) return;
    const timer = setTimeout(() => {
      if (formatted !== raw) setRaw(formatted);
    }, 600);
    return () => clearTimeout(timer);
  }, [formatted, raw]);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center gap-2">
        <Timer size={22} className="shrink-0 text-primary-500" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Duration Calculator</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Paste a JSON array of objects with <code className="font-mono text-xs">start</code> and{" "}
            <code className="font-mono text-xs">end</code> timestamps to calculate durations.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Left: Input ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Input</label>
            {raw && (
              <button
                onClick={() => { setRaw(""); setFormatted(""); setResult(null); setParseError(false); }}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={raw}
            onChange={(e) => handleChange(e.target.value)}
            spellCheck={false}
            placeholder={`[\n  {\n    "id": "...",\n    "start": "2026-01-16T01:04:01.000Z",\n    "end": "2026-01-16T15:26:00.000Z"\n  }\n]`}
            className={[
              "h-[480px] w-full resize-none rounded-lg border p-3 font-mono text-xs",
              "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              parseError
                ? "border-red-400 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600",
            ].join(" ")}
          />
          {parseError && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={12} /> Invalid JSON — check your input.
            </p>
          )}
          {!parseError && !result && !raw && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Paste a JSON array. The textarea auto-formats valid JSON after a short pause.
            </p>
          )}
        </div>

        {/* ── Right: Results ── */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parsed Results</span>

          {!result && !parseError && (
            <div className="flex h-[480px] items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-400 dark:text-gray-500">Results will appear here</p>
            </div>
          )}

          {parseError && (
            <div className="flex h-[480px] items-center justify-center rounded-lg border border-dashed border-red-300 dark:border-red-700">
              <p className="text-sm text-red-400">Fix the JSON to see results</p>
            </div>
          )}

          {result && (
            <div className="flex h-[480px] flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Header: totals */}
              <div className="shrink-0 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{result.entries.length}</span>{" "}
                      {result.entries.length === 1 ? "entry" : "entries"}
                      {result.hasOpenEntries && (
                        <span className="ml-1 text-amber-500">· {result.entries.filter((e) => !e.end).length} in progress (excluded)</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Total Duration
                    </p>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {formatDuration(result.totalMs)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable entries list */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="sticky top-0 bg-gray-50 dark:bg-gray-800 text-left text-gray-500 dark:text-gray-400">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Start</th>
                      <th className="px-3 py-2 font-medium">End</th>
                      <th className="px-3 py-2 font-medium text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {result.entries.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      >
                        <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-gray-600 dark:text-gray-300">
                          <span title={entry.id} className="block max-w-[80px] truncate">
                            {entry.id}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {formatDateTime(entry.start)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {entry.end ? (
                            <span className="text-gray-600 dark:text-gray-300">{formatDateTime(entry.end)}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                              <Clock size={10} />
                              In progress
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {entry.durationMs !== null ? (
                            <span className="text-primary-600 dark:text-primary-400">
                              {formatDuration(entry.durationMs)}
                            </span>
                          ) : (
                            <span className="text-amber-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
