import Screen from "../components/Screen";
import TaskPreview from "../components/TaskPreview";
import Text from "../components/Text";
import { StyleSheet } from "react-native";

function HomeScreen() {
  const tasks = [
    {
      title: "Task 1",
      dueDate: new Date("2025-07-01"),
    },
    {
      title: "Task 2",
      dueDate: new Date("2025-07-02"),
    },
    {
      title: "Task 3",
      dueDate: new Date("2025-07-03"),
    },
    {
      title: "Task 4",
      dueDate: new Date("2025-07-04"),
    },
    {
      title: "Task 5",
      dueDate: new Date("2025-07-05"),
    },
  ];

  return (
    <Screen style={styles.container}>
      <Text>Home</Text>
      {tasks.map((task) => (
        <TaskPreview
          key={task.title}
          title={task.title}
          dueDate={task.dueDate}
          style={styles.task}
          textStyle={styles.taskText}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  task: {
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
});

export default HomeScreen;
