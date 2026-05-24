'use client';
import { useMemo, useCallback } from 'react';
import { mockCompanies, type Company } from '../mock/mock-companies';

/**
 * Mock version of useTenant hook for Storybook
 * Returns mock companies data without requiring React Query
 */
export function useTenant() {
  const companies: Company[] = useMemo(() => mockCompanies, []);

  const selectedCompany = useMemo(() => companies[0] || null, [companies]);

  const handleCompanyChange = useCallback(async (company: Company) => {
    console.log('Mock: Company changed to', company.name);
    // In Storybook, we just log the change
  }, []);

  return {
    companies,
    selectedCompany,
    handleCompanyChange,
    loading: false,
  };
}
