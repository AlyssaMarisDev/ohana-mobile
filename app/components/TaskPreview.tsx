import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Task } from "../services/taskService";

type TaskPreviewProps = {
  task: Task;
  showDueDate?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

function TaskPreview({
  task,
  showDueDate = true,
  style,
  textStyle,
  onPress,
}: TaskPreviewProps) {
  const today = new Date();
  const taskDueDate = new Date(task.dueDate);

  const isToday =
    taskDueDate.toLocaleDateString() === today.toLocaleDateString();
  const isTomorrow =
    taskDueDate.toLocaleDateString() ===
    new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
  const isInPast = taskDueDate.getTime() < today.getTime();
  const isCompleted = task.status === "COMPLETED";

  const doByString = isToday
    ? "Today"
    : isTomorrow
    ? "Tomorrow"
    : isInPast
    ? "Overdue"
    : taskDueDate.toLocaleDateString();

  return (
    <TouchableOpacity
      style={[styles.container, style, isCompleted && styles.completed]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isCompleted && (
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
      )}
      {!isCompleted && (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
      )}
      <Text
        style={[styles.title, textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {task.title}
      </Text>
      {showDueDate && (
        <Text style={styles.dueDate} numberOfLines={1} align="right">
          {doByString}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: colors.white,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    flex: 1,
  },
  dueDate: {
    fontSize: 16,
    color: colors.white,
    flexShrink: 0,
    minWidth: 60,
    marginLeft: 10,
    textAlign: "right",
  },
  completed: {
    backgroundColor: colors.gray2,
  },
  checkIcon: {
    marginRight: 10,
  },
});

export default TaskPreview;
