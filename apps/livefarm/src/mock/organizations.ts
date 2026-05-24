export interface Organization {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
}

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'GreenMark',
    initials: 'GH',
    email: 'alma.lawson@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'AgroNova Group',
    initials: 'AN',
    email: 'alma.lawson@example.com',
    role: 'Advisor',
  },
  {
    id: '3',
    name: 'FieldNest',
    initials: 'FN',
    email: 'jackson.graham@example.com',
    role: 'Viewer',
  },
  {
    id: '4',
    name: 'FieldNest',
    initials: 'FN',
    email: 'jackson.graham@example.com',
    role: 'Viewer',
  },
  {
    id: '5',
    name: 'FieldNest',
    initials: 'FN',
    email: 'jackson.graham@example.com',
    role: 'Viewer',
  },
  {
    id: '6',
    name: 'FieldNest',
    initials: 'FN',
    email: 'jackson.graham@example.com',
    role: 'Viewer',
  },
];
