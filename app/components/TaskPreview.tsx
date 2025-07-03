import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";

type TaskPreviewProps = {
  title: string;
  dueDate: Date;
  showDueDate?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function TaskPreview({
  title,
  dueDate,
  showDueDate = true,
  style,
  textStyle,
}: TaskPreviewProps) {
  const today = new Date();

  const isToday = dueDate.toLocaleDateString() === today.toLocaleDateString();
  const isTomorrow =
    dueDate.toLocaleDateString() ===
    new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
  const isInPast = dueDate.getTime() < today.getTime();

  const doByString = isToday
    ? "Today"
    : isTomorrow
    ? "Tomorrow"
    : isInPast
    ? "Overdue"
    : dueDate.toLocaleDateString();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[styles.title, textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      {showDueDate && (
        <Text style={styles.dueDate} numberOfLines={1} align="right">
          {doByString}
        </Text>
      )}
    </View>
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
});

export default TaskPreview;
