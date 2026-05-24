export interface Farm {
  id: string;
  name: string;
  owner: string;
  email: string;
  address: string;
  city: string;
  county: string;
  country: string;
  phone: string;
  farmType: 'dairy' | 'beef' | 'sheep' | 'poultry' | 'arable' | 'mixed';
  herdNo: string;
  size: number; 
  status: 'active' | 'inactive' | 'pending';
  assignedConsultant: string;
  tags: string[];
  avatar: string;
  initials: string;
  isOwn: boolean;
  subscription?: {
    planId: string;
    planName: string;
    price: string;
    period: string;
    startDate: string;
    status: 'active' | 'cancelled' | 'expired';
    canCancel: boolean;
  };
  assignedUsers: Array<{
    name: string;
    avatar: string;
    role: string;
  }>;
  comments: Array<{
    user: string;
    avatar: string;
    date: string;
    text: string;
  }>;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  tasks: number;
  lastActivity: string;
}

export const mockFarms: Farm[] = [
  {
    id: 'FARM-001',
    name: 'Green Valley Farm',
    owner: 'John Smith',
    email: 'john.smith@greenvalleyfarm.com',
    address: '123 Green Valley Road',
    city: 'Cork',
    county: 'Cork',
    country: 'Ireland',
    phone: '+353 86 111 1111',
    farmType: 'dairy',
    herdNo: 'A100001',
    size: 150,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Organic', 'Dairy', 'Premium'],
    avatar: '',
    initials: 'GV',
    isOwn: false,
    subscription: {
      planId: 'pro',
      planName: 'Pro',
      price: '$69',
      period: 'per month',
      startDate: '15.03.2024',
      status: 'active',
      canCancel: true,
    },
    assignedUsers: [
      { name: 'Theresa W.', avatar: '', role: 'Co-founder' },
      { name: 'Albert F.', avatar: '', role: 'Co-founder' },
      { name: 'Kristin W.', avatar: '', role: 'Billing Specialist' },
    ],
    comments: [
      {
        user: 'John Smith',
        avatar: '',
        date: '10/05/2025',
        text: 'Excellent results from the latest soil analysis. Planning to expand dairy operations.',
      },
      {
        user: 'Kristin W.',
        avatar: '',
        date: '10/04/2025',
        text: 'Farm upgraded to Pro plan and added 3 more fields for monitoring.',
      },
    ],
    coordinates: {
      longitude: -8.2439,
      latitude: 53.4129,
    },
    tasks: 12,
    lastActivity: '2025-01-15',
  },
  {
    id: 'FARM-002',
    name: 'Sunset Ranch',
    owner: 'Maria Garcia',
    email: 'maria.garcia@sunsetranch.com',
    address: '456 Sunset Boulevard',
    city: 'Dublin',
    county: 'Dublin',
    country: 'Ireland',
    phone: '+353 86 222 2222',
    farmType: 'beef',
    herdNo: 'A100002',
    size: 200,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Beef', 'Grass-fed', 'Sustainable'],
    avatar: '',
    initials: 'SR',
    isOwn: false,
    subscription: {
      planId: 'basic',
      planName: 'Basic',
      price: '$29',
      period: 'per month',
      startDate: '27.05.2024',
      status: 'active',
      canCancel: false,
    },
    assignedUsers: [
      { name: 'Theresa W.', avatar: '', role: 'Co-founder' },
      { name: 'Kristin W.', avatar: '', role: 'Billing Specialist' },
    ],
    comments: [
      {
        user: 'Maria Garcia',
        avatar: '',
        date: '10/05/2025',
        text: 'Very satisfied with the grass-fed beef monitoring system.',
      },
    ],
    coordinates: {
      longitude: -8.2449,
      latitude: 53.4139,
    },
    tasks: 8,
    lastActivity: '2025-01-14',
  },
  {
    id: 'FARM-003',
    name: 'Meadow Brook Farm',
    owner: 'David Wilson',
    email: 'david.wilson@meadowbrook.com',
    address: '789 Meadow Brook Lane',
    city: 'Galway',
    county: 'Galway',
    country: 'Ireland',
    phone: '+353 86 333 3333',
    farmType: 'mixed',
    herdNo: 'A100003',
    size: 300,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Mixed Farming', 'Regenerative', 'Multi-location'],
    avatar: '',
    initials: 'MB',
    isOwn: false,
    assignedUsers: [{ name: 'Theresa W.', avatar: '', role: 'Co-founder' }],
    comments: [
      {
        user: 'David Wilson',
        avatar: '',
        date: '10/05/2025',
        text: 'Interested in upgrading to a subscription plan for better monitoring.',
      },
    ],
    coordinates: {
      longitude: -8.2429,
      latitude: 53.4119,
    },
    tasks: 15,
    lastActivity: '2025-01-13',
  },
  {
    id: 'FARM-004',
    name: 'Oak Valley Farm',
    owner: 'Sarah Johnson',
    email: 'sarah.johnson@oakvalley.com',
    address: '321 Oak Valley Drive',
    city: 'Limerick',
    county: 'Limerick',
    country: 'Ireland',
    phone: '+353 86 444 4444',
    farmType: 'sheep',
    herdNo: 'A100004',
    size: 120,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Sheep', 'Wool Production', 'Lab Partner'],
    avatar: '',
    initials: 'OV',
    isOwn: false,
    subscription: {
      planId: 'pro',
      planName: 'Pro',
      price: '$69',
      period: 'per month',
      startDate: '10.01.2024',
      status: 'active',
      canCancel: true,
    },
    assignedUsers: [
      { name: 'Theresa W.', avatar: '', role: 'Co-founder' },
      { name: 'Kristin W.', avatar: '', role: 'Billing Specialist' },
    ],
    comments: [
      {
        user: 'Sarah Johnson',
        avatar: '',
        date: '10/05/2025',
        text: 'Pro plan features are excellent for wool quality monitoring.',
      },
    ],
    coordinates: {
      longitude: -8.2459,
      latitude: 53.4149,
    },
    tasks: 6,
    lastActivity: '2025-01-12',
  },
  {
    id: 'FARM-005',
    name: 'Golden Fields Farm',
    owner: 'Michael Brown',
    email: 'michael.brown@goldenfields.com',
    address: '654 Golden Fields Road',
    city: 'Waterford',
    county: 'Waterford',
    country: 'Ireland',
    phone: '+353 86 555 5555',
    farmType: 'arable',
    herdNo: 'A100005',
    size: 400,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Arable', 'Grain Production', 'Regenerative Farming'],
    avatar: '',
    initials: 'GF',
    isOwn: false,
    assignedUsers: [{ name: 'Theresa W.', avatar: '', role: 'Co-founder' }],
    comments: [
      {
        user: 'Michael Brown',
        avatar: '',
        date: '10/05/2025',
        text: 'Regenerative farming practices showing great results.',
      },
    ],
    coordinates: {
      longitude: -8.2469,
      latitude: 53.4159,
    },
    tasks: 20,
    lastActivity: '2025-01-11',
  },
  {
    id: 'FARM-006',
    name: 'Maple Ridge Farm',
    owner: 'Lisa Davis',
    email: 'lisa.davis@mapleridge.com',
    address: '987 Maple Ridge Avenue',
    city: 'Kilkenny',
    county: 'Kilkenny',
    country: 'Ireland',
    phone: '+353 86 666 6666',
    farmType: 'poultry',
    herdNo: 'A100006',
    size: 80,
    status: 'active',
    assignedConsultant: 'Kristin W.',
    tags: ['Poultry', 'Egg Production', 'Free-range'],
    avatar: '',
    initials: 'MR',
    isOwn: false,
    subscription: {
      planId: 'enterprise',
      planName: 'Enterprise',
      price: '$119',
      period: 'per month',
      startDate: '03.02.2024',
      status: 'active',
      canCancel: true,
    },
    assignedUsers: [
      { name: 'Theresa W.', avatar: '', role: 'Co-founder' },
      { name: 'Albert F.', avatar: '', role: 'Co-founder' },
      { name: 'Kristin W.', avatar: '', role: 'Billing Specialist' },
      { name: 'Cameron W.', avatar: '', role: 'Agronomist' },
    ],
    comments: [
      {
        user: 'Lisa Davis',
        avatar: '',
        date: '10/05/2025',
        text: 'Enterprise plan perfect for large-scale poultry operations.',
      },
      {
        user: 'Kristin W.',
        avatar: '',
        date: '10/04/2025',
        text: 'Client upgraded to Enterprise plan for advanced analytics.',
      },
    ],
    coordinates: {
      longitude: -8.2479,
      latitude: 53.4169,
    },
    tasks: 25,
    lastActivity: '2025-01-10',
  },
  {
    id: 'FARM-007',
    name: 'River Bend Farm',
    owner: 'Robert Taylor',
    email: 'robert.taylor@riverbend.com',
    address: '147 River Bend Lane',
    city: 'Wexford',
    county: 'Wexford',
    country: 'Ireland',
    phone: '+353 86 777 7777',
    farmType: 'dairy',
    herdNo: 'A100007',
    size: 180,
    status: 'inactive',
    assignedConsultant: 'Kristin W.',
    tags: ['Dairy', 'Seasonal'],
    avatar: '',
    initials: 'RB',
    isOwn: false,
    assignedUsers: [{ name: 'Theresa W.', avatar: '', role: 'Co-founder' }],
    comments: [
      {
        user: 'Robert Taylor',
        avatar: '',
        date: '10/05/2025',
        text: 'Seasonal operations completed. Will reactivate in spring.',
      },
    ],
    coordinates: {
      longitude: -8.2489,
      latitude: 53.4179,
    },
    tasks: 0,
    lastActivity: '2024-12-15',
  },
];

