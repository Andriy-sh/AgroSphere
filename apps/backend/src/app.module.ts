import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './modules/clients/clients.module';
import { FarmsModule } from './modules/farms/farms.module';
import { ParcelsModule } from './modules/parcels/parcels.module';
import { ZonesModule } from './modules/zones/zones.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { OrganisationsModule } from './modules/organisations/organisations.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule,
    FarmsModule,
    ParcelsModule,
    ZonesModule,
    TasksModule,
    UsersModule,
    OrganisationsModule,
    TeamsModule,
    SettingsModule,
  ],
})
export class AppModule {}
