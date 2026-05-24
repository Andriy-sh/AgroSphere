import { useMemo } from 'react';
import { Company } from '../../mock/mock-companies';
import { SelectOption } from '../select/select';

export interface UseCompanySelectorOptions {
  companies: Company[];
  value: Company | null;
  onValueChange: (company: Company) => void;
}

export function useCompanySelector({
  companies,
  value,
  onValueChange,
}: UseCompanySelectorOptions) {
  const companiesMap = useMemo(
    () => new Map(companies.map((c) => [c.id, c])),
    [companies]
  );

  const options: SelectOption[] = useMemo(
    () =>
      companies.map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies]
  );

  const handleValueChange = (id: string) => {
    const company = companiesMap.get(id);
    if (company) {
      onValueChange(company);
    }
  };

  return {
    options,
    selectedValue: value?.id ?? '',
    handleValueChange,
    companiesMap,
  };
}

