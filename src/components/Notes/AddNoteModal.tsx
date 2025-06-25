import React, { useState, useEffect } from 'react';
import { X, Plus, Type, CheckSquare, Palette } from 'lucide-react';
import { NoteColor, ChecklistItem } from '../../types';
import { ColorPicker } from './ColorPicker';
import { ChecklistEditor } from './ChecklistEditor';
import { DEFAULT_NOTE_COLOR } from '../../utils/constants';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string, 
    content: string, 
    color: NoteColor, 
    type: 'text' | 'checklist',
    checklist?: ChecklistItem[],
    fontSize?: 'small' | 'medium' | 'large',
    fontFamily?: 'sans' | 'serif' | 'mono'
  ) => void;
  defaultFontSize: 'small' | 'medium' | 'large';
  defaultFontFamily: 'sans' | 'serif' | 'mono';
}

export function AddNoteModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  defaultFontSize, 
  defaultFontFamily 
}: AddNoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<NoteColor>(DEFAULT_NOTE_COLOR);
  const [noteType, setNoteType] = useState<'text' | 'checklist'>('text');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(defaultFontSize);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>(defaultFontFamily);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Update font settings when defaults change
  useEffect(() => {
    setFontSize(defaultFontSize);
    setFontFamily(defaultFontFamily);
  }, [defaultFontSize, defaultFontFamily]);

  // Handle escape key and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() || content.trim() || (noteType === 'checklist' && checklist.length > 0)) {
      onAdd(
        title.trim(), 
        content.trim(), 
        selectedColor, 
        noteType,
        noteType === 'checklist' ? checklist : undefined,
        fontSize,
        fontFamily
      );
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedColor(DEFAULT_NOTE_COLOR);
    setNoteType('text');
    setChecklist([]);
    setFontSize(defaultFontSize);
    setFontFamily(defaultFontFamily);
    setShowColorPicker(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 animate-scale-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-red-100 dark:border-red-900 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Note
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Note Type Toggle */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setNoteType('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                noteType === 'text'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Type className="h-4 w-4" />
              <span className="font-medium">Text Note</span>
            </button>
            <button
              type="button"
              onClick={() => setNoteType('checklist')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                noteType === 'checklist'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              <span className="font-medium">Checklist</span>
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className={`w-full text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-0 pb-2 border-b-2 border-red-100 dark:border-red-900 focus:border-primary-500 ${fontFamily === 'sans' ? 'font-sans' : fontFamily === 'serif' ? 'font-serif' : 'font-mono'}`}
                autoFocus
              />
              
              {noteType === 'text' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Take a note..."
                  rows={8}
                  className={`w-full bg-transparent border-2 border-red-100 dark:border-red-900 rounded-xl p-4 outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'} ${fontFamily === 'sans' ? 'font-sans' : fontFamily === 'serif' ? 'font-serif' : 'font-mono'}`}
                />
              ) : (
                <ChecklistEditor
                  checklist={checklist}
                  onChange={setChecklist}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                />
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-red-100 dark:border-red-900 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">Color</span>
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-red-200 dark:border-red-700 z-10">
                    <ColorPicker
                      selectedColor={selectedColor}
                      onColorChange={(color) => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!title.trim() && !content.trim() && (noteType !== 'checklist' || checklist.length === 0)}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Create Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}