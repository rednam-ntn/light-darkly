import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(v: string) {
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 300);
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search flags by name or key..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
      {localValue && (
        <button
          onClick={() => handleChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
      {resultCount !== undefined && totalCount !== undefined && value && (
        <p className="mt-1 text-xs text-gray-500">
          {resultCount} of {totalCount} flags
        </p>
      )}
    </div>
  );
}
