import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-terracotta text-white hover:bg-terracotta-hover active:bg-terracotta-dark shadow-sm',
    secondary: 'bg-ivory-200 text-charcoal hover:bg-ivory-300 border border-border/60',
    outline: 'border border-border text-charcoal-700 bg-surface hover:bg-ivory-100 hover:border-charcoal-300',
    ghost: 'text-charcoal-600 hover:text-charcoal hover:bg-ivory-200/80',
    destructive: 'bg-rose text-white hover:bg-rose-hover active:bg-rose-dark shadow-sm',
    sage: 'bg-sage text-white hover:bg-sage-hover active:bg-sage-dark shadow-sm',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 h-7',
    sm: 'text-xs font-medium px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-sm px-4 py-2 rounded-xl gap-2 h-10',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 h-12',
    icon: 'p-2 rounded-xl h-10 w-10',
    iconSm: 'p-1.5 rounded-lg h-8 w-8',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}) {
  const iconSizes = size === 'sm' ? 'iconSm' : 'icon';
  return (
    <Button
      variant={variant}
      size={iconSizes}
      aria-label={label}
      title={label}
      className={className}
      {...props}
    >
      {icon}
    </Button>
  );
}
