import React from 'react';
import { cn } from '../../utils/formatters';

export function Card({
  children,
  className,
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface rounded-card border border-border shadow-subtle transition-all duration-200',
        hover && 'hover:shadow-elevated hover:border-charcoal-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  children,
}) {
  return (
    <div className={cn('p-5 border-b border-border/80 flex items-center justify-between gap-4', className)}>
      {children || (
        <>
          <div>
            {title && <h3 className="text-base font-semibold text-charcoal">{title}</h3>}
            {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('p-4 bg-ivory-50 border-t border-border/80 rounded-b-card flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5', className)}>
      <div>
        <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
        {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2.5 flex-shrink-0">{action}</div>}
    </div>
  );
}
