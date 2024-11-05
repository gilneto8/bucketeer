// components/ui/tabs.tsx
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/misc';

// Tabs root component variants
const tabsRootVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      cards: 'space-y-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// TabsList variants
const tabsListVariants = cva('inline-flex items-center justify-center rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', {
  variants: {
    variant: {
      default: '',
      cards: 'bg-transparent p-0 gap-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// TabsTrigger variants
const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        cards:
          'rounded-lg border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// TabsContent variants
const tabsContentVariants = cva(
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'mt-2',
        cards: 'mt-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Interface definitions
interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, VariantProps<typeof tabsRootVariants> {}

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, VariantProps<typeof tabsTriggerVariants> {}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>, VariantProps<typeof tabsContentVariants> {}

// Component implementations
const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn(tabsRootVariants({ variant }), className)} {...props} />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant }), className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant }), className)} {...props} />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={cn(tabsContentVariants({ variant }), className)} {...props} />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
