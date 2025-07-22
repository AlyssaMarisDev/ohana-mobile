import React, { useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import MultiTaskList from '../../tasks/components/MultiTaskList';
import { useTasksByHousehold } from '../../tasks/hooks/useTasksByHousehold';
import { useHouseholds } from '../hooks/useHouseholds';
import { Task, TaskStatus } from '../../tasks/services/taskService';

type HouseholdTasksRouteProp = RouteProp<
  {
    HouseholdTasks: { householdId: string };
  },
  'HouseholdTasks'
>;

function HouseholdTasksScreen() {
  const route = useRoute<HouseholdTasksRouteProp>();
  const navigation = useNavigation();
  const { householdId } = route.params;

  const {
    tasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
    updateTaskData,
    createNewTask,
  } = useTasksByHousehold(householdId, true);

  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(false);

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

  const handleCreateTask = (title: string, taskHouseholdId: string) => {
    createNewTask(title, taskHouseholdId);
  };

  const handleUpdateTask = (
    taskId: string,
    data: Omit<Task, 'id' | 'createdBy' | 'householdId'>
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskData({ ...task, ...data });
    }
  };

  const household = households.find(h => h.id === householdId);

  // Update header title when household data is loaded
  useEffect(() => {
    if (household) {
      (navigation as any).setOptions({
        title: household.name,
      });
    }
  }, [household, navigation]);

  return (
    <Screen style={{ paddingHorizontal: '5%' }}>
      <MultiTaskList
        tasks={tasks}
        isLoading={isLoadingTasks}
        onRefresh={onRefresh}
        onToggleTask={toggleTaskCompletion}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
        households={households}
        isLoadingHouseholds={isLoadingHouseholds}
        preSelectedHouseholdId={householdId}
      />
    </Screen>
  );
}

export default HouseholdTasksScreen;
