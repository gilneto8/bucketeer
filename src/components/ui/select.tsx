import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/misc';
import { RalColor } from '@/utils/color';
import { CircleX } from 'lucide-react';
import { Button } from './button';

const selectVariants = cva(
  'relative inline-flex items-center justify-between rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
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

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof selectVariants> {
  options: RalColor[];
  onChangeOption: (rc: RalColor) => void;
  value?: RalColor;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, variant, size, value, onChangeOption, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<RalColor | null>(null);
    const [searchTerm, setSearchTerm] = React.useState(''); // State to hold the search term

    // Filtered options based on the search term
    const filteredOptions = options.filter(option => `${option.id} - ${option.name}`.toLowerCase().includes(searchTerm.toLowerCase()));

    // Update selectedOption whenever value changes
    React.useEffect(() => {
      setSelectedOption(value ?? null);
    }, [value]);

    // Create a ref for the select component
    const selectRef = React.useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
      setIsOpen(prev => !prev);
    };

    const handleOptionClick = (option: RalColor) => {
      setSelectedOption(option);
      setIsOpen(false);
      if (onChangeOption) onChangeOption(option);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Effect to handle click outside
    React.useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Clear search input
    const clearSearch = () => {
      setSearchTerm('');
    };

    return (
      <div
        className='relative inline-block w-full'
        ref={node => {
          selectRef.current = node;
          if (ref) {
            if (typeof ref === 'function') ref(node);
            else ref.current = node;
          }
        }}
        {...props}
      >
        <div
          className={cn(selectVariants({ variant, size, className }))}
          onClick={toggleDropdown}
          aria-haspopup='true'
          aria-expanded={isOpen}
        >
          {selectedOption ? (
            <div className='flex flex-row items-center'>
              {selectedOption.id} - {selectedOption.name}
              <div className='ml-3 w-4 h-4 rounded-full' style={{ backgroundColor: selectedOption.hex }}></div>
            </div>
          ) : value ? (
            <div className='flex flex-row items-center'>
              {value.id} - {value.name}
              <div className='ml-3 w-4 h-4 rounded-full' style={{ backgroundColor: value.hex }}></div>
            </div>
          ) : (
            'Select an option'
          )}
        </div>
        {isOpen && (
          <div className='absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg overflow-y-scroll h-64'>
            {/* Search input with clear button */}
            <div className='relative p-2'>
              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-500'
              />
              {searchTerm && (
                <Button
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700'
                  variant='ghost'
                  size='icon'
                  onClick={clearSearch}
                >
                  <CircleX className='h-4 w-4' />
                </Button>
              )}
            </div>

            {/* Render filtered options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.id}
                  className='flex p-2 hover:bg-gray-200 cursor-pointer text-sm font-medium items-center'
                  onClick={() => handleOptionClick(option)}
                >
                  {option.id} - {option.name}
                  <div className='ml-3 w-4 h-4 rounded-full' style={{ backgroundColor: option.hex }}></div>
                </div>
              ))
            ) : (
              <div className='p-2 text-sm text-neutral-500'>No options found</div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
