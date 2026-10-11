import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function Breadcrumbs({ items = [], className }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-charcoal-400', className)}>
      <ol className="flex items-center space-x-1.5">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-charcoal transition-colors p-0.5 rounded"
            title="Dashboard"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label || idx} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
              {isLast || !item.to ? (
                <span className="font-medium text-charcoal-700 truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-charcoal transition-colors truncate max-w-[150px]"
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

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  className,
}) {
  return (
    <div className={cn('mb-6 sm:mb-8', className)}>
      {breadcrumbs && <div className="mb-2.5">{breadcrumbs}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
              {title}
            </h1>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm text-charcoal-500 mt-1.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">{actions}</div>}
      </div>
    </div>
  );
}
