import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card border border-dashed border-border/80 bg-surface/50 my-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-ivory-200 text-terracotta flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      <p className="text-sm text-charcoal-500 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
