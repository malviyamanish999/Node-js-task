import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    completed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      mockRepository.findAndCount.mockResolvedValue([[mockTask], 1]);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual({
        data: [mockTask],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { created_at: 'DESC' },
        withDeleted: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        withDeleted: false,
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };
      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        status: TaskStatus.PENDING,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED,
      };
      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(mockTask).mockResolvedValueOnce(updatedTask);

      const result = await service.update('1', updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Task',
        status: TaskStatus.COMPLETED,
        completed_at: expect.any(Date),
      }));
    });

    it('should set completed_at to null when status is not COMPLETED', async () => {
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.PENDING,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.update.mockResolvedValue(undefined);

      await service.update('1', updateTaskDto);

      expect(mockTask.completed_at).toBeNull();
    });
  });

  describe('remove', () => {
    it('should soft delete a task', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.softRemove.mockResolvedValue(mockTask);

      const result = await service.remove('1');

      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockTask);
    });
  });
});
