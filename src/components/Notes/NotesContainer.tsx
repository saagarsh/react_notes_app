import { FileText, Sparkles, Trash2 } from 'lucide-react';
import { Note } from '../../types';
import { NoteCard } from './NoteCard';

interface NotesContainerProps {
  notes: Note[];
  viewMode: 'grid' | 'list';
  currentView: 'all' | 'archive' | 'trash';
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onUpdate?: (id: string, updates: Partial<Note>) => void;
  onEmptyTrash?: () => void;
}

export function NotesContainer({
  notes,
  viewMode,
  currentView,
  onEdit,
  onDelete,
  onPermanentDelete,
  onRestore,
  onArchive,
  onUnarchive,
  onColorChange,
  onUpdate,
  onEmptyTrash,
}: NotesContainerProps) {
  if (notes.length === 0) {
    const emptyMessages = {
      all: "No notes yet. Create your first note to get started!",
      archive: "No archived notes. Archive notes you want to keep but don't need to see regularly.",
      trash: "No notes in trash. Deleted notes will appear here."
    };

    const emptyIcons = {
      all: <Sparkles className="h-20 w-20 mb-6 text-primary-300 dark:text-primary-600" />,
      archive: <FileText className="h-20 w-20 mb-6 text-gray-300 dark:text-gray-600" />,
      trash: <FileText className="h-20 w-20 mb-6 text-gray-300 dark:text-gray-600" />
    };

    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
        {emptyIcons[currentView]}
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          {currentView === 'all' ? 'Start Your Journey' : 'Nothing Here Yet'}
        </h3>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
          {emptyMessages[currentView]}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Empty Trash Button for Trash View */}
      {currentView === 'trash' && notes.length > 0 && onEmptyTrash && (
        <div className="flex justify-end">
          <button
            onClick={onEmptyTrash}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <Trash2 className="h-4 w-4" />
            <span>Empty Trash</span>
          </button>
        </div>
      )}

      {/* Notes Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      >
        {notes.map((note, index) => (
          <div
            key={note.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-slide-up"
          >
            <NoteCard
              note={note}
              viewMode={viewMode}
              isInTrash={currentView === 'trash'}
              isInArchive={currentView === 'archive'}
              onEdit={onEdit}
              onDelete={onDelete}
              onPermanentDelete={onPermanentDelete}
              onRestore={onRestore}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              onColorChange={onColorChange}
              onUpdate={onUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}