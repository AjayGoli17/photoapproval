import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  action,
  onDismiss,
  className,
}) {
  const variantStyles = {
    info: 'bg-ivory-100 border-border text-charcoal',
    success: 'bg-sage-light/60 border-sage-border text-charcoal',
    warning: 'bg-amber-light/70 border-amber-border text-charcoal',
    error: 'bg-rose-light/60 border-rose-border text-charcoal',
  };

  const iconStyles = {
    info: 'text-terracotta',
    success: 'text-sage-dark',
    warning: 'text-amber-dark',
    error: 'text-rose',
  };

  const defaultIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const IconComponent = icon || defaultIcons[variant] || defaultIcons.info;

  return (
    <div
      role="alert"
      className={cn(
        'p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 transition-colors',
        variantStyles[variant] || variantStyles.info,
        className
      )}
    >
      <div className={cn('shrink-0 mt-0.5', iconStyles[variant] || iconStyles.info)}>
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-xs sm:text-sm font-semibold text-charcoal leading-snug">
            {title}
          </h4>
        )}
        {children && (
          <div className={cn('text-xs text-charcoal-600 leading-relaxed', title && 'mt-1')}>
            {children}
          </div>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 text-charcoal-400 hover:text-charcoal rounded-lg hover:bg-ivory-200/60 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
