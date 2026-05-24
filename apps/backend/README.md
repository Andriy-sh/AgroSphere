# AgroSphere Backend API

This is the NestJS backend API for the AgroSphere application.

## Features

- **Clients Management** - Manage client information and details
- **Farms Management** - Create and manage farms with locations
- **Parcels Management** - Manage farm parcels with boundaries and zones
- **Zones Management** - Create and manage zones within parcels
- **Tasks Management** - Create and manage tasks with status tracking
- **Users Management** - User roles and permissions
- **Organisations** - Organisation management
- **Teams** - Team management and user invitations
- **Settings** - Application settings and subscriptions

## API Endpoints

### Clients
- `GET /clients` - Get all clients
- `GET /clients/:id` - Get client details
- `POST /clients/create` - Create a new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Farms
- `GET /farms` - Get all farms
- `GET /farms/:id` - Get farm details
- `POST /farms/create` - Create a new farm
- `PUT /farms/:id` - Update farm
- `DELETE /farms/:id` - Delete farm

### Parcels
- `POST /farms/:farmId/parcels` - Create parcel
- `GET /farms/:farmId/parcels/:parcelId` - Get parcel
- `PUT /farms/:farmId/parcels/:parcelId` - Update parcel
- `DELETE /farms/:farmId/parcels/:parcelId` - Delete parcel

### Zones
- `POST /farms/:farmId/parcels/:parcelId/zones` - Create zone
- `DELETE /farms/:farmId/parcels/:parcelId/zones/:zoneId` - Delete zone

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task details
- `GET /tasks/per-status` - Get task status counts
- `POST /tasks/create` - Create task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id` - Patch task
- `DELETE /tasks/:id` - Delete task

### Users
- `GET /users/roles` - Get user roles

### Organisations
- `POST /organisations` - Create organisation

### Teams
- `GET /teams/users` - Get team users
- `GET /teams/invitations` - Get pending invitations
- `POST /teams/users/invite` - Invite users
- `PUT /teams/users/:userId/activate` - Activate user
- `PUT /teams/users/:userId/deactivate` - Deactivate user

### Settings
- `GET /settings/subscriptions` - Get subscriptions
- `POST /settings/subscriptions/create-intent` - Create payment intent

## Installation

```bash
npm install
```

## Database Setup

```bash
# Create .env file with DATABASE_URL
cp .env.example .env

# Run migrations
npx prisma migrate dev
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Building

```bash
npm run build
```

## Author

AgroSphere Team
