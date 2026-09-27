import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-tight',
  {
    variants: {
      variant: {
        default: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
        secondary: 'border-zinc-700 bg-zinc-900 text-zinc-300',
        success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
        warning: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
        danger: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
        outline: 'border-zinc-700 bg-transparent text-zinc-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
