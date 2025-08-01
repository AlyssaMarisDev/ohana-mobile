import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import Text from '../../../common/components/Text';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Task, TaskStatus } from '../services/TaskService';
import { useGlobalState } from '../../../common/context/GlobalStateContext';
import { Tag } from '../../tags/services/TagService';
import { Tag as TagComponent } from '../../tags/components/Tag';
import configs from '../../../common/config';

type TaskPreviewProps = {
  task: Task;
  showDueDate?: boolean;
  showHousehold?: boolean;
  showTags?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  onPress?: () => void;
  onUpdateTask?: (task: Task) => void;
  tags?: Tag[];
};

function TaskPreview({
  task,
  showDueDate = true,
  showHousehold = false,
  showTags = true,
  style,
  textStyle,
  textColor,
  onPress,
  onUpdateTask,
  tags,
}: TaskPreviewProps) {
  const { households } = useGlobalState();
  const taskDueDate = new Date(task.dueDate);
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const actualTextColor = isCompleted
    ? configs.colors.textSecondary
    : textColor;

  // Function to format date as "July 25th"
  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return `${month} ${day}${suffix}`;
  };

  // Function to get day suffix (st, nd, rd, th)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const doByString = formatDate(taskDueDate);

  const household = households.find(h => h.id === task.householdId);

  // Filter tags to only show the ones assigned to this task and sort them by name
  const taskTags = tags?.filter(tag => task.tagIds?.includes(tag.id)) || [];
  const sortedTaskTags = taskTags.sort((a, b) => a.name.localeCompare(b.name));

  const handleCheckboxPress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleContentPress = () => {
    if (onUpdateTask) {
      onUpdateTask(task);
    }
  };

  return (
    <View
      style={[
        styles.container,
        style,
        isCompleted && styles.completedContainer,
      ]}
    >
      <TouchableOpacity
        onPress={handleCheckboxPress}
        activeOpacity={0.8}
        style={styles.checkboxContainer}
      >
        {isCompleted ? (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={22}
            color={actualTextColor}
            style={styles.checkIcon}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={22}
            color={actualTextColor}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handleContentPress}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.title, textStyle, { color: actualTextColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {task.title}
        </Text>

        {showTags && sortedTaskTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {sortedTaskTags.slice(0, 3).map(tag => (
              <TagComponent key={tag.id} tag={tag} size="small" />
            ))}
            {sortedTaskTags.length > 3 && (
              <Text
                style={[
                  styles.moreTags,
                  {
                    color: actualTextColor,
                  },
                ]}
              >
                +{sortedTaskTags.length - 3}
              </Text>
            )}
          </View>
        )}

        {showDueDate && (
          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.dueDate,
                {
                  color: actualTextColor,
                },
              ]}
              numberOfLines={1}
            >
              {doByString}
            </Text>
            {showHousehold && household && (
              <Text
                style={[
                  styles.householdName,
                  {
                    color: actualTextColor,
                  },
                ]}
                numberOfLines={1}
              >
                {household.name}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  text: {
    color: configs.colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: configs.colors.textPrimary,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    gap: 4,
  },
  moreTags: {
    fontSize: 10,
    opacity: 0.7,
    alignSelf: 'center',
    marginLeft: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: configs.colors.textSecondary,
    opacity: 0.8,
  },
  householdName: {
    fontSize: 12,
    color: configs.colors.textSecondary,
    opacity: 0.8,
    textAlign: 'right',
    flexShrink: 1,
  },
  checkIcon: {
    // Removed marginTop to align with title
  },
  disabled: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: 5,
  },
  completedContainer: {
    opacity: 0.6,
  },
});

export default TaskPreview;
