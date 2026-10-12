import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/formatters';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize,
  onPageChange,
  className,
}) {
  if (totalPages <= 1 && !totalItems) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80 select-none text-xs text-charcoal-500',
        className
      )}
      aria-label="Pagination Navigation"
    >
      <div>
        {startItem && endItem ? (
          <span>
            Showing <span className="font-semibold text-charcoal">{startItem}</span> to{' '}
            <span className="font-semibold text-charcoal">{endItem}</span> of{' '}
            <span className="font-semibold text-charcoal">{totalItems}</span> records
          </span>
        ) : totalItems ? (
          <span>
            Total <span className="font-semibold text-charcoal">{totalItems}</span> records
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-charcoal">{currentPage}</span> of{' '}
            <span className="font-semibold text-charcoal">{totalPages}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="min-h-[32px] px-2.5"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-1.5 text-charcoal-400">
                  …
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
                  isCurrent
                    ? 'bg-terracotta text-white font-semibold shadow-xs'
                    : 'text-charcoal-700 hover:bg-ivory-200'
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="min-h-[32px] px-2.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
