import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import MultiTaskList from '../../tasks/components/MultiTaskList';
import { useTasksByHousehold } from '../../tasks/hooks/useTasksByHousehold';
import { useHouseholds } from '../hooks/useHouseholds';
import { Task, TaskStatus } from '../../tasks/services/TaskService';

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
  const [refreshing, setRefreshing] = useState(false);

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
    setRefreshing(true);
    try {
      await Promise.all([refetchTasks(), refetchHouseholds()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;
    updateTaskData({ ...task, status: newStatus });
  };

  const handleCreateTask = (
    title: string,
    taskHouseholdId: string,
    tagIds: string[]
  ) => {
    createNewTask(title, taskHouseholdId, tagIds);
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
    <Screen
      style={{ paddingHorizontal: '5%' }}
      refreshable={true}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <MultiTaskList
        tasks={tasks}
        isLoading={isLoadingTasks}
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
