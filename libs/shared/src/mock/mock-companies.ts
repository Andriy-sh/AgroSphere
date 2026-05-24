export interface Company {
  id: string;
  name: string;
  initials: string;
  isOwn: boolean;
  hasCrown: boolean;
  roleDisplayName?: string;
  avatarSrc?: string;
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'GreenMark',
    initials: 'GM',
    isOwn: true,
    hasCrown: true,
  },
  {
    id: '2',
    name: 'AgroNova Group',
    initials: 'AN',
    isOwn: false,
    hasCrown: false,
  },
  {
    id: '3',
    name: 'FieldNest',
    initials: 'FN',
    isOwn: false,
    hasCrown: false,
  },
];
