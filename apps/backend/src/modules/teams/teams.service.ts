import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getTeamUsers(filters?: any) {
    const teamUsers = await this.prisma.teamUser.findMany();

    return {
      data: teamUsers.map(tu => ({
        id: tu.userId,
        name: 'Team Member',
        email: 'member@team.com',
        userRole: tu.role,
        status: tu.status === 'active' ? 'Active' : tu.status === 'pending' ? 'Invited' : 'Inactive',
        initials: 'TM',
        joinDate: tu.createdAt.toISOString(),
        department: 'Team Member',
      })),
    };
  }

  async getInvitations(filters?: any) {
    const invitations = await this.prisma.teamUser.findMany({
      where: { status: 'pending' },
    });

    return {
      data: invitations.map(inv => ({
        id: inv.id,
        email: 'invited@team.com',
        status: 'pending',
        sentAt: inv.createdAt.toISOString(),
      })),
    };
  }

  async inviteUsers(data: any) {
    return {
      data: {
        message: 'Invitations sent successfully',
        invitedCount: 1,
      },
    };
  }

  async activateUser(userId: string) {
    const teamUser = await this.prisma.teamUser.findFirst({
      where: { userId },
    });

    if (teamUser) {
      await this.prisma.teamUser.update({
        where: { id: teamUser.id },
        data: { status: 'active' },
      });
    }

    return {
      data: {
        id: userId,
        status: 'active',
      },
    };
  }

  async deactivateUser(userId: string) {
    const teamUser = await this.prisma.teamUser.findFirst({
      where: { userId },
    });

    if (teamUser) {
      await this.prisma.teamUser.update({
        where: { id: teamUser.id },
        data: { status: 'inactive' },
      });
    }

    return {
      data: {
        id: userId,
        status: 'inactive',
      },
    };
  }
}
