'use client';
import { CustomSelect } from '../select/select';
import { Company } from '../../mock/mock-companies';
import { CompanyTrigger } from './company-trigger';
import { CompanyOption } from './company-option';
import { useCompanySelector } from './use-company-selector';

export type CompanySelectorVariant =
  | 'dark'
  | 'light'
  | 'green'
  | 'basic-white'
  | 'light-gray';

interface CompanySelectorProps {
  companies: Company[];
  value: Company | null;
  onChange: (company: Company) => void;
  variant?: CompanySelectorVariant;
  collapsed?: boolean;
  showChevron?: boolean;
  disabled?: boolean;
}

export function CompanySelector({
  companies,
  value,
  onChange,
  variant = 'dark',
  collapsed = false,
  showChevron = false,
  disabled = false,
}: CompanySelectorProps) {
  const { options, selectedValue, handleValueChange, companiesMap } =
    useCompanySelector({
      companies,
      value,
      onValueChange: onChange,
    });

  if (!value || companies.length === 0) {
    return null;
  }

  return (
    <CustomSelect
      options={options}
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      className="w-full p-2"
      renderTrigger={({ isOpen, onClick }) => (
        <CompanyTrigger
          company={value}
          variant={variant}
          isCollapsed={collapsed}
          showChevron={showChevron}
          disabled={disabled}
          isOpen={isOpen}
          onClick={onClick}
        />
      )}
      renderPopup={({
        options: selectOptions,
        value: currentValue,
        onValueChange,
        close,
      }) => (
        <div
          className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto min-w-[200px] max-w-[300px] p-2"
          role="listbox"
        >
          {selectOptions.map((option) => {
            const company = companiesMap.get(option.value);
            if (!company) return null;

            const isSelected = currentValue === option.value;

            return (
              <CompanyOption
                key={option.value}
                company={company}
                isSelected={isSelected}
                onClick={() => {
                  onValueChange?.(option.value);
                  close();
                }}
              />
            );
          })}
        </div>
      )}
    />
  );
}
