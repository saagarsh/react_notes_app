import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { ChecklistItem } from '../../types';

interface ChecklistEditorProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans' | 'serif' | 'mono';
  readOnly?: boolean;
  onChecklistUpdate?: (checklist: ChecklistItem[]) => void;
}

export function ChecklistEditor({ 
  checklist, 
  onChange, 
  fontSize, 
  fontFamily, 
  readOnly = false,
  onChecklistUpdate
}: ChecklistEditorProps) {
  const [newItemText, setNewItemText] = useState('');

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: newItemText.trim(),
        completed: false,
      };
      const updatedChecklist = [...checklist, newItem];
      onChange(updatedChecklist);
      if (onChecklistUpdate) {
        onChecklistUpdate(updatedChecklist);
      }
      setNewItemText('');
    }
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onChange(updatedChecklist);
    if (onChecklistUpdate) {
      onChecklistUpdate(updatedChecklist);
    }
  };

  const removeItem = (id: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== id);
    onChange(updatedChecklist);
    if (onChecklistUpdate) {
      onChecklistUpdate(updatedChecklist);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addItem();
    }
  };

  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';
  const fontFamilyClass = fontFamily === 'sans' ? 'font-sans' : fontFamily === 'serif' ? 'font-serif' : 'font-mono';

  return (
    <div className="space-y-3">
      {checklist.map((item) => (
        <div key={item.id} className="flex items-center space-x-3 group">
          <button
            type="button"
            onClick={() => !readOnly && updateItem(item.id, { completed: !item.completed })}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
              item.completed
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={readOnly}
          >
            {item.completed && <Check className="h-3 w-3" />}
          </button>
          
          {readOnly ? (
            <span className={`flex-1 ${fontSizeClass} ${fontFamilyClass} ${
              item.completed 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {item.text}
            </span>
          ) : (
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              className={`flex-1 bg-transparent border-none outline-none ${fontSizeClass} ${fontFamilyClass} ${
                item.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-700 dark:text-gray-300'
              } placeholder-gray-400`}
              placeholder="List item..."
            />
          )}
          
          {!readOnly && (
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          )}
        </div>
      ))}
      
      {!readOnly && (
        <div className="flex items-center space-x-3 pt-2">
          <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600"></div>
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new item..."
            className={`flex-1 bg-transparent border-none outline-none ${fontSizeClass} ${fontFamilyClass} text-gray-700 dark:text-gray-300 placeholder-gray-400`}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={!newItemText.trim()}
            className="flex-shrink-0 p-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </button>
        </div>
      )}
    </div>
  );
}