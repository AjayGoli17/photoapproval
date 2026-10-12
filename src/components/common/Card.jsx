import React from 'react';
import { cn } from '../../utils/formatters';

export function Card({
  children,
  className,
  hover = false,
  onClick,
  ...props
}) {
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
    props.onKeyDown?.(e);
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : props.onKeyDown}
      role={onClick ? 'button' : props.role}
      tabIndex={onClick ? (props.tabIndex ?? 0) : props.tabIndex}
      className={cn(
        'bg-surface rounded-card border border-border shadow-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
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
    <div className={cn('p-4 sm:p-5 border-b border-border/80 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap', className)}>
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

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  trendLabel,
  badge,
  onClick,
  className,
}) {
  const iconVariants = {
    default: 'bg-ivory-200 text-charcoal',
    terracotta: 'bg-terracotta-light text-terracotta',
    sage: 'bg-sage-light text-sage',
    amber: 'bg-amber-light text-amber',
    rose: 'bg-rose-light text-rose',
  };

  const borderHoverVariants = {
    default: 'hover:border-charcoal-300',
    terracotta: 'hover:border-terracotta/50',
    sage: 'hover:border-sage/50',
    amber: 'hover:border-amber/50',
    rose: 'hover:border-rose/50',
  };

  return (
    <Card
      hover={Boolean(onClick)}
      onClick={onClick}
      className={cn(
        'p-4 sm:p-5 flex flex-col justify-between transition-all group',
        onClick && borderHoverVariants[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-charcoal-500 truncate">
          {title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {Icon && (
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                iconVariants[variant] || iconVariants.default,
                onClick && 'group-hover:scale-105'
              )}
              aria-hidden="true"
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight font-serif leading-none">
          {value}
        </div>
        {(subtitle || trendLabel) && (
          <div className="text-xs text-charcoal-500 mt-1.5 flex items-center gap-1.5 leading-snug">
            {trend && (
              <span
                className={cn(
                  'font-medium text-[11px] px-1.5 py-0.2 rounded',
                  trend === 'up' && 'text-sage-dark bg-sage-light',
                  trend === 'down' && 'text-rose-dark bg-rose-light',
                  trend === 'neutral' && 'text-charcoal-600 bg-ivory-200'
                )}
              >
                {trendLabel}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
