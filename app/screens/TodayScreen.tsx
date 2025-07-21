import React, { useState } from "react";
import Screen from "../components/Screen";
import TaskPreview from "../components/TaskPreview";
import Text from "../components/Text";
import FloatingActionButton from "../components/FloatingActionButton";
import CreateTaskModal from "../components/CreateTaskModal";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useTasks } from "../hooks/useTasks";
import configs from "../config";
import { Task, TaskStatus } from "../services/taskService";

function TodayScreen() {
  const { tasks, isLoading, refetch, updateTaskData, createNewTask } =
    useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing tasks:", error);
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

  const handleCreateTask = (title: string) => {
    createNewTask(title);
  };

  const incompleteTasks = tasks.filter((task) => task.status !== "COMPLETED");
  const completeTasks = tasks.filter((task) => task.status === "COMPLETED");

  if (isLoading && !refreshing) {
    return (
      <Screen style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={configs.colors.primary || "#0000ff"}
          />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[configs.colors.primary || "#0000ff"]}
            tintColor={configs.colors.primary || "#0000ff"}
          />
        }
      >
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
                  onPress={() => toggleTaskCompletion(task)}
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
                  onPress={() => toggleTaskCompletion(task)}
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

      <FloatingActionButton
        onPress={() => setIsModalVisible(true)}
        icon="plus"
        style={styles.fab}
      />

      <CreateTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateTask}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
  },
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

export default TodayScreen;
