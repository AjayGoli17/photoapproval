import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-surface rounded-card border border-border shadow-modal z-10 overflow-hidden transform transition-all my-8 animate-in fade-in zoom-in-95 duration-150',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="px-6 py-5 border-b border-border/80 flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-semibold text-charcoal">{title}</h3>}
              {subtitle && <p className="text-xs text-charcoal-500 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-charcoal-400 hover:text-charcoal p-1.5 rounded-lg hover:bg-ivory-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  maxWidth = 'max-w-md',
  className,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionStyles = {
    right: 'right-0 inset-y-0 h-full',
    left: 'left-0 inset-y-0 h-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed w-full bg-surface shadow-modal z-10 flex flex-col border-l border-border transition-transform ease-in-out duration-300',
          positionStyles[position],
          maxWidth,
          className
        )}
      >
        <div className="px-6 py-5 border-b border-border/80 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-charcoal">{title}</h3>}
            {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal p-1.5 rounded-lg hover:bg-ivory-200 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
