import { useState, useCallback, useMemo, useEffect } from 'react';
import { Note, NoteColor, ChecklistItem } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { notesApi, CreateNoteRequest, UpdateNoteRequest } from '../services/api';
import { DEFAULT_NOTE_COLOR } from '../utils/constants';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'all' | 'archive' | 'trash'>('all');
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('viewMode', 'grid');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [globalFontSize, setGlobalFontSize] = useLocalStorage<'small' | 'medium' | 'large'>('globalFontSize', 'medium');
  const [globalFontFamily, setGlobalFontFamily] = useLocalStorage<'sans' | 'serif' | 'mono'>('globalFontFamily', 'sans');

  // Load notes from API
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await notesApi.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes. Please check your connection.');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(async (
    title: string, 
    content: string, 
    color: NoteColor = DEFAULT_NOTE_COLOR,
    type: 'text' | 'checklist' = 'text',
    checklist?: ChecklistItem[],
    fontSize: 'small' | 'medium' | 'large' = globalFontSize,
    fontFamily: 'sans' | 'serif' | 'mono' = globalFontFamily
  ) => {
    try {
      const noteData: CreateNoteRequest = {
        title,
        content,
        color,
        type,
        checklist,
        fontSize,
        fontFamily,
      };
      
      const newNote = await notesApi.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
      throw err;
    }
  }, [globalFontSize, globalFontFamily]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      const updateData: UpdateNoteRequest = {
        title: updates.title,
        content: updates.content,
        color: updates.color as NoteColor,
        checklist: updates.checklist,
        fontSize: updates.fontSize,
        fontFamily: updates.fontFamily,
      };
      
      const updatedNote = await notesApi.updateNote(id, updateData);
      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));
    } catch (err) {
      setError('Failed to update note. Please try again.');
      console.error('Error updating note:', err);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, isDeleted: true, updatedAt: new Date() }
          : note
      ));
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
      throw err;
    }
  }, []);

  const permanentlyDeleteNote = useCallback(async (id: string) => {
    try {
      await notesApi.permanentlyDeleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to permanently delete note. Please try again.');
      console.error('Error permanently deleting note:', err);
      throw err;
    }
  }, []);

  const emptyTrash = useCallback(async () => {
    try {
      await notesApi.emptyTrash();
      setNotes(prev => prev.filter(note => !note.isDeleted));
    } catch (err) {
      setError('Failed to empty trash. Please try again.');
      console.error('Error emptying trash:', err);
      throw err;
    }
  }, []);

  const restoreNote = useCallback(async (id: string) => {
    try {
      const restoredNote = await notesApi.restoreNote(id);
      setNotes(prev => prev.map(note => 
        note.id === id ? restoredNote : note
      ));
    } catch (err) {
      setError('Failed to restore note. Please try again.');
      console.error('Error restoring note:', err);
      throw err;
    }
  }, []);

  const archiveNote = useCallback(async (id: string) => {
    try {
      const archivedNote = await notesApi.archiveNote(id);
      setNotes(prev => prev.map(note => 
        note.id === id ? archivedNote : note
      ));
    } catch (err) {
      setError('Failed to archive note. Please try again.');
      console.error('Error archiving note:', err);
      throw err;
    }
  }, []);

  const unarchiveNote = useCallback(async (id: string) => {
    try {
      const unarchivedNote = await notesApi.unarchiveNote(id);
      setNotes(prev => prev.map(note => 
        note.id === id ? unarchivedNote : note
      ));
    } catch (err) {
      setError('Failed to unarchive note. Please try again.');
      console.error('Error unarchiving note:', err);
      throw err;
    }
  }, []);

  // Calculate note counts for sidebar
  const noteCounts = useMemo(() => {
    const allNotes = notes.filter(note => !note.isDeleted && !note.isArchived).length;
    const archivedNotes = notes.filter(note => note.isArchived && !note.isDeleted).length;
    const trashedNotes = notes.filter(note => note.isDeleted).length;
    
    return {
      all: allNotes,
      archive: archivedNotes,
      trash: trashedNotes,
    };
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      if (currentView === 'all') return !note.isDeleted && !note.isArchived;
      if (currentView === 'archive') return note.isArchived && !note.isDeleted;
      if (currentView === 'trash') return note.isDeleted;
      return false;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        (note.checklist && note.checklist.some(item => item.text.toLowerCase().includes(query)))
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes, currentView, searchQuery]);

  return {
    notes: filteredNotes,
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
    refreshNotes: loadNotes,
  };
}