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
    <div className={cn('flex flex-col items-center justify-center p-10 text-center rounded-card border border-rose-border bg-rose-light/40 my-4', className)}>
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
