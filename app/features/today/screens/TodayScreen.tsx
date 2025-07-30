import React, { useState } from 'react';
import { View } from 'react-native';
import Screen from '../../../common/components/Screen';
import TodayTaskList from '../components/TodayTaskList';
import FloatingActionButton from '../../../common/components/FloatingActionButton';
import CreateTaskModal from '../../tasks/components/CreateTaskModal';
import { useTodayTasks } from '../hooks/useTodayTasks';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { Task, TaskStatus } from '../../tasks/services/TaskService';

function TodayScreen() {
  const {
    updateTaskData,
    createNewTask,
    refetch: refetchTodayTasks,
  } = useTodayTasks();
  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchTodayTasks(), refetchHouseholds()]);
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
    <View style={styles.container}>
      <Screen
        style={{ paddingHorizontal: '5%' }}
        refreshable={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        <TodayTaskList
          onToggleTask={toggleTaskCompletion}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          households={households}
          isLoadingHouseholds={isLoadingHouseholds}
          showHousehold={true}
          showCreateButton={false}
        />
      </Screen>

      <FloatingActionButton
        onPress={() => setIsCreateModalVisible(true)}
        icon="plus"
        style={styles.fab}
      />

      <CreateTaskModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTask}
        households={households}
        isLoadingHouseholds={isLoadingHouseholds}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute' as const,
    bottom: 30,
    right: 30,
  },
};

export default TodayScreen;
