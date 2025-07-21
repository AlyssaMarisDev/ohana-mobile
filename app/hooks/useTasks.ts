import "react-native-get-random-values";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  updateTask,
  createTask,
  Task,
  TaskStatus,
} from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

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
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; householdId: string }) => {
      return await createTask({
        id: uuidv4(),
        title: taskData.title,
        description: "",
        dueDate: new Date().toISOString(),
        status: TaskStatus.PENDING,
        householdId: taskData.householdId,
      });
    },
    onSuccess: () => {
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
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks"]) as
        | Task[]
        | undefined;

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === taskId ? { ...task, ...data } : task
        );
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
      console.error("Task update failed:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
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

  const createNewTask = (title: string, householdId: string) => {
    createTaskMutation.mutate({ title, householdId });
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
