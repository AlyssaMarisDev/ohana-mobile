import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  View,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Task } from "../services/taskService";
import { useGlobalState } from "../context/GlobalStateContext";

type TaskPreviewProps = {
  task: Task;
  showDueDate?: boolean;
  showHousehold?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

function TaskPreview({
  task,
  showDueDate = true,
  showHousehold = false,
  style,
  textStyle,
  onPress,
}: TaskPreviewProps) {
  const { households } = useGlobalState();
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

  const household = households.find((h) => h.id === task.householdId);

  return (
    <TouchableOpacity
      style={[styles.container, style, isCompleted && styles.completed]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isCompleted ? (
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
      )}
      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, textStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {task.title}
        </Text>
        {showDueDate && (
          <View style={styles.bottomRow}>
            <Text style={styles.dueDate} numberOfLines={1}>
              {doByString}
            </Text>
            {showHousehold && household && (
              <Text style={styles.householdName} numberOfLines={1}>
                {household.name}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  text: {
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  householdName: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    textAlign: "right",
    flexShrink: 1,
  },
  completed: {
    backgroundColor: colors.gray2,
  },
  checkIcon: {
    marginTop: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default TaskPreview;
