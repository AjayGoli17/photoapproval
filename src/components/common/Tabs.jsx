import React, { useRef } from 'react';
import { cn } from '../../utils/formatters';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills', // 'pills' | 'underline'
  className,
  size = 'md',
}) {
  const tabListRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = tabs[newIndex];
    if (nextTab && !nextTab.disabled) {
      onChange(nextTab.key || nextTab.id);
      const buttons = tabListRef.current?.querySelectorAll('button[role="tab"]');
      if (buttons && buttons[newIndex]) {
        buttons[newIndex].focus();
      }
    }
  };

  const sizes = {
    sm: 'text-xs py-1.5 px-3 min-h-[32px]',
    md: 'text-sm py-2 px-3.5 min-h-[36px]',
    lg: 'text-sm sm:text-base py-2.5 px-4 min-h-[42px]',
  };

  return (
    <div className={cn('w-full overflow-x-auto custom-scrollbar', className)}>
      <div
        ref={tabListRef}
        role="tablist"
        className={cn(
          'flex items-center gap-1 min-w-max',
          variant === 'pills'
            ? 'bg-ivory-200/70 p-1 rounded-xl border border-border/80'
            : 'border-b border-border gap-2 sm:gap-6 pb-px'
        )}
      >
        {tabs.map((tab, idx) => {
          const key = tab.key || tab.id;
          const isActive = activeTab === key;
          const Icon = tab.icon;

          return (
            <button
              key={key}
              role="tab"
              type="button"
              id={`tab-${key}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${key}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'inline-flex items-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 select-none',
                sizes[size],
                variant === 'pills' && [
                  isActive
                    ? 'bg-surface text-charcoal shadow-xs font-semibold'
                    : 'text-charcoal-500 hover:text-charcoal hover:bg-surface/50',
                ],
                variant === 'underline' && [
                  'rounded-none border-b-2 -mb-px px-2 sm:px-3',
                  isActive
                    ? 'border-terracotta text-terracotta font-semibold'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal hover:border-charcoal-300',
                ],
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? (variant === 'underline' ? 'text-terracotta' : 'text-charcoal') : 'text-charcoal-400'
                  )}
                  aria-hidden="true"
                />
              )}
              <span>{tab.label || tab.title}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1 text-[11px] px-1.5 py-0.2 rounded-pill font-medium transition-colors',
                    isActive
                      ? 'bg-terracotta/10 text-terracotta font-semibold'
                      : 'bg-ivory-300/80 text-charcoal-500'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
