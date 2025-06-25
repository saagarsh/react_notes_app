import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Create __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8002;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');
const publicPath = path.join(__dirname, '..', 'public');

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['http://localhost:8002', 'http://127.0.0.1:8002'] 
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(publicPath));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('📁 Created data directory:', dataDir);
  }
}

// Load notes from file
async function loadNotes() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const notes = JSON.parse(data);
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.log('📝 No existing notes file found, starting with empty array');
    return [];
  }
}

// Save notes to file
async function saveNotes(notes) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
    console.log(`💾 Saved ${notes.length} notes to file`);
  } catch (error) {
    console.error('❌ Error saving notes:', error);
    throw error;
  }
}

// Validate note data
function validateNoteData(data) {
  const errors = [];
  
  if (data.title !== undefined && typeof data.title !== 'string') {
    errors.push('Title must be a string');
  }
  
  if (data.content !== undefined && typeof data.content !== 'string') {
    errors.push('Content must be a string');
  }
  
  if (data.type && !['text', 'checklist'].includes(data.type)) {
    errors.push('Type must be either "text" or "checklist"');
  }
  
  if (data.fontSize && !['small', 'medium', 'large'].includes(data.fontSize)) {
    errors.push('Font size must be "small", "medium", or "large"');
  }
  
  if (data.fontFamily && !['sans', 'serif', 'mono'].includes(data.fontFamily)) {
    errors.push('Font family must be "sans", "serif", or "mono"');
  }
  
  return errors;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    port: PORT
  });
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await loadNotes();
    console.log(`📖 Retrieved ${notes.length} notes`);
    res.json(notes);
  } catch (error) {
    console.error('❌ Error loading notes:', error);
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const validationErrors = validateNoteData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const notes = await loadNotes();
    const newNote = {
      id: crypto.randomUUID(),
      title: req.body.title || '',
      content: req.body.content || '',
      color: req.body.color || 'default',
      type: req.body.type || 'text',
      checklist: req.body.checklist || [],
      fontSize: req.body.fontSize || 'medium',
      fontFamily: req.body.fontFamily || 'sans',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isDeleted: false,
    };
    
    notes.unshift(newNote);
    await saveNotes(notes);
    console.log(`✅ Created new note: ${newNote.id}`);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const validationErrors = validateNoteData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const notes = await loadNotes();
    const noteIndex = notes.findIndex(note => note.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Preserve existing data and only update provided fields
    const updatedNote = {
      ...notes[noteIndex],
      ...req.body,
      id: notes[noteIndex].id, // Ensure ID cannot be changed
      createdAt: notes[noteIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };
    
    notes[noteIndex] = updatedNote;
    await saveNotes(notes);
    console.log(`✅ Updated note: ${req.params.id}`);
    res.json(updatedNote);
  } catch (error) {
    console.error('❌ Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note (move to trash)
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const notes = await loadNotes();
    const noteIndex = notes.findIndex(note => note.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    notes[noteIndex].isDeleted = true;
    notes[noteIndex].updatedAt = new Date().toISOString();
    
    await saveNotes(notes);
    console.log(`🗑️ Moved note to trash: ${req.params.id}`);
    res.json({ message: 'Note moved to trash' });
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Permanently delete a note
app.delete('/api/notes/:id/permanent', async (req, res) => {
  try {
    const notes = await loadNotes();
    const filteredNotes = notes.filter(note => note.id !== req.params.id);
    
    if (notes.length === filteredNotes.length) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    await saveNotes(filteredNotes);
    console.log(`💀 Permanently deleted note: ${req.params.id}`);
    res.json({ message: 'Note permanently deleted' });
  } catch (error) {
    console.error('❌ Error permanently deleting note:', error);
    res.status(500).json({ error: 'Failed to permanently delete note' });
  }
});

// Empty trash
app.delete('/api/notes/trash/empty', async (req, res) => {
  try {
    const notes = await loadNotes();
    const activeNotes = notes.filter(note => !note.isDeleted);
    const deletedCount = notes.length - activeNotes.length;
    
    await saveNotes(activeNotes);
    console.log(`🗑️ Emptied trash: ${deletedCount} notes permanently deleted`);
    res.json({ 
      message: 'Trash emptied successfully',
      deletedCount 
    });
  } catch (error) {
    console.error('❌ Error emptying trash:', error);
    res.status(500).json({ error: 'Failed to empty trash' });
  }
});

// Restore a note
app.put('/api/notes/:id/restore', async (req, res) => {
  try {
    const notes = await loadNotes();
    const noteIndex = notes.findIndex(note => note.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    notes[noteIndex].isDeleted = false;
    notes[noteIndex].isArchived = false;
    notes[noteIndex].updatedAt = new Date().toISOString();
    
    await saveNotes(notes);
    console.log(`♻️ Restored note: ${req.params.id}`);
    res.json(notes[noteIndex]);
  } catch (error) {
    console.error('❌ Error restoring note:', error);
    res.status(500).json({ error: 'Failed to restore note' });
  }
});

// Archive a note
app.put('/api/notes/:id/archive', async (req, res) => {
  try {
    const notes = await loadNotes();
    const noteIndex = notes.findIndex(note => note.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    notes[noteIndex].isArchived = true;
    notes[noteIndex].updatedAt = new Date().toISOString();
    
    await saveNotes(notes);
    console.log(`📦 Archived note: ${req.params.id}`);
    res.json(notes[noteIndex]);
  } catch (error) {
    console.error('❌ Error archiving note:', error);
    res.status(500).json({ error: 'Failed to archive note' });
  }
});

// Unarchive a note
app.put('/api/notes/:id/unarchive', async (req, res) => {
  try {
    const notes = await loadNotes();
    const noteIndex = notes.findIndex(note => note.id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    notes[noteIndex].isArchived = false;
    notes[noteIndex].updatedAt = new Date().toISOString();
    
    await saveNotes(notes);
    console.log(`📤 Unarchived note: ${req.params.id}`);
    res.json(notes[noteIndex]);
  } catch (error) {
    console.error('❌ Error unarchiving note:', error);
    res.status(500).json({ error: 'Failed to unarchive note' });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Initialize server
async function startServer() {
  try {
    await ensureDataDirectory();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Notes App Server running on port ${PORT}`);
      console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📁 Data directory: ${path.dirname(DATA_FILE)}`);
      console.log(`🌐 Serving frontend from: ${publicPath}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer();