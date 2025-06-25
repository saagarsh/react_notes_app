import axios from 'axios';
import { Note, ChecklistItem, NoteColor } from '../types';

// Use environment variable or fallback to relative path for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    console.error('❌ API Response Error:', errorMessage);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('🔌 Backend server is not running or not accessible');
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export interface CreateNoteRequest {
  title: string;
  content: string;
  color: NoteColor;
  type: 'text' | 'checklist';
  checklist?: ChecklistItem[];
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  color?: NoteColor;
  checklist?: ChecklistItem[];
  fontSize?: 'small' | 'medium' | 'large';
  fontFamily?: 'sans' | 'serif' | 'mono';
}

export const notesApi = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    try {
      const response = await api.get('/notes');
      return response.data.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  },

  // Create a new note
  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    try {
      const response = await api.post('/notes', noteData);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  },

  // Update a note
  updateNote: async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
    try {
      const response = await api.put(`/notes/${id}`, updates);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  // Delete a note (move to trash)
  deleteNote: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },

  // Permanently delete a note
  permanentlyDeleteNote: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notes/${id}/permanent`);
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
      throw error;
    }
  },

  // Empty trash
  emptyTrash: async (): Promise<void> => {
    try {
      await api.delete('/notes/trash/empty');
    } catch (error) {
      console.error('Failed to empty trash:', error);
      throw error;
    }
  },

  // Restore a note
  restoreNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.put(`/notes/${id}/restore`);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to restore note:', error);
      throw error;
    }
  },

  // Archive a note
  archiveNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.put(`/notes/${id}/archive`);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to archive note:', error);
      throw error;
    }
  },

  // Unarchive a note
  unarchiveNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.put(`/notes/${id}/unarchive`);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to unarchive note:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};