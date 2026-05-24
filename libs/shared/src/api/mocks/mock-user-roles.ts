import { UserRolesResponse } from '../services/users/user-types';

export const MOCK_USER_ROLES: UserRolesResponse = {
  data: [
    {
      tenant: {
        id: 'tenant-1',
        name: 'Green Valley Farm',
        type: 'farmer',
        email: 'info@greenvalley.farm',
        telephone: '+1-234-567-8900',
        address: '123 Farm Road, Countryside, ST 12345',
      },
      role: {
        id: 'role-1',
        name: 'farm_owner',
        displayName: 'Farm Owner',
        permissions: ['manage_farm', 'view_reports', 'manage_users'],
      },
      status: 'active',
    },
    {
      tenant: {
        id: 'tenant-2',
        name: 'AgriTech Solutions',
        type: 'advisor',
        email: 'support@agritech.com',
        telephone: '+1-987-654-3210',
        address: '456 Tech Avenue, Tech City, TC 54321',
      },
      role: {
        id: 'role-2',
        name: 'advisor',
        displayName: 'Advisor',
        permissions: ['view_reports', 'provide_recommendations'],
      },
      status: 'active',
    },
    {
      tenant: {
        id: 'tenant-3',
        name: 'Sunrise Organic Farms',
        type: 'farmer',
        email: 'admin@sunriseorganic.farm',
        telephone: '+1-555-123-4567',
        address: '789 Organic Lane, Nature Village, NV 98765',
      },
      role: {
        id: 'role-3',
        name: 'farm_manager',
        displayName: 'Farm Manager',
        permissions: ['manage_operations', 'view_reports', 'manage_staff'],
      },
      status: 'active',
    },
    {
      tenant: {
        id: 'tenant-4',
        name: 'ProLab Analysis',
        type: 'lab',
        email: 'results@prolab.com',
        telephone: '+1-666-789-0123',
        address: '321 Lab Street, Science Park, SP 11111',
      },
      role: {
        id: 'role-4',
        name: 'lab_technician',
        displayName: 'Lab Technician',
        permissions: ['upload_results', 'view_analyses'],
      },
      status: 'active',
    },
  ],
};
