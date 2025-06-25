export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  isDeleted: boolean;
  type: 'text' | 'checklist';
  checklist?: ChecklistItem[];
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface NotesState {
  notes: Note[];
  searchQuery: string;
  currentView: 'all' | 'archive' | 'trash';
  viewMode: 'grid' | 'list';
  darkMode: boolean;
}

export type NoteColor = 
  | 'default' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'pink';