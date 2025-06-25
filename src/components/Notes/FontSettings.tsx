import { Type, AlignLeft, Code } from 'lucide-react';

interface FontSettingsProps {
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans' | 'serif' | 'mono';
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onFontFamilyChange: (family: 'sans' | 'serif' | 'mono') => void;
  onClose: () => void;
  isGlobal?: boolean;
}

export function FontSettings({
  fontSize,
  fontFamily,
  onFontSizeChange,
  onFontFamilyChange,
  onClose,
  isGlobal = false,
}: FontSettingsProps) {
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    onFontSizeChange(size);
    if (!isGlobal) {
      onClose();
    }
  };

  const handleFontFamilyChange = (family: 'sans' | 'serif' | 'mono') => {
    onFontFamilyChange(family);
    if (!isGlobal) {
      onClose();
    }
  };

  return (
    <div className={isGlobal ? '' : 'p-4 w-64'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Font Size
          </label>
          <div className="flex space-x-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  fontSize === size
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Font Family
          </label>
          <div className="space-y-2">
            {[
              { key: 'sans', label: 'Sans Serif', icon: Type, preview: 'Aa' },
              { key: 'serif', label: 'Serif', icon: AlignLeft, preview: 'Aa' },
              { key: 'mono', label: 'Monospace', icon: Code, preview: 'Aa' },
            ].map(({ key, label, icon: Icon, preview }) => (
              <button
                key={key}
                onClick={() => handleFontFamilyChange(key as 'sans' | 'serif' | 'mono')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  fontFamily === key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </div>
                <span className={`text-lg ${
                  key === 'sans' ? 'font-sans' : key === 'serif' ? 'font-serif' : 'font-mono'
                }`}>
                  {preview}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isGlobal && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              These settings will apply to all new notes. Existing notes will keep their individual font settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}