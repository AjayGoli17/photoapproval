import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/formatters';

export function LoadingState({ message = 'Loading studio data...', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      <div className="w-10 h-10 rounded-full bg-terracotta-light flex items-center justify-center text-terracotta mb-3">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-sm font-medium text-charcoal-600">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-card border border-rose-border bg-rose-light/40 my-4', className)}>
      <div className="w-12 h-12 rounded-full bg-rose-light text-rose flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      <p className="text-sm text-charcoal-600 mt-1 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse bg-ivory-200/90 rounded-lg', className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('p-5 rounded-card border border-border bg-surface space-y-4 animate-pulse', className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-16 rounded-pill" />
      </div>
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2 border-t border-border/60 flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 4, className }) {
  return (
    <div className={cn('w-full rounded-card border border-border bg-surface p-4 space-y-3 animate-pulse', className)}>
      <div className="flex gap-4 pb-3 border-b border-border/80">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-border/40 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
