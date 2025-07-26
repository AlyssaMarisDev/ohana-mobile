import React from 'react';
import { StyleSheet, View } from 'react-native';
import TaskPreview from './TaskPreview';
import Text from '../../../common/components/Text';
import { Task } from '../services/TaskService';
import configs from '../../../common/config';

interface TaskListBoxProps {
  title: string;
  tasks: Task[];
  onToggleTask: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  showHousehold?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

function TaskList({
  title,
  tasks,
  onToggleTask,
  onUpdateTask,
  showHousehold = false,
  backgroundColor = configs.colors.foreground,
  textColor = configs.colors.textPrimary,
}: TaskListBoxProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={[styles.taskContainer, { backgroundColor }]}>
        <Text style={[styles.sectionText, { color: textColor }]}>{title}</Text>
        {tasks
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .map(task => (
            <TaskPreview
              key={task.id}
              task={task}
              style={styles.task}
              onPress={() => onToggleTask(task)}
              onUpdateTask={onUpdateTask}
              showHousehold={showHousehold}
              textColor={textColor}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  taskContainer: {
    borderRadius: 10,
    padding: 10,
    minHeight: 50,
  },
  task: {
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export default TaskList;
