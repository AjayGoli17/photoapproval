import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupee format (e.g. ₹1,50,000)
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date string nicely for studio editorial feel
 */
export function formatDate(dateString, formatStr = 'MMM d, yyyy') {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (err) {
    return dateString;
  }
}

/**
 * Compact shoot date / range, always on one line.
 * "2026-12-14","2026-12-16" -> "14–16 Dec 2026"
 * "2026-11-30","2026-12-02" -> "30 Nov – 2 Dec 2026"
 * "2026-11-05","2026-11-05" -> "5 Nov 2026"
 */
export function formatDateRange(startStr, endStr) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parse = (str) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str || '');
    return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
  };
  const a = parse(startStr);
  if (!a) return startStr || '—';
  const b = parse(endStr);
  if (!b || (a.y === b.y && a.m === b.m && a.d === b.d)) return `${a.d} ${MONTHS[a.m]} ${a.y}`;
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`;
  return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

/**
 * Relative time or human readable time
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}
