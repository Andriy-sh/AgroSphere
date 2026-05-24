export interface Connection {
  id: string;
  name: string;
  email: string;
  status: 'awaiting' | 'active' | 'invited' | 'inactive' | 'declined';
  dateAdded: string;
}

export const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Boyer Inc',
    email: 'deanna.curtis@example.com',
    status: 'awaiting',
    dateAdded: 'July 1, 2025',
  },
  {
    id: '2',
    name: 'Demo LLC',
    email: 'deanna.curtis@example.com',
    status: 'awaiting',
    dateAdded: 'June 20, 2025',
  },
  {
    id: '3',
    name: 'Boyer Inc',
    email: 'deanna.curtis@example.com',
    status: 'active',
    dateAdded: 'May 15, 2025',
  },
  {
    id: '4',
    name: 'Blackberry Advisors',
    email: 'deanna.curtis@example.com',
    status: 'invited',
    dateAdded: 'June 28, 2025',
  },
  {
    id: '5',
    name: 'Connelly LLC',
    email: 'deanna.curtis@example.com',
    status: 'active',
    dateAdded: 'February 7, 2025',
  },
  {
    id: '6',
    name: 'Corwin-Prosacco',
    email: 'deanna.curtis@example.com',
    status: 'active',
    dateAdded: 'November 3, 2024',
  },
  {
    id: '7',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '8',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '9',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '10',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '11',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '12',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '13',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
  {
    id: '14',
    name: 'Demo',
    email: 'deanna.curtis@example.com',
    status: 'inactive',
    dateAdded: 'September 21, 2024',
  },
];
