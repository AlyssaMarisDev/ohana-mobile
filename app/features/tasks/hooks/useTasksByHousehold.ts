import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTask,
  createTask,
  Task,
  TaskStatus,
  getTasksforHouseholds,
} from "../services/taskService";
import { useAuth } from "../../auth/context/AuthContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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
    queryKey: ["tasks", "household", householdId],
    queryFn: () => getTasksforHouseholds([householdId]),
    enabled: shouldFetch && isAuthenticated && !!householdId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; householdId: string }) => {
      // Generate a UUID for the task ID
      const taskId = uuidv4();

      return await createTask({
        id: taskId,
        title: taskData.title,
        description: "",
        dueDate: new Date().toISOString(),
        status: TaskStatus.PENDING,
        householdId: taskData.householdId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "household", householdId],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      console.error("Task creation failed:", err);
      alert(
        `Failed to create task: ${
          err instanceof Error ? err.message : "Unknown error"
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
      data: Omit<Task, "id" | "createdBy" | "householdId">;
    }) => {
      return await updateTask(taskId, data);
    },

    // Optimistic update
    onMutate: async ({ taskId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["tasks", "household", householdId],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([
        "tasks",
        "household",
        householdId,
      ]) as Task[] | undefined;

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["tasks", "household", householdId],
        (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map((task) =>
            task.id === taskId ? { ...task, ...data } : task
          );
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
      console.error("Task update failed:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", "household", householdId],
          context.previousTasks
        );
      }
      // Show error to user
      alert(
        `Failed to update task: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    },
  });

  const updateTaskData = (task: Omit<Task, "createdBy" | "householdId">) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      data: task,
    });
  };

  const createNewTask = (title: string, taskHouseholdId: string) => {
    createTaskMutation.mutate({ title, householdId: taskHouseholdId });
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
