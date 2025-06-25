import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 border-2 border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transform hover:scale-105"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
      )}
    </button>
  );
}