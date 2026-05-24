import { consultantOptions } from '@/constants/overview/constants';

export function findConsultantOption(
  consultantName: string | undefined | null
) {
  if (!consultantName || consultantName.trim() === '') {
    return undefined;
  }

  const exactMatch = consultantOptions.find(
    (option) => option.label === consultantName
  );

  if (exactMatch) return exactMatch;

  return consultantOptions.find(
    (option) =>
      option.label.toLowerCase().includes(consultantName.toLowerCase()) ||
      consultantName.toLowerCase().includes(option.label.toLowerCase())
  );
}

export function getConsultantValue(
  consultantName: string | undefined | null
): string {
  const option = findConsultantOption(consultantName);
  return option?.value || '';
}
