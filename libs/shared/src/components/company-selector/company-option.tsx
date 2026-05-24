import { cn } from '../../utils/cn';
import { Company } from '../../mock/mock-companies';
import { CompanyAvatar } from './company-avatar';
import { cva } from 'class-variance-authority';

const companyOptionVariants = cva(
  'items-center rounded-md flex justify-between w-full transition-all duration-200 cursor-pointer gap-2 p-2',
  {
    variants: {
      variant: {
        light: 'bg-white hover:bg-gray-50',
      },
      selected: {
        true: 'bg-green-50 border border-green-200',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'light',
      selected: false,
    },
  }
);

interface CompanyOptionProps {
  company: Company;
  isSelected: boolean;
  onClick: () => void;
}

export function CompanyOption({
  company,
  isSelected,
  onClick,
}: CompanyOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        companyOptionVariants({
          variant: 'light',
          selected: isSelected,
        })
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-selected={isSelected}
      role="option"
    >
      <div className="flex flex-row gap-2 min-w-0 flex-1 relative items-center">
        <CompanyAvatar
          company={company}
          showCrown={isSelected}
          showTooltip={false}
        />

        <div className="flex flex-col min-w-0">
          <span
            className="text-sm font-semibold overflow-hidden whitespace-nowrap block text-basic-black"
            style={{ textOverflow: 'ellipsis' }}
          >
            {company.name}
          </span>
          {company.roleDisplayName && (
            <span
              className="text-xs overflow-hidden whitespace-nowrap block mt-0.5 text-basic-gray"
              style={{ textOverflow: 'ellipsis' }}
            >
              {company.roleDisplayName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

