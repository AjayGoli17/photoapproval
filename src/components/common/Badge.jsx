import React from 'react';
import { cn } from '../../utils/formatters';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}) {
  const variants = {
    default: 'bg-ivory-200 text-charcoal-700 border-border',
    terracotta: 'bg-terracotta-light text-terracotta-dark border-terracotta-border',
    sage: 'bg-sage-light text-sage-dark border-sage-border',
    amber: 'bg-amber-light text-amber-dark border-amber-border',
    rose: 'bg-rose-light text-rose-dark border-rose-border',
    charcoal: 'bg-charcoal-100 text-charcoal-800 border-charcoal-200',
  };

  const dotColors = {
    default: 'bg-charcoal-400',
    terracotta: 'bg-terracotta',
    sage: 'bg-sage',
    amber: 'bg-amber',
    rose: 'bg-rose',
    charcoal: 'bg-charcoal',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };

  // Auto-detect variant based on common status strings if variant not explicitly provided or default
  let resolvedVariant = variant;
  if (variant === 'default' && typeof children === 'string') {
    const statusLower = children.toLowerCase();
    if (['active', 'confirmed', 'paid', 'completed', 'settled', 'delivered'].includes(statusLower)) {
      resolvedVariant = 'sage';
    } else if (['in progress', 'editing', 'shooting', 'culling', 'in production'].includes(statusLower)) {
      resolvedVariant = 'terracotta';
    } else if (['pending', 'planning', 'ready for delivery', 'draft', 'inquiry'].includes(statusLower)) {
      resolvedVariant = 'amber';
    } else if (['overdue', 'cancelled', 'urgent', 'unpaid'].includes(statusLower)) {
      resolvedVariant = 'rose';
    } else if (['archived', 'closed'].includes(statusLower)) {
      resolvedVariant = 'charcoal';
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-pill border select-none leading-none tracking-normal',
        variants[resolvedVariant] || variants.default,
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            dotColors[resolvedVariant] || dotColors.default
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  const map = {
    Low: { label: 'Low', variant: 'default' },
    Medium: { label: 'Medium', variant: 'amber' },
    High: { label: 'High', variant: 'terracotta' },
    Urgent: { label: 'Urgent', variant: 'rose' },
  };

  const config = map[priority] || map.Medium;

  return (
    <Badge variant={config.variant} dot size="sm" className={className}>
      {config.label}
    </Badge>
  );
}
