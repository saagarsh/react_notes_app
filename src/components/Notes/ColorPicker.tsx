import { Check } from 'lucide-react';
import { NoteColor } from '../../types';
import { NOTE_COLORS } from '../../utils/constants';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const colors: NoteColor[] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

  return (
    <div className="flex flex-wrap gap-3 p-4">
      {colors.map((color) => {
        const colorConfig = NOTE_COLORS[color];
        const isSelected = selectedColor === color;
        
        return (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 transform ${
              colorConfig.bg
            } ${colorConfig.bgDark} ${
              isSelected 
                ? 'border-primary-500 dark:border-primary-400 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          >
            {isSelected && (
              <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mx-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
}