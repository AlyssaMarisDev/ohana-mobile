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

type Task = {
  id: number;
  title: string;
  dueDate: Date;
  isCompleted: boolean;
};

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

  const isToday =
    task.dueDate.toLocaleDateString() === today.toLocaleDateString();
  const isTomorrow =
    task.dueDate.toLocaleDateString() ===
    new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
  const isInPast = task.dueDate.getTime() < today.getTime();

  const doByString = isToday
    ? "Today"
    : isTomorrow
    ? "Tomorrow"
    : isInPast
    ? "Overdue"
    : task.dueDate.toLocaleDateString();

  return (
    <TouchableOpacity
      style={[styles.container, style, task.isCompleted && styles.completed]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {task.isCompleted && (
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
      )}
      {!task.isCompleted && (
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
export type { Task };
