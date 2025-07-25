import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Text from '../../../common/components/Text';
import TextInput from '../../../common/components/TextInput';
import Button from '../../../common/components/Button';
import { Task, TaskUpdateData } from '../services/TaskService';
import { TagSelector } from '../../tags/components/TagSelector';
import configs from '../../../common/config';
import {
  ActionMenu,
  ActionMenuItem,
} from '../../../common/components/ActionMenu';

interface UpdateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, data: TaskUpdateData) => void;
  task: Task | null;
  onDelete?: (taskId: string) => void;
}

function UpdateTaskModal({
  visible,
  onClose,
  onSubmit,
  task,
  onDelete,
}: UpdateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start from below screen

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split('T')[0]); // Extract date part only
      setSelectedTagIds(task.tagIds || []);
    }
  }, [task]);

  // Also update form when modal becomes visible
  useEffect(() => {
    if (visible && task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split('T')[0]); // Extract date part only
      setSelectedTagIds(task.tagIds || []);
    }
  }, [visible, task]);

  // Handle animation when visibility changes
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSubmit = () => {
    if (title.trim() && task) {
      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        status: task.status,
        tagIds: selectedTagIds,
      });
      onClose();
    }
  };

  const handleClose = () => {
    // Close menu if open
    setMenuVisible(false);
    onClose();
  };

  const handleBackdropPress = () => {
    setMenuVisible(false);
    handleClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      setMenuVisible(false);
      onClose();
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const isFormValid = title.trim() && dueDate;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleBackdropPress}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.modalContent}
            onPress={() => setMenuVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Update Task</Text>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => setMenuVisible(v => !v)}
                  style={styles.menuButton}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={28}
                    color={configs.colors.white}
                  />
                </TouchableOpacity>
                <ActionMenu
                  visible={menuVisible}
                  onRequestClose={() => setMenuVisible(false)}
                >
                  <ActionMenuItem
                    title="Delete Task"
                    icon={<MaterialCommunityIcons name="delete" size={20} />}
                    color={configs.colors.danger}
                    onPress={handleDelete}
                  />
                </ActionMenu>
              </View>
            </View>

            <View style={styles.content}>
              <TextInput
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
                icon="format-title"
                style={styles.input}
              />

              <TextInput
                placeholder="Enter task description (optional)"
                value={description}
                onChangeText={setDescription}
                icon="text"
                style={styles.input}
              />

              <TextInput
                placeholder="Due date (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
                icon="calendar"
                style={styles.input}
              />

              {task && (
                <TagSelector
                  householdId={task.householdId}
                  selectedTagIds={selectedTagIds}
                  onTagToggle={handleTagToggle}
                  maxHeight={100}
                />
              )}

              <Button
                onPress={isFormValid ? handleSubmit : () => {}}
                style={[
                  styles.submitButton,
                  !isFormValid && styles.disabledButton,
                ]}
              >
                {'Update Task'}
              </Button>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: configs.colors.gray5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalContent: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: configs.colors.white,
  },
  closeButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  content: {
    gap: 20,
  },
  input: {
    marginBottom: 0,
  },
  submitButton: {
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: configs.colors.gray1,
  },
  deleteButton: {
    backgroundColor: configs.colors.danger,
    marginTop: 10,
  },
});

export default UpdateTaskModal;
