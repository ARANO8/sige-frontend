'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Item {
  id: string;
  nombre: string;
  codigo?: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  items: Item[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
  required?: boolean;
}

export function SearchableSelect({
  label,
  placeholder = 'Buscar...',
  items,
  value,
  onChange,
  error,
  required,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = items.find((i) => i.id === value);

  const filtered = query
    ? items.filter((i) => {
        const q = query.toLowerCase();
        return i.nombre.toLowerCase().includes(q) || (i.codigo?.toLowerCase() ?? '').includes(q);
      })
    : items;

  const handleSelect = useCallback(
    (id: string) => {
      onChange(id);
      setOpen(false);
      setQuery('');
    },
    [onChange],
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown') { setOpen(true); e.preventDefault(); }
      return;
    }
    if (e.key === 'ArrowDown') {
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlighted((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filtered[highlighted]) handleSelect(filtered[highlighted].id);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setOpen(false);
      e.preventDefault();
    }
  };

  const displayText = selected ? `${selected.codigo ? selected.codigo + ' — ' : ''}${selected.nombre}` : '';

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
          {label}{required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => { setOpen(!open); setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }}
          className={`neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-on-surface font-body text-sm flex items-center justify-between cursor-pointer ${error ? 'ring-2 ring-error' : ''}`}
        >
          <span className={`truncate ${!selected ? 'text-outline/50' : ''}`}>
            {selected ? displayText : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface shadow-bento rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant/10">
              <Search className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                onKeyDown={handleKey}
                placeholder="Filtrar..."
                className="w-full bg-transparent border-none outline-none font-body text-sm text-on-surface placeholder:text-outline/50"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 font-body text-sm text-on-surface-variant">Sin resultados</li>
              ) : (
                filtered.map((item, i) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    role="option"
                    aria-selected={item.id === value}
                    className={`px-3 py-2 cursor-pointer font-body text-sm transition-colors ${
                      i === highlighted
                        ? 'bg-primary-container/10 text-primary'
                        : item.id === value
                          ? 'bg-primary-container/5 text-primary font-medium'
                          : 'text-on-surface hover:bg-surface-container-hover'
                    }`}
                  >
                    {item.codigo && <span className="font-label text-xs text-on-surface-variant mr-2">{item.codigo}</span>}
                    {item.nombre}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="font-label text-xs text-error">{error}</span>}
    </div>
  );
}
