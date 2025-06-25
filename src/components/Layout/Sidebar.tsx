import { useState } from 'react';
import { StickyNote, Archive, Trash2, Settings, Info } from 'lucide-react';
import { FontSettings } from '../Notes/FontSettings';

interface SidebarProps {
  currentView: 'all' | 'archive' | 'trash';
  onViewChange: (view: 'all' | 'archive' | 'trash') => void;
  noteCounts: {
    all: number;
    archive: number;
    trash: number;
  };
  globalFontSize: 'small' | 'medium' | 'large';
  globalFontFamily: 'sans' | 'serif' | 'mono';
  onGlobalFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onGlobalFontFamilyChange: (family: 'sans' | 'serif' | 'mono') => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  noteCounts,
  globalFontSize,
  globalFontFamily,
  onGlobalFontSizeChange,
  onGlobalFontFamilyChange
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'font' | 'about'>('font');

  const menuItems = [
    {
      id: 'all' as const,
      label: 'Notes',
      icon: StickyNote,
      count: noteCounts.all,
    },
    {
      id: 'archive' as const,
      label: 'Archive',
      icon: Archive,
      count: noteCounts.archive,
    },
    {
      id: 'trash' as const,
      label: 'Trash',
      icon: Trash2,
      count: noteCounts.trash,
    },
  ];

  return (
    <aside className="w-72 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-r border-red-200 dark:border-red-900/50 h-full flex flex-col">
      <nav className="p-6 space-y-3 flex-1">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-800 shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-100 dark:bg-primary-800/50' 
                    : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                  }`} />
                </div>
                <span className="font-medium text-base">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  isActive
                    ? 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-red-200 dark:group-hover:bg-red-800 group-hover:text-red-800 dark:group-hover:text-red-200'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-red-200 dark:border-red-900/50 p-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 group ${
            showSettings
              ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-800 shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg transition-colors ${
              showSettings 
                ? 'bg-primary-100 dark:bg-primary-800/50' 
                : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30'
            }`}>
              <Settings className={`h-5 w-5 ${
                showSettings 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
              }`} />
            </div>
            <span className="font-medium text-base">Settings</span>
          </div>
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-700 shadow-lg animate-scale-in">
            {/* Settings Tabs */}
            <div className="flex border-b border-red-200 dark:border-red-700">
              <button
                onClick={() => setSettingsTab('font')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  settingsTab === 'font'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Font Settings
              </button>
              <button
                onClick={() => setSettingsTab('about')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  settingsTab === 'about'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                About
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-4">
              {settingsTab === 'font' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Global Font Settings
                  </h4>
                  <FontSettings
                    fontSize={globalFontSize}
                    fontFamily={globalFontFamily}
                    onFontSizeChange={onGlobalFontSizeChange}
                    onFontFamilyChange={onGlobalFontFamilyChange}
                    onClose={() => {}}
                    isGlobal={true}
                  />
                </div>
              )}

              {settingsTab === 'about' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl inline-block mb-3">
                      <StickyNote className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      NotesApp
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      A beautiful and functional notes taking application
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-red-100 dark:border-red-800">
                      <span className="text-gray-600 dark:text-gray-400">Version</span>
                      <span className="font-semibold text-gray-900 dark:text-white">v1.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-100 dark:border-red-800">
                      <span className="text-gray-600 dark:text-gray-400">Developer</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Akari</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400">Built with</span>
                      <span className="font-semibold text-gray-900 dark:text-white">React & TypeScript</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                        This app stores your notes locally in your browser. Your data is private and secure.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}