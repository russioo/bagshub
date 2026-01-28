import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 text-gray-300',
        brand: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
        gain: 'bg-gain/10 text-gain border border-gain/20',
        loss: 'bg-loss/10 text-loss border border-loss/20',
        outline: 'border border-gray-700 text-gray-400',
        meme: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        ai: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        gaming: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
        defi: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
