import React from 'react';
import { cn } from '../../utils/formatters';

export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-charcoal-700 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose ml-1">*</span>}
          </span>
        </label>
      )}
      {children}
      {error && <span className="text-xs text-rose font-medium mt-0.5">{error}</span>}
      {!error && helperText && (
        <span className="text-[11px] text-charcoal-500 mt-0.5">{helperText}</span>
      )}
    </div>
  );
}

export const inputBaseStyles =
  'w-full px-3.5 py-2 text-sm bg-surface border border-border rounded-xl text-charcoal placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta/25 focus:border-terracotta transition-colors disabled:bg-ivory-100 disabled:cursor-not-allowed';

export const FormInput = React.forwardRef(function FormInput(
  { className, error, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        inputBaseStyles,
        error && 'border-rose focus:ring-rose/25 focus:border-rose',
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
      className={cn(
        inputBaseStyles,
        'pr-8 appearance-none bg-no-repeat bg-[right_0.75rem_center]',
        error && 'border-rose focus:ring-rose/25 focus:border-rose',
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
      className={cn(
        inputBaseStyles,
        'resize-y',
        error && 'border-rose focus:ring-rose/25 focus:border-rose',
        className
      )}
      {...props}
    />
  );
});
