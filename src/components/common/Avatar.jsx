import React, { useState } from 'react';
import { cn } from '../../utils/formatters';

export function Avatar({
  src,
  name = '',
  size = 'md',
  status,
  className,
}) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-medium',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-semibold',
  };

  const getInitials = (text) => {
    if (!text) return '?';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center border border-border select-none bg-ivory-200 text-charcoal-700',
          sizes[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status === 'Active' && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-sage rounded-full ring-2 ring-surface"
          title="Active"
        />
      )}
    </div>
  );
}

export function TeamAvatarGroup({ members = [], max = 4, size = 'sm', className }) {
  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className={cn('flex items-center -space-x-2 overflow-hidden', className)}>
      {visible.map((m, idx) => (
        <Avatar
          key={m.id || idx}
          src={m.avatar}
          name={m.name}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-ivory-300 text-charcoal-700 flex items-center justify-center font-medium text-xs ring-2 ring-surface',
            size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
