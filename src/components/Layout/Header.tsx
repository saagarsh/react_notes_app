import { Plus, StickyNote } from 'lucide-react';
import { SearchBar } from '../UI/SearchBar';
import { ThemeToggle } from '../UI/ThemeToggle';
import { ViewToggle } from '../UI/ViewToggle';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onAddNote: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  darkMode,
  onDarkModeToggle,
  onAddNote,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-red-200 dark:border-red-900/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <StickyNote className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              NotesApp
            </h1>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-6">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search your notes..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <ViewToggle
              viewMode={viewMode}
              onToggle={onViewModeChange}
            />
            <ThemeToggle
              darkMode={darkMode}
              onToggle={onDarkModeToggle}
            />
            <button
              onClick={onAddNote}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">New Note</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}