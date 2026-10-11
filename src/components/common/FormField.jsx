import React, { useId } from 'react';
import { cn } from '../../utils/formatters';

export function FormField({
  id,
  label,
  error,
  helperText,
  required = false,
  children,
  className,
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-xs font-semibold text-charcoal-700 flex items-center justify-between"
        >
          <span>
            {label}
            {required && (
              <span className="text-rose ml-1 select-none" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {required && <span className="sr-only">(required)</span>}
        </label>
      )}

      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id: children.props.id || fieldId,
            'aria-invalid': error ? 'true' : children.props['aria-invalid'],
            'aria-describedby':
              [describedBy, children.props['aria-describedby']]
                .filter(Boolean)
                .join(' ') || undefined,
            error: children.props.error || error,
          })
        : children}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-xs text-rose font-medium mt-0.5 animate-in fade-in-50 duration-150"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span id={helperId} className="text-[11px] text-charcoal-500 mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
}

export const inputBaseStyles =
  'w-full px-3.5 py-2 text-sm bg-surface border border-border rounded-xl text-charcoal placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta/25 focus:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/30 focus-visible:border-terracotta transition-colors disabled:bg-ivory-100 disabled:cursor-not-allowed';

export const FormInput = React.forwardRef(function FormInput(
  { className, error, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={error ? 'true' : props['aria-invalid']}
      className={cn(
        inputBaseStyles,
        error && 'border-rose focus:ring-rose/25 focus:border-rose focus-visible:ring-rose/30',
        className
      )}
      {...props}
    />
  );
});

export const FormSelect = React.forwardRef(function FormSelect(
  { className, error, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      aria-invalid={error ? 'true' : props['aria-invalid']}
      className={cn(
        inputBaseStyles,
        'pr-8 appearance-none bg-no-repeat bg-[right_0.75rem_center]',
        error && 'border-rose focus:ring-rose/25 focus:border-rose focus-visible:ring-rose/30',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export const FormTextarea = React.forwardRef(function FormTextarea(
  { className, error, rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={error ? 'true' : props['aria-invalid']}
      className={cn(
        inputBaseStyles,
        'resize-y',
        error && 'border-rose focus:ring-rose/25 focus:border-rose focus-visible:ring-rose/30',
        className
      )}
      {...props}
    />
  );
});
