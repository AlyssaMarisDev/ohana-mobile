import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import Text from '../../../common/components/Text';
import colors from '../../../common/config/colors';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Task } from '../services/TaskService';
import { useGlobalState } from '../../../common/context/GlobalStateContext';
import { useTags } from '../../tags/hooks/useTags';
import { Tag } from '../../tags/components/Tag';

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
}: TaskPreviewProps) {
  const { households } = useGlobalState();
  const { data: tags } = useTags(task.householdId);
  const taskDueDate = new Date(task.dueDate);
  const isCompleted = task.status === 'COMPLETED';

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

  // Filter tags to only show the ones assigned to this task
  const taskTags = tags?.filter(tag => task.tagIds?.includes(tag.id)) || [];

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
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleCheckboxPress}
        activeOpacity={0.8}
        style={styles.checkboxContainer}
      >
        {isCompleted ? (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={22}
            color={textColor || colors.white}
            style={styles.checkIcon}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={22}
            color={textColor || colors.white}
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

        {showTags && taskTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {taskTags.slice(0, 3).map(tag => (
              <Tag key={tag.id} tag={tag} size="small" />
            ))}
            {taskTags.length > 3 && (
              <Text
                style={[styles.moreTags, { color: textColor || colors.white }]}
              >
                +{taskTags.length - 3}
              </Text>
            )}
          </View>
        )}

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
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: colors.white,
    marginTop: 3,
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
    color: colors.white,
    opacity: 0.8,
  },
  householdName: {
    fontSize: 12,
    color: colors.white,
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
});

export default TaskPreview;
