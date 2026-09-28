import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'bg-violet-600 text-white shadow-[0_3px_0_#4c1d95,0_8px_18px_rgb(76_29_149_/_0.24)] hover:-translate-y-px hover:bg-violet-500 hover:shadow-[0_4px_0_#4c1d95,0_11px_22px_rgb(76_29_149_/_0.3)] active:shadow-[0_1px_0_#4c1d95]',
        secondary: 'bg-zinc-800 text-zinc-100 shadow-[0_2px_0_rgb(39_39_42)] hover:-translate-y-px hover:bg-zinc-700 active:shadow-none',
        outline: 'border border-zinc-700 bg-transparent text-zinc-200 shadow-[0_2px_0_rgb(39_39_42)] hover:-translate-y-px hover:border-violet-500/60 hover:bg-zinc-900 active:shadow-none',
        ghost: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
        destructive: 'bg-rose-500 text-white hover:bg-rose-400',
      },
      size: {
        default: 'h-9 px-3.5',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
