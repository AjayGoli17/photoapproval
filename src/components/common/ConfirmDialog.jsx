import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) {
  const cancelBtnRef = React.useRef(null);
  const titleId = React.useId();
  const descId = React.useId();
  const hasConfirmedRef = React.useRef(false);

  React.useEffect(() => {
    if (isOpen) {
      hasConfirmedRef.current = false;
    }
  }, [isOpen]);

  const handleConfirm = (e) => {
    if (isLoading || hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;
    onConfirm?.(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      role="alertdialog"
      initialFocusRef={cancelBtnRef}
      ariaLabel={title}
    >
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? 'bg-rose-light text-rose' : 'bg-amber-light text-amber'
          }`}
          aria-hidden="true"
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id={titleId} className="text-lg font-semibold text-charcoal">{title}</h3>
        <p id={descId} className="text-sm text-charcoal-500 mt-2 mb-6 max-w-sm leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full justify-end">
          <Button
            ref={cancelBtnRef}
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
