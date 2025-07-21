import { authenticatedAxios } from "../utils/authenticatedAxios";

// Types for task data
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
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Get all tasks for the authenticated user
export const getTasks = async (): Promise<Task[]> => {
  const response = await authenticatedAxios.get("/tasks");
  return response.data;
};

// Get tasks by household IDs
export const getTasksforHouseholds = async (
  householdIds: string[]
): Promise<Task[]> => {
  const response = await authenticatedAxios.get(
    `/tasks?householdIds=${householdIds.join(",")}`
  );
  return response.data;
};

// Get task by ID
export const getTask = async (taskId: string): Promise<Task> => {
  const response = await authenticatedAxios.get(`/tasks/${taskId}`);
  return response.data;
};

// Create a new task
export const createTask = async (
  taskData: Omit<Task, "createdBy">
): Promise<Task> => {
  const response = await authenticatedAxios.post("/tasks", taskData);
  return response.data;
};

// Update a task
export const updateTask = async (
  taskId: string,
  taskData: Omit<Task, "id" | "createdBy" | "householdId">
): Promise<Task> => {
  console.log("Updating task:", taskId, taskData);
  const response = await authenticatedAxios.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  await authenticatedAxios.delete(`/tasks/${taskId}`);
};
