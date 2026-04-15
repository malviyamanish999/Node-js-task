import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [tasks, total] = await this.taskRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      withDeleted: false,
    });

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.PENDING,
    });

    return this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    if (updateTaskDto.status === TaskStatus.COMPLETED && !task.completed_at) {
      updateTaskDto.completed_at = new Date();
    } else if (
      updateTaskDto.status &&
      updateTaskDto.status !== TaskStatus.COMPLETED
    ) {
      task.completed_at = null;
    }

    await this.taskRepository.update(id, updateTaskDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.softRemove(task);
    return { message: 'Task deleted successfully' };
  }
}
