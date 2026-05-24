import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filters?: any) {
    return this.tasksService.getTasks(filters);
  }

  @Get('per-status')
  async getTaskStatus() {
    return this.tasksService.getTaskStatusCounts();
  }

  @Get(':id')
  async getTaskDetails(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post('create')
  async createTask(@Body() data: any) {
    return this.tasksService.createTask(data);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() data: any) {
    return this.tasksService.updateTask(id, data);
  }

  @Patch(':id')
  async patchTask(@Param('id') id: string, @Body() data: any) {
    return this.tasksService.patchTask(id, data);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
