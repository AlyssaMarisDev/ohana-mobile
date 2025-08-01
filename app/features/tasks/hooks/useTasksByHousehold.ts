import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, taskService, TaskStatus } from '../services/TaskService';
import { useAuth } from '../../auth/context/AuthContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/app/common/utils/logger';

export const useTasksByHousehold = (
  householdId: string,
  shouldFetch: boolean = true
) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Fetch tasks by household
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', 'household', householdId],
    queryFn: () => taskService.getTasks([householdId]),
    enabled: shouldFetch && isAuthenticated && !!householdId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string;
      householdId: string;
      tagIds: string[];
    }) => {
      // Generate a UUID for the task ID
      const taskId = uuidv4();

      return await taskService.createTask({
        id: taskId,
        title: taskData.title,
        description: '',
        dueDate: new Date().toISOString(),
        status: TaskStatus.PENDING,
        householdId: taskData.householdId,
        tagIds: taskData.tagIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'household', householdId],
      });
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
      await queryClient.cancelQueries({
        queryKey: ['tasks', 'household', householdId],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([
        'tasks',
        'household',
        householdId,
      ]) as Task[] | undefined;

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['tasks', 'household', householdId],
        (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map(task => {
            if (task.id === taskId) {
              return { ...task, ...data };
            }
            return task;
          });
        }
      );

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
        queryClient.setQueryData(
          ['tasks', 'household', householdId],
          context.previousTasks
        );
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
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'household', householdId],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
    taskHouseholdId: string,
    tagIds: string[] = []
  ) => {
    createTaskMutation.mutate({ title, householdId: taskHouseholdId, tagIds });
  };

  return {
    tasks,
    isLoading,
    error,
    updateTaskData,
    createNewTask,
    refetch,
  };
};
