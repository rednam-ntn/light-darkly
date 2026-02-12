import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        <a
          href="https://github.com/rednam-ntn/light-darkly"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="GitHub repository"
        >
          <Github size={18} />
        </a>
      </div>
    </footer>
  );
}
