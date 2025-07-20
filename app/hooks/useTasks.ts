import { useEffect, useState } from "react";
import { getTasks, Task } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

export const useTasks = (shouldFetch: boolean = true) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Keep showing existing data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && isAuthenticated) {
      fetchTasks();
    }
  }, [shouldFetch, isAuthenticated]);

  return {
    tasks,
    isLoading,
    fetchTasks, // Expose this in case manual refresh is needed
  };
};
