import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/misc';

// Define the Badge styles with CVA
const badgeVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-50',
        success: 'bg-green-100 text-emerald-500 dark:bg-green-900 dark:text-green-50',
        error: 'bg-red-100 text-red-500 dark:bg-red-500 dark:text-red-50',
        warning: 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-50',
      },
      size: {
        default: 'px-2.5 py-0.5',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Define Badge props, extending HTML span element props
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

// Create the Badge component with forwardRef
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span';
  return <Comp className={cn(badgeVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
