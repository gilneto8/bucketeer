import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/misc';

const sliderVariants = cva(
  'relative w-full inline-flex items-center justify-between rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        outline:
          'border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sliderVariants> {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChangeValue: (value: number) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, variant, size, min, max, step = 1, value, onChangeValue, ...props }, ref) => {
    const [sliderValue, setSliderValue] = React.useState(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setSliderValue(newValue);
      if (onChangeValue) {
        onChangeValue(newValue);
      }
    };

    return (
      <div
        className='relative flex flex-row w-full items-center space-x-3'
        ref={node => {
          if (ref) {
            if (typeof ref === 'function') ref(node);
            else ref.current = node;
          }
        }}
        {...props}
      >
        <div className='text-center text-sm font-bold'>More similar</div>
        <div className={cn(sliderVariants({ variant, size, className }))}>
          <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            onChange={handleInputChange}
            className='slider appearance-none h-2 bg-gray-300 rounded-lg cursor-pointer accent-gray-500 dark:accent-neutral-50 flex flex-grow'
          />
        </div>
        <div className='text-center text-sm font-bold'>Less similar</div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export { Slider };
