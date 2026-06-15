import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();
  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:scale-105 transition">
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}