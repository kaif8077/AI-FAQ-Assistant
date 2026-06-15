import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, value: externalValue }) {
  const [value, setValue] = useState(externalValue || '');
  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search conversations..." className="w-full pl-10 pr-10 py-2 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800" />
      {value && <button onClick={() => setValue('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4" /></button>}
    </div>
  );
}