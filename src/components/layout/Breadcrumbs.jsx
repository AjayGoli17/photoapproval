import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function Breadcrumbs({
  items = [],
  showBack = false,
  backTo,
  backLabel = 'Back',
  className,
}) {
  if ((!items || items.length === 0) && !showBack) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-charcoal-400 select-none py-1', className)}>
      {showBack && backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-charcoal-500 hover:text-charcoal mr-3 pr-3 border-r border-border font-medium transition-colors"
          title={backLabel}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      )}

      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-charcoal transition-colors p-1 rounded-md hover:bg-ivory-200"
            aria-label="Studio Dashboard"
            title="Dashboard"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label || idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300 flex-shrink-0" aria-hidden="true" />
              {isLast || !item.to ? (
                <span
                  className="font-semibold text-charcoal-800 truncate max-w-[130px] sm:max-w-[240px]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-charcoal transition-colors truncate max-w-[100px] sm:max-w-[180px] p-0.5 rounded hover:bg-ivory-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
