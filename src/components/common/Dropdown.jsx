import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../../utils/formatters';

export function Dropdown({
  trigger,
  children,
  items = [],
  align = 'right', // 'right' | 'left'
  className,
  menuClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownId = useId();

  // Close on outside click and Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        const triggerBtn = containerRef.current?.querySelector('button');
        triggerBtn?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      {React.isValidElement(trigger) ? (
        React.cloneElement(trigger, {
          onClick: (e) => {
            trigger.props.onClick?.(e);
            toggleDropdown();
          },
          'aria-haspopup': 'menu',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? dropdownId : undefined,
        })
      ) : (
        <button
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dropdownId : undefined}
          className="focus:outline-none"
        >
          {trigger}
        </button>
      )}

      {isOpen && (
        <div
          id={dropdownId}
          ref={menuRef}
          role="menu"
          className={cn(
            'absolute mt-2 min-w-[12rem] bg-surface rounded-xl border border-border shadow-modal py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 focus:outline-none max-w-[90vw]',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          {children ? (
            typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children
          ) : (
            items.map((item, idx) => {
              if (item.divider) {
                return <div key={`divider-${idx}`} className="my-1 border-t border-border/80" />;
              }

              const Icon = item.icon;
              return (
                <button
                  key={item.label || idx}
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors',
                    item.variant === 'destructive'
                      ? 'text-rose hover:bg-rose-light/50 active:bg-rose-light'
                      : 'text-charcoal-700 hover:text-charcoal hover:bg-ivory-100 active:bg-ivory-200',
                    item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        item.variant === 'destructive' ? 'text-rose' : 'text-charcoal-500'
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && <span className="ml-auto text-[10px]">{item.badge}</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
