import React, { useState } from "react";
import Screen from "../components/Screen";
import TaskPreview from "../components/TaskPreview";
import Text from "../components/Text";
import { StyleSheet } from "react-native";
import { Task } from "../components/TaskPreview";

function TodayScreen() {
  const initialTasks: Task[] = [
    {
      id: 1,
      title: "Task 1",
      dueDate: new Date("2025-07-01"),
      isCompleted: false,
    },
    {
      id: 2,
      title: "Task 2",
      dueDate: new Date("2025-07-03"),
      isCompleted: false,
    },
    {
      id: 3,
      title: "Task 3",
      dueDate: new Date("2025-07-09"),
      isCompleted: false,
    },
    {
      id: 4,
      title: "Task 4",
      dueDate: new Date("2025-07-04"),
      isCompleted: true,
    },
    {
      id: 5,
      title: "Task 5",
      dueDate: new Date("2025-07-05"),
      isCompleted: false,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  const toggleTaskCompletion = (task: Task) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  const incompleteTasks = tasks.filter((task) => !task.isCompleted);
  const completeTasks = tasks.filter((task) => task.isCompleted);

  return (
    <Screen style={styles.container}>
      {incompleteTasks.length > 0 && (
        <>
          <Text style={styles.sectionText}>To Do</Text>
          {incompleteTasks
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
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
            .filter((task) => task.isCompleted)
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
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
});

export default TodayScreen;
