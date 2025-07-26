import { BaseService } from '@/app/common/utils/BaseService';
import { authenticatedAxios } from '@/app/features/auth/utils/authenticatedAxios';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  completedAt?: string;
  createdBy: string;
  householdId: string;
  tagIds: string[];
}

export interface TaskUpdateData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  tagIds: string[];
}

export interface TaskFilterParams {
  householdIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
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

  async getTasks(params?: TaskFilterParams | string[]): Promise<Task[]> {
    const queryParams = new URLSearchParams();

    // Handle both old format (string[]) and new format (TaskFilterParams)
    if (Array.isArray(params)) {
      // Legacy format: getTasks(householdIds: string[])
      if (params.length) {
        queryParams.append('householdIds', params.join(','));
      }
    } else if (params) {
      // New format: getTasks(params: TaskFilterParams)
      if (params.householdIds?.length) {
        queryParams.append('householdIds', params.householdIds.join(','));
      }

      if (params.dueDateFrom) {
        queryParams.append('dueDateFrom', params.dueDateFrom);
      }

      if (params.dueDateTo) {
        queryParams.append('dueDateTo', params.dueDateTo);
      }
    }

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

  async updateTask(taskId: string, taskData: TaskUpdateData): Promise<Task> {
    const response = await this.put(`/tasks/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.delete(`/tasks/${taskId}`);
  }
}

export const taskService = new TaskService();
