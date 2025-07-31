import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import TaskList from '../../tasks/components/TaskList';
import Text from '../../../common/components/Text';
import UpdateTaskModal from '../../tasks/components/UpdateTaskModal';
import { Task } from '../../tasks/services/TaskService';
import { Household } from '../../households/services/HouseholdService';
import { Tag } from '../../tags/services/TagService';
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
  tags?: Tag[];
  isLoadingTags?: boolean;
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
  tags,
  isLoadingTags = false,
}: TodayTaskListProps) {
  const { incompleteTasks, completedTasks, isLoading, deleteTask } =
    useTodayTasks();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  if (isLoading) {
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
      <View style={styles.container}>
        <TaskList
          title="To Do"
          tasks={incompleteTasks}
          onToggleTask={onToggleTask}
          onUpdateTask={handleUpdateTask}
          showHousehold={showHousehold}
          tags={tags}
          isLoadingTags={isLoadingTags}
        />

        <TaskList
          title="Completed"
          tasks={completedTasks}
          onToggleTask={onToggleTask}
          onUpdateTask={handleUpdateTask}
          showHousehold={showHousehold}
          tags={tags}
          isLoadingTags={isLoadingTags}
        />

        {incompleteTasks.length === 0 &&
          completedTasks.length === 0 &&
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks for today</Text>
            </View>
          )}
      </View>

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
  container: {
    flex: 1,
  },
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
});

export default TodayTaskList;
