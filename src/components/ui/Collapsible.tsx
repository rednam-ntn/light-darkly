import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsibleProps {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ header, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-gray-50"
        aria-expanded={open}
      >
        <div className="flex-1">{header}</div>
        <ChevronRight
          size={18}
          className={`ml-2 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
