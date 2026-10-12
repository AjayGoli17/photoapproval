import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/formatters';

export const Button = React.forwardRef(function Button({
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
}, ref) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-terracotta text-white hover:bg-terracotta-hover active:bg-terracotta-dark shadow-sm hover:shadow',
    secondary:
      'bg-ivory-200 text-charcoal hover:bg-ivory-300 border border-border/80 active:bg-ivory-300/80',
    outline:
      'border border-border text-charcoal-700 bg-surface hover:bg-ivory-100 hover:border-charcoal-300 hover:text-charcoal active:bg-ivory-200',
    ghost:
      'text-charcoal-600 hover:text-charcoal hover:bg-ivory-200/80 active:bg-ivory-300/60',
    destructive:
      'bg-rose text-white hover:bg-rose-hover active:bg-rose-dark shadow-sm hover:shadow',
    sage:
      'bg-sage text-white hover:bg-sage-hover active:bg-sage-dark shadow-sm hover:shadow',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 min-h-[28px]',
    sm: 'text-xs font-medium px-3 py-1.5 rounded-lg gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 rounded-xl gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 min-h-[44px]',
    icon: 'p-2 rounded-xl min-w-[40px] min-h-[40px] h-10 w-10',
    iconSm: 'p-1.5 rounded-lg min-w-[32px] min-h-[32px] h-8 w-8',
    iconXs: 'p-1 rounded-md min-w-[28px] min-h-[28px] h-7 w-7',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      onClick={onClick}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
});

export const IconButton = React.forwardRef(function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}, ref) {
  const iconSizes = size === 'sm' ? 'iconSm' : size === 'xs' ? 'iconXs' : 'icon';
  return (
    <Button
      ref={ref}
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
});

