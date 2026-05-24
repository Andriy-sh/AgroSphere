import { cn } from '../../utils/cn';
import { Company } from '../../mock/mock-companies';
import { CrownIcon } from '../icons';
import { CompanyAvatar } from './company-avatar';
import { cva } from 'class-variance-authority';

const companySelectorVariants = cva(
  'items-center rounded-md flex w-full transition-all duration-200 cursor-pointer gap-2',
  {
    variants: {
      variant: {
        dark: 'bg-basic-black hover:bg-gray-800',
        light: 'bg-white hover:bg-gray-100',
        green: 'bg-[#004E3A] hover:bg-[#003d2e]',
        'basic-white': 'bg-basic-white hover:bg-gray-50',
        'light-gray': 'bg-gray-200 hover:bg-gray-300',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  }
);

const companySelectorTextVariants = cva('material-symbols-outlined', {
  variants: {
    variant: {
      dark: 'text-basic-gray',
      light: 'text-basic-black text-base',
      green: 'text-white text-lg',
      'basic-white': 'text-basic-black text-base',
      'light-gray': 'text-gray-800 text-base',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

interface CompanyTriggerProps {
  company: Company;
  variant?: 'dark' | 'light' | 'green' | 'basic-white' | 'light-gray';
  isCollapsed: boolean;
  showChevron: boolean;
  disabled?: boolean;
  isOpen?: boolean;
  onClick: () => void;
}

export function CompanyTrigger({
  company,
  variant = 'dark',
  isCollapsed,
  showChevron,
  disabled = false,
  isOpen = false,
  onClick,
}: CompanyTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        companySelectorVariants({ variant }),
        isCollapsed ? 'p-1 justify-center' : 'justify-between',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        'items-center p-2'
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={`Select company: ${company.name}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <CompanyAvatar
          company={company}
          showCrown={isCollapsed}
          showTooltip={false}
        />

        {!isCollapsed && (
          <div className="flex flex-col min-w-0 gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-sm font-semibold overflow-hidden whitespace-nowrap block',
                  {
                    'text-white': variant === 'dark' || variant === 'green',
                    'text-basic-black':
                      variant === 'light' || variant === 'basic-white',
                    'text-gray-800': variant === 'light-gray',
                  }
                )}
                style={{ textOverflow: 'ellipsis' }}
              >
                {company.name}
              </span>
              <span className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                <CrownIcon className="w-3 h-3 rounded-full flex-none" />
              </span>
            </div>
            {company.roleDisplayName && (
              <span
                className={cn(
                  'text-xs overflow-hidden whitespace-nowrap block',
                  {
                    'text-gray-300': variant === 'dark' || variant === 'green',
                    'text-basic-gray':
                      variant === 'light' || variant === 'basic-white',
                    'text-gray-600': variant === 'light-gray',
                  }
                )}
                style={{ textOverflow: 'ellipsis' }}
              >
                {company.roleDisplayName}
              </span>
            )}
          </div>
        )}
      </div>

      {!isCollapsed && showChevron && (
        <span
          className={cn(
            companySelectorTextVariants({ variant }),
            'flex-shrink-0'
          )}
        >
          expand_all
        </span>
      )}
    </button>
  );
}
