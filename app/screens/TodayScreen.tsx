import React from "react";
import Screen from "../components/Screen";
import TaskList from "../components/tasks/MultiTaskList";
import { useTasks } from "../hooks/useTasks";
import { useHouseholds } from "../hooks/useHouseholds";
import { Task, TaskStatus } from "../services/taskService";

function TodayScreen() {
  const {
    tasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
    updateTaskData,
    createNewTask,
  } = useTasks();
  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(true);

  const onRefresh = async () => {
    await Promise.all([refetchTasks(), refetchHouseholds()]);
  };

  const toggleTaskCompletion = (task: Task) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;
    updateTaskData({ ...task, status: newStatus });
  };

  const handleCreateTask = (title: string, householdId: string) => {
    createNewTask(title, householdId);
  };

  const handleUpdateTask = (
    taskId: string,
    data: Omit<Task, "id" | "createdBy" | "householdId">
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTaskData({ ...task, ...data });
    }
  };

  return (
    <Screen style={{ paddingHorizontal: "5%" }}>
      <TaskList
        tasks={tasks}
        isLoading={isLoadingTasks}
        onRefresh={onRefresh}
        onToggleTask={toggleTaskCompletion}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
        households={households}
        isLoadingHouseholds={isLoadingHouseholds}
        showHousehold={true}
      />
    </Screen>
  );
}

export default TodayScreen;
