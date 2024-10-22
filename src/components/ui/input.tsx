import * as React from 'react';
import { cn } from '@/utils/misc';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, suffix, ...props }, ref) => {
  return (
    <div className='relative'>
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
          type === 'number' ? 'hide-number-input-arrows' : '',
          suffix ? 'pr-8' : '',
          className,
        )}
        ref={ref}
        {...props}
      />
      {suffix && <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>{suffix}</span>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
