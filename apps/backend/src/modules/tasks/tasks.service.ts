import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(filters?: any) {
    const tasks = await this.prisma.task.findMany({
      where: filters,
    });

    return {
      data: tasks,
      meta: {
        total: tasks.length,
      },
    };
  }

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    return {
      data: task,
    };
  }

  async createTask(data: any) {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status || 'pending',
        priority: data.priority,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
      },
    });

    return {
      data: task,
    };
  }

  async updateTask(id: string, data: any) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.type && { type: data.type }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assignedTo && { assignedTo: data.assignedTo }),
        ...(data.dueDate && { dueDate: data.dueDate }),
      },
    });

    return {
      data: task,
    };
  }

  async patchTask(id: string, data: any) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assignedTo !== undefined && { assignedTo: data.assignedTo }),
      },
    });

    return {
      data: task,
    };
  }

  async deleteTask(id: string) {
    await this.prisma.task.delete({
      where: { id },
    });

    return {
      data: {
        id,
        deleted: true,
      },
    };
  }

  async getTaskStatusCounts() {
    const tasks = await this.prisma.task.findMany();

    const counts = {
      completed: tasks.filter(t => t.status === 'completed').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };

    return counts;
  }
}
