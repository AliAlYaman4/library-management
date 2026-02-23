import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base: specific transition props (cheaper than transition-all), expo-out easing,
  // will-change for GPU promotion, press-down on :active
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium',
    'will-change-transform',
    'transition-[transform,box-shadow,background-color,border-color,color,opacity]',
    'duration-150 ease-smooth',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // Press: squish down, cancel any hover lift, reduce shadow
    'active:scale-[0.97] active:translate-y-0',
  ].join(' '),
  {
    variants: {
      variant: {
        // Lift + brand-colored glow on hover
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:-translate-y-px hover:shadow-glow-primary',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:-translate-y-px hover:shadow-glow-destructive',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90 hover:-translate-y-px hover:shadow-glow-success',
        warning:
          'bg-warning text-warning-foreground shadow-xs hover:bg-warning/90 hover:-translate-y-px',
        // Flat variants — no lift, just color change
        outline:
          'border border-input bg-card hover:bg-accent hover:text-accent-foreground hover:border-primary/25',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-6',
        xl: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
