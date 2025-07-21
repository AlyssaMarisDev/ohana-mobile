import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  View,
} from "react-native";
import Text from "../Text";
import colors from "../../config/colors";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Task } from "../../services/taskService";
import { useGlobalState } from "../../context/GlobalStateContext";

type TaskPreviewProps = {
  task: Task;
  showDueDate?: boolean;
  showHousehold?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  onPress?: () => void;
};

function TaskPreview({
  task,
  showDueDate = true,
  showHousehold = false,
  style,
  textStyle,
  textColor,
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
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isCompleted ? (
        <MaterialCommunityIcons
          name="check"
          size={18}
          color={textColor || colors.white}
          style={styles.checkIcon}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={18}
          color={textColor || colors.white}
          style={styles.checkIcon}
        />
      )}
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            textStyle,
            { color: textColor || colors.white },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {task.title}
        </Text>
        {showDueDate && (
          <View style={styles.bottomRow}>
            <Text
              style={[styles.dueDate, { color: textColor || colors.white }]}
              numberOfLines={1}
            >
              {doByString}
            </Text>
            {showHousehold && household && (
              <Text
                style={[
                  styles.householdName,
                  { color: textColor || colors.white },
                ]}
                numberOfLines={1}
              >
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
    fontSize: 16,
    color: colors.white,
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  householdName: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    textAlign: "right",
    flexShrink: 1,
  },
  checkIcon: {
    marginTop: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default TaskPreview;
