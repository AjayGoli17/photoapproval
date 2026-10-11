import React from 'react';
import { cn } from '../../utils/formatters';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-border bg-surface shadow-subtle">
      <table className={cn('w-full text-left border-collapse text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn('bg-ivory-50 border-b border-border text-xs uppercase tracking-wider text-charcoal-500 font-medium', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return <tbody className={cn('divide-y divide-border/60', className)}>{children}</tbody>;
}

export function TableRow({ children, className, hover = true, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors',
        hover && 'hover:bg-ivory-50/80',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return <th className={cn('px-5 py-3.5 font-semibold text-charcoal-600', className)}>{children}</th>;
}

export function TableCell({ children, className }) {
  return <td className={cn('px-5 py-4 text-charcoal-800 align-middle', className)}>{children}</td>;
}
