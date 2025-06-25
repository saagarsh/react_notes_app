import { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { NotesContainer } from './components/Notes/NotesContainer';
import { AddNoteModal } from './components/Notes/AddNoteModal';
import { useNotes } from './hooks/useNotes';

function App() {
  const {
    notes,
    noteCounts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentView,
    setCurrentView,
    viewMode,
    setViewMode,
    darkMode,
    setDarkMode,
    globalFontSize,
    setGlobalFontSize,
    globalFontFamily,
    setGlobalFontFamily,
    createNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    emptyTrash,
    restoreNote,
    archiveNote,
    unarchiveNote,
    refreshNotes,
  } = useNotes();

  const [showAddModal, setShowAddModal] = useState(false);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleEditNote = async (id: string, title: string, content: string) => {
    try {
      await updateNote(id, { title, content });
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const handleColorChange = async (id: string, color: string) => {
    try {
      await updateNote(id, { color });
    } catch (error) {
      console.error('Failed to change note color:', error);
    }
  };

  const handleEmptyTrash = async () => {
    if (window.confirm('Are you sure you want to permanently delete all notes in trash? This action cannot be undone.')) {
      try {
        await emptyTrash();
      } catch (error) {
        console.error('Failed to empty trash:', error);
      }
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'archive':
        return 'Archive';
      case 'trash':
        return 'Trash';
      default:
        return 'Notes';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black transition-all duration-300">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onAddNote={() => setShowAddModal(true)}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          noteCounts={noteCounts}
          globalFontSize={globalFontSize}
          globalFontFamily={globalFontFamily}
          onGlobalFontSizeChange={setGlobalFontSize}
          onGlobalFontFamilyChange={setGlobalFontFamily}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getViewTitle()}
              </h2>
              {searchQuery && (
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Search results for "{searchQuery}"
                </p>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={refreshNotes}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mt-2"></div>
            </div>
            
            <NotesContainer
              notes={notes}
              viewMode={viewMode}
              currentView={currentView}
              onEdit={handleEditNote}
              onDelete={deleteNote}
              onPermanentDelete={permanentlyDeleteNote}
              onRestore={restoreNote}
              onArchive={archiveNote}
              onUnarchive={unarchiveNote}
              onColorChange={handleColorChange}
              onUpdate={updateNote}
              onEmptyTrash={handleEmptyTrash}
            />
          </div>
        </main>
      </div>

      <AddNoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={createNote}
        defaultFontSize={globalFontSize}
        defaultFontFamily={globalFontFamily}
      />
    </div>
  );
}

export default App;