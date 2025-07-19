import { createAuthenticatedAxios } from "./authenticatedAxios";

// Create an authenticated axios instance that automatically handles token refresh
export const apiClient = createAuthenticatedAxios();

// Example of how to use the authenticated client for API calls
export const exampleApiCalls = {
  // Get user profile
  getUserProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (data: any) => {
    const response = await apiClient.put("/user/profile", data);
    return response.data;
  },

  // Get tasks
  getTasks: async () => {
    const response = await apiClient.get("/tasks");
    return response.data;
  },

  // Create task
  createTask: async (taskData: any) => {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId: string, taskData: any) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

// Export the client for direct use
export default apiClient;
