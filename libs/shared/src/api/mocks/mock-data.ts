import { MOCK_USER_ROLES } from './mock-user-roles';

// Mock Tasks
export const MOCK_TASKS = {
  data: [
    {
      id: '1',
      title: 'Soil preparation',
      description: 'Prepare soil samples from designated locations to assess soil composition.',
      type: 'field_work',
      status: 'completed',
      priority: 'high',
      assignee: {
        id: 'user-1',
        name: 'John',
        surname: 'Doe',
        avatar: 'https://api.example.com/avatars/john.jpg'
      },
      farm_id: 'farm-1',
      parcel_id: 'parcel-1',
      created_at: '2026-04-01',
      updated_at: '2026-05-01',
      due_date: '2026-05-10',
      completed_at: '2026-05-01'
    },
    {
      id: '2',
      title: 'Pesticide spraying',
      description: 'Apply pesticide treatment to control pest population.',
      type: 'treatment',
      status: 'in_progress',
      priority: 'high',
      assignee: {
        id: 'user-2',
        name: 'Jane',
        surname: 'Smith',
        avatar: 'https://api.example.com/avatars/jane.jpg'
      },
      farm_id: 'farm-1',
      parcel_id: 'parcel-2',
      created_at: '2026-04-20',
      updated_at: '2026-05-02',
      due_date: '2026-05-15'
    },
    {
      id: '3',
      title: 'Drainage inspection',
      description: 'Inspect and maintain drainage system.',
      type: 'maintenance',
      status: 'pending',
      priority: 'medium',
      assignee: {
        id: 'user-3',
        name: 'Bob',
        surname: 'Johnson',
        avatar: 'https://api.example.com/avatars/bob.jpg'
      },
      farm_id: 'farm-2',
      parcel_id: 'parcel-3',
      created_at: '2026-04-25',
      updated_at: '2026-05-03',
      due_date: '2026-05-18'
    },
    {
      id: '4',
      title: 'Soil sampling',
      description: 'Collect soil samples from designated locations to assess soil composition.',
      type: 'field_work',
      status: 'completed',
      priority: 'medium',
      assignee: {
        id: 'user-1',
        name: 'John',
        surname: 'Doe',
        avatar: 'https://api.example.com/avatars/john.jpg'
      },
      farm_id: 'farm-1',
      parcel_id: 'parcel-1',
      created_at: '2026-04-05',
      updated_at: '2026-04-28',
      due_date: '2026-05-05',
      completed_at: '2026-04-28'
    }
  ]
};

// Mock Clients
export const MOCK_CLIENTS = {
  data: [
    {
      id: 'client-1',
      name: 'Fresh Produce Co',
      email: 'contact@freshproduce.com',
      phone: '+1-234-567-8900',
      address: '100 Farm Lane, Agriculture City, AC 12345',
      type: 'buyer',
      status: 'active',
      created_at: '2026-01-15'
    },
    {
      id: 'client-2',
      name: 'Organic Distributors LLC',
      email: 'info@organicdist.com',
      phone: '+1-555-123-4567',
      address: '200 Distribution Ave, Trade City, TC 54321',
      type: 'distributor',
      status: 'active',
      created_at: '2026-02-10'
    },
    {
      id: 'client-3',
      name: 'Regional Grocery Chain',
      email: 'procurement@regionalgrocery.com',
      phone: '+1-666-789-0123',
      address: '300 Retail Road, Commerce Town, CT 67890',
      type: 'retailer',
      status: 'active',
      created_at: '2026-03-05'
    },
    {
      id: 'client-4',
      name: 'Artisan Food Markets',
      email: 'sourcing@artisanfoods.com',
      phone: '+1-777-456-7890',
      address: '400 Market Street, Downtown, DT 11223',
      type: 'buyer',
      status: 'inactive',
      created_at: '2026-01-20'
    }
  ]
};

// Mock Team Users
export const MOCK_TEAM_USERS = {
  data: [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'farm_owner',
      status: 'active',
      tenant_id: 'tenant-1',
      created_at: '2026-01-01'
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'farm_manager',
      status: 'active',
      tenant_id: 'tenant-1',
      created_at: '2026-01-15'
    },
    {
      id: 'user-3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'field_worker',
      status: 'active',
      tenant_id: 'tenant-1',
      created_at: '2026-02-01'
    },
    {
      id: 'user-4',
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'field_worker',
      status: 'pending',
      tenant_id: 'tenant-1',
      created_at: '2026-04-15'
    }
  ]
};

// Mock Farms
export const MOCK_FARMS = {
  data: [
    {
      id: 'farm-1',
      tenant_id: 'tenant-1',
      name: 'Green Valley Farm',
      location: 'Countryside Region',
      size: 250,
      size_unit: 'hectares',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      created_at: '2026-01-10',
      updated_at: '2026-05-03'
    },
    {
      id: 'farm-2',
      tenant_id: 'tenant-1',
      name: 'Sunset Hills Orchard',
      location: 'Valley Region',
      size: 150,
      size_unit: 'hectares',
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851
      },
      created_at: '2026-02-05',
      updated_at: '2026-05-03'
    }
  ]
};

// Mock Parcels
export const MOCK_PARCELS = {
  data: [
    {
      id: 'parcel-1',
      farm_id: 'farm-1',
      name: 'North Field A',
      size: 50,
      size_unit: 'hectares',
      crop_type: 'wheat',
      status: 'active',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      created_at: '2026-01-15',
      updated_at: '2026-05-03'
    },
    {
      id: 'parcel-2',
      farm_id: 'farm-1',
      name: 'East Field B',
      size: 40,
      size_unit: 'hectares',
      crop_type: 'corn',
      status: 'active',
      coordinates: {
        latitude: 40.7150,
        longitude: -74.0080
      },
      created_at: '2026-01-20',
      updated_at: '2026-05-03'
    },
    {
      id: 'parcel-3',
      farm_id: 'farm-2',
      name: 'Apple Grove',
      size: 30,
      size_unit: 'hectares',
      crop_type: 'apples',
      status: 'active',
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851
      },
      created_at: '2026-02-10',
      updated_at: '2026-05-03'
    }
  ]
};

// Mock Zones (Sample Zones in Parcels)
export const MOCK_ZONES = {
  data: [
    {
      id: 'zone-1',
      parcel_id: 'parcel-1',
      farm_id: 'farm-1',
      name: 'Zone A1',
      type: 'sample_zone',
      size: 10,
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      created_at: '2026-01-25',
      updated_at: '2026-05-03'
    },
    {
      id: 'zone-2',
      parcel_id: 'parcel-1',
      farm_id: 'farm-1',
      name: 'Zone A2',
      type: 'sample_zone',
      size: 12,
      coordinates: {
        latitude: 40.7140,
        longitude: -74.0070
      },
      created_at: '2026-01-28',
      updated_at: '2026-05-03'
    },
    {
      id: 'zone-3',
      parcel_id: 'parcel-2',
      farm_id: 'farm-1',
      name: 'Zone B1',
      type: 'sample_zone',
      size: 8,
      coordinates: {
        latitude: 40.7150,
        longitude: -74.0080
      },
      created_at: '2026-02-01',
      updated_at: '2026-05-03'
    }
  ]
};

// Export all mocks together
export const ALL_MOCK_DATA = {
  userRoles: MOCK_USER_ROLES,
  tasks: MOCK_TASKS,
  clients: MOCK_CLIENTS,
  teamUsers: MOCK_TEAM_USERS,
  farms: MOCK_FARMS,
  parcels: MOCK_PARCELS,
  zones: MOCK_ZONES
};
