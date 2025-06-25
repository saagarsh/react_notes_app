import { useState } from 'react';
import { MoreHorizontal, Archive, ArchiveRestore, Trash2, RotateCcw, X, Edit3, Calendar, Clock, Save, XCircle } from 'lucide-react';
import { Note } from '../../types';
import { NOTE_COLORS, FONT_SIZES, FONT_FAMILIES } from '../../utils/constants';
import { ColorPicker } from './ColorPicker';
import { ChecklistEditor } from './ChecklistEditor';
import { FontSettings } from './FontSettings';

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  isInTrash?: boolean;
  isInArchive?: boolean;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onUpdate?: (id: string, updates: Partial<Note>) => void;
}

export function NoteCard({
  note,
  viewMode,
  isInTrash = false,
  isInArchive = false,
  onEdit,
  onDelete,
  onPermanentDelete,
  onRestore,
  onArchive,
  onUnarchive,
  onColorChange,
  onUpdate,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editChecklist, setEditChecklist] = useState(note.checklist || []);
  const [editFontSize, setEditFontSize] = useState(note.fontSize || 'medium');
  const [editFontFamily, setEditFontFamily] = useState(note.fontFamily || 'sans');

  const colorConfig = NOTE_COLORS[note.color as keyof typeof NOTE_COLORS];

  const handleSave = async () => {
    try {
      if (editTitle.trim() || editContent.trim() || (note.type === 'checklist' && editChecklist.length > 0)) {
        const updates: Partial<Note> = {
          title: editTitle.trim(),
          content: editContent.trim(),
          fontSize: editFontSize,
          fontFamily: editFontFamily,
        };
        
        if (note.type === 'checklist') {
          updates.checklist = editChecklist;
        }
        
        if (onUpdate) {
          await onUpdate(note.id, updates);
        } else {
          onEdit(note.id, editTitle.trim(), editContent.trim());
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditChecklist(note.checklist || []);
    setEditFontSize(note.fontSize || 'medium');
    setEditFontFamily(note.fontFamily || 'sans');
    setIsEditing(false);
  };

  const handleChecklistUpdate = async (updatedChecklist: any[]) => {
    if (onUpdate && !isEditing) {
      try {
        await onUpdate(note.id, { checklist: updatedChecklist });
      } catch (error) {
        console.error('Error updating checklist:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(date);
  };

  const fontSizeClass = FONT_SIZES[note.fontSize || 'medium'];
  const fontFamilyClass = FONT_FAMILIES[note.fontFamily || 'sans'];

  const EditingControls = () => (
    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-red-200 dark:border-red-800">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowFontSettings(!showFontSettings)}
          className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Font
        </button>
        {showFontSettings && (
          <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-20">
            <FontSettings
              fontSize={editFontSize}
              fontFamily={editFontFamily}
              onFontSizeChange={setEditFontSize}
              onFontFamilyChange={setEditFontFamily}
              onClose={() => setShowFontSettings(false)}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1"></div>
      
      <button
        onClick={handleCancel}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
      >
        <XCircle className="h-3 w-3" />
        <span>Cancel</span>
      </button>
      <button
        onClick={handleSave}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md font-medium"
      >
        <Save className="h-3 w-3" />
        <span>Save</span>
      </button>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <div
        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] animate-slide-up ${
          colorConfig.bg
        } ${colorConfig.bgDark} ${colorConfig.border} ${colorConfig.borderDark} ${
          isEditing ? 'ring-2 ring-primary-500 shadow-lg' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note title..."
                  className={`w-full text-lg font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 border-b-2 border-red-200 dark:border-red-800 focus:border-primary-500 pb-2 ${FONT_FAMILIES[editFontFamily]}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  autoFocus
                />
                
                {note.type === 'text' ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Take a note..."
                    className={`w-full bg-transparent border-2 border-red-200 dark:border-red-800 rounded-xl p-3 outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${FONT_SIZES[editFontSize]} ${FONT_FAMILIES[editFontFamily]}`}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === 'Escape') {
                        handleCancel();
                      }
                    }}
                  />
                ) : (
                  <div className="border-2 border-red-200 dark:border-red-800 rounded-xl p-3">
                    <ChecklistEditor
                      checklist={editChecklist}
                      onChange={setEditChecklist}
                      fontSize={editFontSize}
                      fontFamily={editFontFamily}
                    />
                  </div>
                )}
                
                <EditingControls />
              </div>
            ) : (
              <div onClick={() => !isInTrash && setIsEditing(true)} className={!isInTrash ? 'cursor-pointer' : ''}>
                <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-1 ${fontFamilyClass}`}>
                  {note.title || 'Untitled'}
                </h3>
                
                {note.type === 'text' ? (
                  <p className={`text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed ${fontSizeClass} ${fontFamilyClass}`}>
                    {note.content}
                  </p>
                ) : (
                  <div className="mb-4">
                    <ChecklistEditor
                      checklist={note.checklist || []}
                      onChange={() => {}}
                      fontSize={note.fontSize || 'medium'}
                      fontFamily={note.fontFamily || 'sans'}
                      readOnly={isInTrash}
                      onChecklistUpdate={!isInTrash ? handleChecklistUpdate : undefined}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(note.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated: {formatRelativeTime(note.updatedAt)}</span>
                    </div>
                  </div>
                  {!isInTrash && (
                    <Edit3 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative ml-6">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 transform hover:scale-110"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-10 animate-scale-in">
                <div className="py-2">
                  {!isInTrash && !isInArchive && onArchive && (
                    <button
                      onClick={() => {
                        onArchive(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                  )}
                  
                  {isInArchive && onUnarchive && (
                    <button
                      onClick={() => {
                        onUnarchive(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                      <span>Unarchive</span>
                    </button>
                  )}
                  
                  {isInTrash && onRestore && (
                    <button
                      onClick={() => {
                        onRestore(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restore</span>
                    </button>
                  )}
                  
                  {!isInTrash && (
                    <>
                      <button
                        onClick={() => {
                          setShowColorPicker(!showColorPicker);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Change color
                      </button>
                      <button
                        onClick={() => {
                          onDelete(note.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                  
                  {isInTrash && onPermanentDelete && (
                    <button
                      onClick={() => {
                        onPermanentDelete(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Delete forever</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-20 animate-scale-in">
            <ColorPicker
              selectedColor={note.color as any}
              onColorChange={(color) => {
                onColorChange(note.id, color);
                setShowColorPicker(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Grid view (similar structure but adapted for grid layout)
  return (
    <div
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-105 animate-slide-up ${
        colorConfig.bg
      } ${colorConfig.bgDark} ${colorConfig.border} ${colorConfig.borderDark} ${
        isEditing ? 'ring-2 ring-primary-500 shadow-lg' : ''
      }`}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors transform hover:scale-110"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-10 animate-scale-in">
            <div className="py-2">
              {!isInTrash && !isInArchive && onArchive && (
                <button
                  onClick={() => {
                    onArchive(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                >
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
              )}
              
              {isInArchive && onUnarchive && (
                <button
                  onClick={() => {
                    onUnarchive(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                >
                  <ArchiveRestore className="h-4 w-4" />
                  <span>Unarchive</span>
                </button>
              )}
              
              {isInTrash && onRestore && (
                <button
                  onClick={() => {
                    onRestore(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Restore</span>
                </button>
              )}
              
              {!isInTrash && (
                <>
                  <button
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Change color
                  </button>
                  <button
                    onClick={() => {
                      onDelete(note.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}
              
              {isInTrash && onPermanentDelete && (
                <button
                  onClick={() => {
                    onPermanentDelete(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Delete forever</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4 pr-12">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Note title..."
            className={`w-full text-lg font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 border-b-2 border-red-200 dark:border-red-800 focus:border-primary-500 pb-2 ${FONT_FAMILIES[editFontFamily]}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            autoFocus
          />
          
          {note.type === 'text' ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Take a note..."
              className={`w-full bg-transparent border-2 border-red-200 dark:border-red-800 rounded-xl p-3 outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${FONT_SIZES[editFontSize]} ${FONT_FAMILIES[editFontFamily]}`}
              rows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          ) : (
            <div className="border-2 border-red-200 dark:border-red-800 rounded-xl p-3">
              <ChecklistEditor
                checklist={editChecklist}
                onChange={setEditChecklist}
                fontSize={editFontSize}
                fontFamily={editFontFamily}
              />
            </div>
          )}
          
          <EditingControls />
        </div>
      ) : (
        <div onClick={() => !isInTrash && setIsEditing(true)} className={!isInTrash ? 'cursor-pointer pr-12' : 'pr-12'}>
          <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 ${fontFamilyClass}`}>
            {note.title || 'Untitled'}
          </h3>
          
          {note.type === 'text' ? (
            <p className={`text-gray-700 dark:text-gray-300 mb-6 line-clamp-4 leading-relaxed ${fontSizeClass} ${fontFamilyClass}`}>
              {note.content}
            </p>
          ) : (
            <div className="mb-6">
              <ChecklistEditor
                checklist={note.checklist || []}
                onChange={() => {}}
                fontSize={note.fontSize || 'medium'}
                fontFamily={note.fontFamily || 'sans'}
                readOnly={isInTrash}
                onChecklistUpdate={!isInTrash ? handleChecklistUpdate : undefined}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(note.updatedAt)}</span>
              </div>
            </div>
            {!isInTrash && (
              <Edit3 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      )}
      
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-20 animate-scale-in">
          <ColorPicker
            selectedColor={note.color as any}
            onColorChange={(color) => {
              onColorChange(note.id, color);
              setShowColorPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}