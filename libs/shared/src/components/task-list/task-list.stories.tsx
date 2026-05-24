import { TaskList } from './task-list';
import type { Meta, StoryObj } from '@storybook/react';
import { TaskDetails } from '../../types/task';
import {
  TaskData,
  TasksListResponse,
} from '../../api/services/tasks/task-types';

const meta: Meta<typeof TaskList> = {
  title: 'Components/TaskList',
  component: TaskList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskList>;

const mockTasks: TaskDetails[] = [
  {
    id: '1',
    organisation_name: 'Farm Co',
    organisation_id: 1,
    assigned_to_organisation: 1,
    farmer_name: 'Soil sampling',
    assigned_to: 1,
    task_creator: 1,
    farmer_organisation_id: 1,
    farms:
      'Collect soil samples from designated locations to assess soil composition...',
    lab: 'Lab A',
    no_of_samples: 10,
    farmer_address: '123 Farm St',
    soil_sampler: 'J',
    farmteam_task_number: '120',
    id_number: 120,
    task_has_not_started_test: false,
    task_has_unmatched_samples: false,
    task_has_tests_without_lab_result: false,
    date: 'June 16',
    complete_by: null,
    status: 'pending',
    tests: [],
    created_by: 1,
    issues_approve_by: null,
    reporting_status: null,
    combine_task_report: 0,
    combine_soil_analysis_report: 0,
    advisor: 'John Doe',
    task_type: 'Soil Analysis',
  },
  {
    id: '2',
    organisation_name: 'Farm Co',
    organisation_id: 1,
    assigned_to_organisation: 1,
    farmer_name: 'Soil sampling',
    assigned_to: 1,
    task_creator: 1,
    farmer_organisation_id: 1,
    farms:
      'Collect soil samples from designated locations to assess soil composition...',
    lab: 'Lab B',
    no_of_samples: 15,
    farmer_address: '456 Farm Ave',
    soil_sampler: 'Diana Mills',
    farmteam_task_number: '121',
    id_number: 121,
    task_has_not_started_test: false,
    task_has_unmatched_samples: false,
    task_has_tests_without_lab_result: false,
    date: 'June 15',
    complete_by: null,
    status: 'pending',
    tests: [],
    created_by: 1,
    issues_approve_by: null,
    reporting_status: null,
    combine_task_report: 0,
    combine_soil_analysis_report: 0,
    advisor: 'Jane Smith',
    task_type: 'Soil Analysis',
  },
  {
    id: '3',
    organisation_name: 'Farm Co',
    organisation_id: 1,
    assigned_to_organisation: 1,
    farmer_name: 'Soil sampling',
    assigned_to: 1,
    task_creator: 1,
    farmer_organisation_id: 1,
    farms:
      'Collect soil samples from designated locations to assess soil composition...',
    lab: 'Lab C',
    no_of_samples: 20,
    farmer_address: '789 Farm Rd',
    soil_sampler: 'K',
    farmteam_task_number: '123',
    id_number: 123,
    task_has_not_started_test: false,
    task_has_unmatched_samples: false,
    task_has_tests_without_lab_result: false,
    date: 'June 10',
    complete_by: null,
    status: 'in_progress',
    tests: [],
    created_by: 1,
    issues_approve_by: null,
    reporting_status: null,
    combine_task_report: 0,
    combine_soil_analysis_report: 0,
    advisor: 'Bob Wilson',
    task_type: 'Soil Analysis',
  },
];

// Mock data based on the new API response structure
const mockApiTasks: TaskData[] = [
  {
    id: 'UkLWZg9DAJ',
    task_type: 'soil_sampling',
    client: {
      id: 'gbHJdmfrXB',
      name: 'Demo Farm Ltd',
    },
    status: 'completed',
    assigned_to_organisation: {
      id: 'EfhxLZ9ck8',
      name: 'Soil Sampling Services',
      email: 'olen.collins@example.org',
      type: 'contractor',
    },
    created_date: '27-08-2025',
    reporting: 'pending',
    created_by: {
      id: 'AXs1igzRC6',
      first_name: 'LiveFarm',
      last_name: 'Administrator',
      email: '@agrosphere-admin@@agrosphere.ie',
    },
    task_number: 'S-1025-1',
    task_status: 'completed',
    issues: [],
    priority: 'high',
    active_date: '21-09-2025',
    complete_by: null,
    advisor: 'LiveFarm Advisory Services',
  },
  {
    id: 'XkLWZg9DAK',
    task_type: 'grass_sampling',
    client: {
      id: 'gbHJdmfrXC',
      name: 'Green Pastures Farm',
    },
    status: 'in_progress',
    assigned_to_organisation: {
      id: 'EfhxLZ9ck9',
      name: 'Grass Analysis Lab',
      email: 'grass.lab@example.org',
      type: 'laboratory',
    },
    created_date: '28-08-2025',
    reporting: 'in_progress',
    created_by: {
      id: 'AXs1igzRC7',
      first_name: 'John',
      last_name: 'Farmer',
      email: 'john.farmer@example.org',
    },
    task_number: 'G-1025-2',
    task_status: 'in_progress',
    issues: ['Sample collection delayed'],
    priority: 'medium',
    active_date: '22-09-2025',
    complete_by: '30-09-2025',
    advisor: 'Agricultural Consultants Ltd',
  },
  {
    id: 'YkLWZg9DAL',
    task_type: 'water_testing',
    client: {
      id: 'gbHJdmfrXD',
      name: 'River Valley Farm',
    },
    status: 'not_started',
    assigned_to_organisation: {
      id: 'EfhxLZ9ckA',
      name: 'Water Quality Services',
      email: 'water.testing@example.org',
      type: 'specialist',
    },
    created_date: '29-08-2025',
    reporting: 'not_started',
    created_by: {
      id: 'AXs1igzRC8',
      first_name: 'Sarah',
      last_name: 'Manager',
      email: 'sarah.manager@example.org',
    },
    task_number: 'W-1025-3',
    task_status: 'not_started',
    issues: [],
    priority: 'low',
    active_date: '25-09-2025',
    complete_by: '05-10-2025',
    advisor: 'Environmental Services',
  },
];

const mockApiResponse: TasksListResponse = {
  data: mockApiTasks,
  links: {
    first: 'http://localhost:8000/api/tasks?page=1',
    last: 'http://localhost:8000/api/tasks?page=3',
    prev: null,
    next: 'http://localhost:8000/api/tasks?page=2',
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 3,
    links: [
      {
        url: 'http://localhost:8000/api/tasks?page=1',
        label: '1',
        active: true,
      },
      {
        url: 'http://localhost:8000/api/tasks?page=2',
        label: '2',
        active: false,
      },
      {
        url: 'http://localhost:8000/api/tasks?page=3',
        label: '3',
        active: false,
      },
    ],
    path: 'http://localhost:8000/api/tasks',
    per_page: 10,
    to: 3,
    total: 25,
  },
  search: null,
  paginate: 'http://localhost:8000/api/tasks?per_page=10',
  statuses: {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    rejected: 'Rejected',
    collected: 'Collected',
    cancelled: 'Cancelled',
    lab: 'Lab',
    complete: 'Complete',
  },
};

export const Default: Story = {
  args: {
    tasks: mockTasks,
  },
};

export const WithActions: Story = {
  args: {
    tasks: mockTasks,
    showActions: true,
    onAcceptTask: (task) => console.log('Accept task:', task.id),
    onDeclineTask: (task) => console.log('Decline task:', task.id),
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
  },
};

export const SingleTask: Story = {
  args: {
    tasks: [mockTasks[0]],
    showActions: true,
  },
};
