import React from 'react';
import Screen from '../../../common/components/Screen';
import TodayTaskList from '../components/TodayTaskList';
import { useTodayTasks } from '../hooks/useTodayTasks';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { Task, TaskStatus } from '../../tasks/services/TaskService';

function TodayScreen() {
  const { updateTaskData, createNewTask } = useTodayTasks();
  const { households, isLoading: isLoadingHouseholds } = useHouseholds(true);

  const toggleTaskCompletion = (task: Task) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;
    updateTaskData({ ...task, status: newStatus });
  };

  const handleCreateTask = (
    title: string,
    householdId: string,
    tagIds: string[]
  ) => {
    createNewTask(title, householdId, tagIds);
  };

  const handleUpdateTask = (
    taskId: string,
    data: Omit<Task, 'id' | 'createdBy' | 'householdId'>
  ) => {
    updateTaskData({ id: taskId, ...data } as Task);
  };

  return (
    <Screen style={{ paddingHorizontal: '5%' }}>
      <TodayTaskList
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