export const mockFarmFilterSections = [
  {
    title: 'Farm Type',
    icon: 'Tag',
    rows: [
      { checked: false, label: 'Dairy', badgeCount: 2 },
      { checked: false, label: 'Beef', badgeCount: 1 },
      { checked: false, label: 'Sheep', badgeCount: 1 },
      { checked: false, label: 'Poultry', badgeCount: 1 },
      { checked: false, label: 'Arable', badgeCount: 1 },
      { checked: false, label: 'Mixed', badgeCount: 1 },
    ],
  },
  {
    title: 'Tasks',
    icon: 'BarChart',
    rows: [
      { checked: false, label: '0-5', badgeCount: 1 },
      { checked: false, label: '6-10', badgeCount: 2 },
      { checked: false, label: '11-15', badgeCount: 2 },
      { checked: false, label: '16+', badgeCount: 2 },
    ],
  },
  {
    title: 'Status',
    icon: 'Activity',
    rows: [
      { checked: false, label: 'Active', badgeCount: 6 },
      { checked: false, label: 'Inactive', badgeCount: 1 },
      { checked: false, label: 'Pending', badgeCount: 0 },
    ],
  },
  {
    title: 'Assigned consultant',
    icon: 'Users',
    rows: [{ checked: false, label: 'Kristin W.', badgeCount: 7 }],
  },
  {
    title: 'Tags',
    icon: 'Tag',
    rows: [
      { checked: false, label: 'Organic', badgeCount: 1 },
      { checked: false, label: 'Regenerative', badgeCount: 2 },
      { checked: false, label: 'Lab Partner', badgeCount: 1 },
      { checked: false, label: 'Free-range', badgeCount: 1 },
    ],
  },
];
