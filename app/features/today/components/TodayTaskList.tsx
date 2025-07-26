import React, { useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import TaskList from '../../tasks/components/TaskList';
import Text from '../../../common/components/Text';
import FloatingActionButton from '../../../common/components/FloatingActionButton';
import CreateTaskModal from '../../tasks/components/CreateTaskModal';
import UpdateTaskModal from '../../tasks/components/UpdateTaskModal';
import { Task } from '../../tasks/services/TaskService';
import { Household } from '../../households/services/HouseholdService';
import configs from '../../../common/config';
import { useTodayTasks } from '../hooks/useTodayTasks';

interface TodayTaskListProps {
  onToggleTask: (task: Task) => void;
  onUpdateTask: (
    taskId: string,
    data: Omit<Task, 'id' | 'createdBy' | 'householdId'>
  ) => void;
  onCreateTask: (title: string, householdId: string, tagIds: string[]) => void;
  households: Household[];
  isLoadingHouseholds?: boolean;
  showCreateButton?: boolean;
  showHousehold?: boolean;
  preSelectedHouseholdId?: string;
}

function TodayTaskList({
  onToggleTask,
  onUpdateTask,
  onCreateTask,
  households,
  isLoadingHouseholds = false,
  showCreateButton = true,
  showHousehold = false,
  preSelectedHouseholdId,
}: TodayTaskListProps) {
  const { incompleteTasks, completedTasks, isLoading, refetch, deleteTask } =
    useTodayTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateTask = (
    title: string,
    householdId: string,
    tagIds: string[]
  ) => {
    onCreateTask(title, householdId, tagIds);
  };

  const handleUpdateTask = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateTaskSubmit = (
    taskId: string,
    data: Omit<Task, 'id' | 'createdBy' | 'householdId'>
  ) => {
    if (selectedTask) {
      onUpdateTask(taskId, { ...selectedTask, ...data });
    }
    setIsUpdateModalVisible(false);
    setSelectedTask(null);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setIsUpdateModalVisible(false);
    setSelectedTask(null);
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={configs.colors.primary || '#0000ff'}
        />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[configs.colors.primary || '#0000ff']}
            tintColor={configs.colors.primary || '#0000ff'}
          />
        }
      >
        <TaskList
          title="To Do"
          tasks={incompleteTasks}
          onToggleTask={onToggleTask}
          onUpdateTask={handleUpdateTask}
          showHousehold={showHousehold}
        />

        <TaskList
          title="Completed"
          tasks={completedTasks}
          onToggleTask={onToggleTask}
          onUpdateTask={handleUpdateTask}
          showHousehold={showHousehold}
        />

        {incompleteTasks.length === 0 &&
          completedTasks.length === 0 &&
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks for today</Text>
            </View>
          )}
      </ScrollView>

      {showCreateButton && (
        <FloatingActionButton
          onPress={() => setIsCreateModalVisible(true)}
          icon="plus"
          style={styles.fab}
        />
      )}

      <CreateTaskModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTask}
        households={households}
        isLoadingHouseholds={isLoadingHouseholds}
        preSelectedHouseholdId={preSelectedHouseholdId}
      />

      <UpdateTaskModal
        visible={isUpdateModalVisible}
        onClose={handleUpdateModalClose}
        onSubmit={handleUpdateTaskSubmit}
        task={selectedTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: configs.colors.textSecondary,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 5,
    color: configs.colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: configs.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});

export default TodayTaskList;
