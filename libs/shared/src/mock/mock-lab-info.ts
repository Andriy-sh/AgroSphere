export interface LabInfo {
  labNumber: string;
  sentDate: string;
  receivedDate: string;
  status:
    | 'received'
    | 'pending'
    | 'testing'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  labName?: string;
  clientName?: string;
  farmName?: string;
  samplesCount?: number;
  type?: 'Soil' | 'Grass' | 'Silage' | 'Feed' | 'Water' | 'Slurry';
}

const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getRandomLabNumber = (): string => {
  const prefix = 'LF';
  const number = Math.floor(Math.random() * 999999) + 1;
  return `${prefix}-${number.toString().padStart(6, '0')}`;
};

const getRandomType = ():
  | 'Soil'
  | 'Grass'
  | 'Silage'
  | 'Feed'
  | 'Water'
  | 'Slurry' => {
  const types: ('Soil' | 'Grass' | 'Silage' | 'Feed' | 'Water' | 'Slurry')[] = [
    'Soil',
    'Grass',
    'Silage',
    'Feed',
    'Water',
    'Slurry',
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const getRandomStatus = ():
  | 'received'
  | 'pending'
  | 'testing'
  | 'in_progress'
  | 'completed'
  | 'cancelled' => {
  const statuses: (
    | 'received'
    | 'pending'
    | 'testing'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
  )[] = [
    'received',
    'pending',
    'testing',
    'in_progress',
    'completed',
    'cancelled',
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const mockLabInfoData: LabInfo[] = [
  {
    labNumber: 'LF-001234',
    sentDate: '2024-07-26',
    receivedDate: '2024-07-28',
    status: 'received',
    labName: 'AgriTech Laboratories',
    clientName: 'John Smith',
    farmName: 'Green Valley Farm',
    samplesCount: 15,
    type: 'Soil',
  },
  {
    labNumber: 'LF-002345',
    sentDate: '2024-07-25',
    receivedDate: '2024-07-27',
    status: 'testing',
    labName: 'BioScience Research',
    clientName: 'Sarah Johnson',
    farmName: 'Sunset Meadows',
    samplesCount: 8,
    type: 'Grass',
  },
  {
    labNumber: 'LF-003456',
    sentDate: '2024-07-24',
    receivedDate: '2024-07-26',
    status: 'completed',
    labName: 'FarmLab Solutions',
    clientName: 'Michael Brown',
    farmName: 'Oak Ridge Ranch',
    samplesCount: 12,
    type: 'Silage',
  },
  {
    labNumber: 'LF-004567',
    sentDate: '2024-07-23',
    receivedDate: '2024-07-25',
    status: 'in_progress',
    labName: 'CropTech Analysis',
    clientName: 'Emily Davis',
    farmName: 'River View Farm',
    samplesCount: 20,
    type: 'Feed',
  },
  {
    labNumber: 'LF-005678',
    sentDate: '2024-07-22',
    receivedDate: '2024-07-24',
    status: 'pending',
    labName: 'Soil Quality Lab',
    clientName: 'David Wilson',
    farmName: 'Highland Farm',
    samplesCount: 10,
    type: 'Water',
  },
  {
    labNumber: 'LF-006789',
    sentDate: '2024-07-21',
    receivedDate: '2024-07-23',
    status: 'cancelled',
    labName: 'Environmental Testing',
    clientName: 'Lisa Anderson',
    farmName: 'Meadow Brook Farm',
    samplesCount: 6,
    type: 'Slurry',
  },
];

export const getLabInfoById = (id: string): LabInfo | undefined => {
  return mockLabInfoData.find((lab) => lab.labNumber === id);
};

export const getAllLabInfo = (): LabInfo[] => {
  return mockLabInfoData;
};

export const getLabInfoByStatus = (status: LabInfo['status']): LabInfo[] => {
  return mockLabInfoData.filter((lab) => lab.status === status);
};

export const searchLabInfoByNumber = (searchTerm: string): LabInfo[] => {
  return mockLabInfoData.filter((lab) =>
    lab.labNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
