import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import TaskPreview from "./TaskPreview";
import Text from "./Text";
import FloatingActionButton from "./FloatingActionButton";
import CreateTaskModal from "./CreateTaskModal";
import { Task, TaskStatus } from "../services/taskService";
import { Household } from "../services/householdService";
import configs from "../config";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onToggleTask: (task: Task) => void;
  onCreateTask: (title: string, householdId: string) => void;
  households: Household[];
  isLoadingHouseholds?: boolean;
  showCreateButton?: boolean;
  showHousehold?: boolean;
  title?: string;
}

function TaskList({
  tasks,
  isLoading,
  onRefresh,
  onToggleTask,
  onCreateTask,
  households,
  isLoadingHouseholds = false,
  showCreateButton = true,
  showHousehold = false,
  title,
}: TaskListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateTask = (title: string, householdId: string) => {
    onCreateTask(title, householdId);
  };

  const incompleteTasks = tasks.filter((task) => task.status !== "COMPLETED");
  const completeTasks = tasks.filter((task) => task.status === "COMPLETED");

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={configs.colors.primary || "#0000ff"}
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
            colors={[configs.colors.primary || "#0000ff"]}
            tintColor={configs.colors.primary || "#0000ff"}
          />
        }
      >
        {title && <Text style={styles.titleText}>{title}</Text>}

        {incompleteTasks.length > 0 && (
          <>
            <Text style={styles.sectionText}>To Do</Text>
            {incompleteTasks
              .sort(
                (a, b) =>
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              )
              .map((task) => (
                <TaskPreview
                  key={task.id}
                  task={task}
                  style={styles.task}
                  textStyle={styles.taskText}
                  onPress={() => onToggleTask(task)}
                  showHousehold={showHousehold}
                />
              ))}
          </>
        )}
        {completeTasks.length > 0 && (
          <>
            <Text style={styles.sectionText}>Completed</Text>
            {completeTasks
              .sort(
                (a, b) =>
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              )
              .map((task) => (
                <TaskPreview
                  key={task.id}
                  task={task}
                  style={styles.task}
                  textStyle={styles.taskText}
                  onPress={() => onToggleTask(task)}
                  showHousehold={showHousehold}
                />
              ))}
          </>
        )}
        {tasks.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        )}
      </ScrollView>

      {showCreateButton && (
        <FloatingActionButton
          onPress={() => setIsModalVisible(true)}
          icon="plus"
          style={styles.fab}
        />
      )}

      <CreateTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateTask}
        households={households}
        isLoadingHouseholds={isLoadingHouseholds}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 5,
    color: configs.colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  task: {
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  sectionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default TaskList;
