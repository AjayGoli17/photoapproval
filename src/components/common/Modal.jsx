import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

// Module-level active modal counter so nested modals do not prematurely unlock body scroll
let activeModalCount = 0;
let originalBodyOverflow = '';

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (activeModalCount === 0) {
    originalBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }
  activeModalCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
  }
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Stack to track active modal hierarchy so nested dialogs only intercept Escape when topmost
const modalStack = [];

function registerModal(id) {
  modalStack.push(id);
}

function unregisterModal(id) {
  const index = modalStack.indexOf(id);
  if (index !== -1) {
    modalStack.splice(index, 1);
  }
}

function isTopModal(id) {
  return modalStack.length > 0 && modalStack[modalStack.length - 1] === id;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className,
  role = 'dialog',
  ariaLabel,
  initialFocusRef,
}) {
  const dialogId = useId();
  const titleId = `modal-title-${dialogId}`;
  const descId = `modal-desc-${dialogId}`;
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Manage body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  // Manage Focus Trap and Focus Restoration
  useEffect(() => {
    if (!isOpen) return;

    registerModal(dialogId);

    // Save current active element
    previouslyFocusedElementRef.current = document.activeElement;

    // Set initial focus inside dialog
    const focusTimer = setTimeout(() => {
      if (!modalRef.current) return;

      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current.focus();
      }
    }, 20);

    const handleKeyDown = (e) => {
      if (!modalRef.current) return;

      if (e.key === 'Escape') {
        if (!isTopModal(dialogId)) return;
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!isTopModal(dialogId)) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unregisterModal(dialogId);
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        setTimeout(() => {
          previouslyFocusedElementRef.current?.focus();
        }, 10);
      }
    };
  }, [isOpen, onClose, initialFocusRef, dialogId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descId : undefined}
        aria-label={!title && ariaLabel ? ariaLabel : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-surface rounded-card border border-border shadow-modal z-10 overflow-hidden transform transition-all my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col animate-in fade-in zoom-in-95 duration-150 outline-none',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border/80 flex items-start justify-between gap-4 shrink-0">
            <div>
              {title && (
                <h3 id={titleId} className="text-base sm:text-lg font-semibold text-charcoal">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p id={descId} className="text-xs text-charcoal-500 mt-0.5 sm:mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-charcoal-400 hover:text-charcoal p-1.5 rounded-lg hover:bg-ivory-200 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
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
  role = 'dialog',
  ariaLabel,
  initialFocusRef,
}) {
  const drawerId = useId();
  const titleId = `drawer-title-${drawerId}`;
  const descId = `drawer-desc-${drawerId}`;
  const drawerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    registerModal(drawerId);
    previouslyFocusedElementRef.current = document.activeElement;

    const focusTimer = setTimeout(() => {
      if (!drawerRef.current) return;
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
        return;
      }
      const focusableElements = drawerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        drawerRef.current.focus();
      }
    }, 20);

    const handleKeyDown = (e) => {
      if (!drawerRef.current) return;
      if (e.key === 'Escape') {
        if (!isTopModal(drawerId)) return;
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (!isTopModal(drawerId)) return;
        const focusables = Array.from(
          drawerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unregisterModal(drawerId);
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);

      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        setTimeout(() => {
          previouslyFocusedElementRef.current?.focus();
        }, 10);
      }
    };
  }, [isOpen, onClose, initialFocusRef, drawerId]);

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
        ref={drawerRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descId : undefined}
        aria-label={!title && ariaLabel ? ariaLabel : undefined}
        tabIndex={-1}
        className={cn(
          'fixed w-full max-w-[90vw] bg-surface shadow-modal z-10 flex flex-col border-l border-border transition-transform ease-in-out duration-300 outline-none',
          positionStyles[position],
          maxWidth,
          className
        )}
      >
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            {title && (
              <h3 id={titleId} className="text-base sm:text-lg font-semibold text-charcoal">
                {title}
              </h3>
            )}
            {subtitle && (
              <p id={descId} className="text-xs text-charcoal-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal p-1.5 rounded-lg hover:bg-ivory-200 transition-colors shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
