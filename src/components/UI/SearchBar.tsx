import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search notes..." }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-12 pr-12 py-3 border-2 border-red-200 dark:border-red-800 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-red-100 dark:hover:bg-red-900/30 rounded-r-xl transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400" />
        </button>
      )}
    </div>
  );
}