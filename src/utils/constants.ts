import { NoteColor } from '../types';

export const NOTE_COLORS: Record<NoteColor, { bg: string; bgDark: string; border: string; borderDark: string }> = {
  default: {
    bg: 'bg-white',
    bgDark: 'dark:bg-gray-800',
    border: 'border-red-200',
    borderDark: 'dark:border-red-800'
  },
  red: {
    bg: 'bg-red-50',
    bgDark: 'dark:bg-red-900/20',
    border: 'border-red-300',
    borderDark: 'dark:border-red-700'
  },
  orange: {
    bg: 'bg-orange-50',
    bgDark: 'dark:bg-orange-900/20',
    border: 'border-orange-300',
    borderDark: 'dark:border-orange-700'
  },
  yellow: {
    bg: 'bg-yellow-50',
    bgDark: 'dark:bg-yellow-900/20',
    border: 'border-yellow-300',
    borderDark: 'dark:border-yellow-700'
  },
  green: {
    bg: 'bg-green-50',
    bgDark: 'dark:bg-green-900/20',
    border: 'border-green-300',
    borderDark: 'dark:border-green-700'
  },
  blue: {
    bg: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    border: 'border-blue-300',
    borderDark: 'dark:border-blue-700'
  },
  purple: {
    bg: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    border: 'border-purple-300',
    borderDark: 'dark:border-purple-700'
  },
  pink: {
    bg: 'bg-pink-50',
    bgDark: 'dark:bg-pink-900/20',
    border: 'border-pink-300',
    borderDark: 'dark:border-pink-700'
  }
};

export const DEFAULT_NOTE_COLOR: NoteColor = 'default';

export const FONT_SIZES = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg'
};

export const FONT_FAMILIES = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
};