import { BaseService } from '@/app/common/utils/BaseService';
import { authenticatedAxios } from '@/app/features/auth/utils/authenticatedAxios';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  createdBy: string;
  householdId: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class TaskService extends BaseService {
  constructor() {
    super(authenticatedAxios);
  }

  async getTasks(householdIds?: string[]): Promise<Task[]> {
    let url = '/tasks';
    if (householdIds?.length) {
      url += `?householdIds=${householdIds.join(',')}`;
    }
    const response = await this.get(url);
    return response.data;
  }

  async getTask(taskId: string): Promise<Task> {
    const response = await this.get(`/tasks/${taskId}`);
    return response.data;
  }

  async createTask(taskData: Omit<Task, 'createdBy'>): Promise<Task> {
    const response = await this.post('/tasks', taskData);
    return response.data;
  }

  async updateTask(
    taskId: string,
    taskData: Omit<Task, 'id' | 'createdBy' | 'householdId'>
  ): Promise<Task> {
    const response = await this.put(`/tasks/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.delete(`/tasks/${taskId}`);
  }
}

export const taskService = new TaskService();
