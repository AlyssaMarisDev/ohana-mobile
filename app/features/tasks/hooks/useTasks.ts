import 'react-native-get-random-values';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, TaskStatus } from '../services/TaskService';
import { useAuth } from '../../auth/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/app/common/utils/logger';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
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

  // Update task with optimistic updates
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

    // Optimistic update
    onMutate: async ({ taskId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']) as
        | Task[]
        | undefined;

      // Optimistically update to the new value
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task => {
          if (task.id === taskId) {
            return { ...task, ...data };
          }
          return task;
        });
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (
      err,
      variables,
      context: { previousTasks?: Task[] } | undefined
    ) => {
      logger.error('Task update failed:', err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      // Show error to user
      alert(
        `Failed to update task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    },

    // On success, invalidate queries to get fresh data from server
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await taskService.deleteTask(taskId);
    },
    onSuccess: () => {
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
    isLoading,
    error,
    updateTaskData,
    createNewTask,
    refetch,
    deleteTask,
  };
};
