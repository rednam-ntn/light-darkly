import { useState, useEffect, useRef } from "react";
import { X, Shield } from "lucide-react";
import { getStoredApiKey } from "@/services/api-key-store";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ApiKeyModal({ open, onClose, onSave, onClear }: ApiKeyModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(getStoredApiKey() ?? "");
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleSave() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  }

  function handleClear() {
    onClear();
    setValue("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Change API Key"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Change API Key</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="api-key-input" className="mb-1 block text-sm font-medium text-gray-700">
              LaunchDarkly API Key
            </label>
            <input
              ref={inputRef}
              id="api-key-input"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="api-xxxx-xxxx-xxxx"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Privacy notice */}
          <div className="flex gap-3 rounded-md bg-blue-50 p-3">
            <Shield size={20} className="mt-0.5 shrink-0 text-blue-600" />
            <div className="text-xs text-blue-800">
              <p className="mb-1 font-semibold">Privacy Notice</p>
              <p>
                Your API key is stored <strong>only</strong> in your browser's local storage.
                It is <strong>never</strong> sent to or stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleClear}
            className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Clear Key
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!value.trim()}
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
