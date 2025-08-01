import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Task,
  TaskStatus,
  taskService,
  TaskFilterParams,
} from '../../tasks/services/TaskService';
import { useAuth } from '../../auth/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/app/common/utils/logger';

export const useTodayTasks = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Calculate today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  // For tasks due today or before, we set dueDateTo to today
  const filterParams: TaskFilterParams = {
    dueDateTo: todayString,
  };

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['today-tasks', filterParams],
    queryFn: () => taskService.getTasks(filterParams),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string;
      householdId: string;
      tagIds: string[];
    }) => {
      return await taskService.createTask({
        id: uuidv4(),
        title: taskData.title,
        description: '',
        dueDate: new Date().toISOString(),
        status: TaskStatus.PENDING,
        householdId: taskData.householdId,
        tagIds: taskData.tagIds,
      });
    },
    onSuccess: () => {
      // Invalidate both today-tasks and general tasks queries
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: err => {
      logger.error('Task creation failed:', err);
      alert(
        `Failed to create task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: {
        title: string;
        description: string;
        dueDate: string;
        status: TaskStatus;
        tagIds: string[];
      };
    }) => {
      return await taskService.updateTask(taskId, data);
    },
    onSuccess: () => {
      // Invalidate both today-tasks and general tasks queries
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: err => {
      logger.error('Task update failed:', err);
      alert(
        `Failed to update task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await taskService.deleteTask(taskId);
    },
    onSuccess: () => {
      // Invalidate both today-tasks and general tasks queries
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: err => {
      logger.error('Task deletion failed:', err);
      alert(
        `Failed to delete task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    },
  });

  const todayTasks = useMemo(() => {
    // Since the backend now filters tasks by dueDateTo (today),
    // we only need to filter by completion status
    const incompleteTasks = tasks.filter(
      task => task.status !== TaskStatus.COMPLETED
    );

    // Filter for completed tasks where completedAt is today
    // Note: completedAt is set by the backend when status changes to COMPLETED
    const completedTasks = tasks.filter(task => {
      if (task.status !== TaskStatus.COMPLETED || !task.completedAt) {
        return false;
      }

      const completedDate = new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    return {
      incompleteTasks,
      completedTasks,
    };
  }, [tasks, today]);

  const updateTaskData = (task: Omit<Task, 'createdBy' | 'householdId'>) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      data: {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        tagIds: task.tagIds || [],
      },
    });
  };

  const createNewTask = (
    title: string,
    householdId: string,
    tagIds: string[] = []
  ) => {
    createTaskMutation.mutate({ title, householdId, tagIds });
  };

  const deleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  return {
    tasks,
    incompleteTasks: todayTasks.incompleteTasks,
    completedTasks: todayTasks.completedTasks,
    isLoading,
    error,
    refetch,
    updateTaskData,
    createNewTask,
    deleteTask,
  };
};
