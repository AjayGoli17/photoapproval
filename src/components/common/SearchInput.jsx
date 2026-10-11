import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function SearchInput({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  shortcutHint,
  className,
  autoFocus = false,
  ...props
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && value && onClear) {
      e.preventDefault();
      onClear();
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={props['aria-label'] || placeholder}
        className="w-full pl-9 pr-14 py-2 text-sm bg-surface border border-border rounded-xl text-charcoal placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta/25 focus:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/30 focus-visible:border-terracotta transition-colors shadow-subtle"
        {...props}
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="text-charcoal-400 hover:text-charcoal p-0.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : shortcutHint ? (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-charcoal-400 bg-ivory-200 border border-border rounded select-none">
            {shortcutHint}
          </kbd>
        ) : null}
      </div>
    </div>
  );
}
