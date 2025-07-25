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
import HouseholdSelector from '../../households/components/HouseholdSelector';
import { Household } from '../../households/services/HouseholdService';
import { TagSelector } from '../../tags/components/TagSelector';
import configs from '../../../common/config';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, householdId: string, tagIds: string[]) => void;
  households: Household[];
  isLoadingHouseholds?: boolean;
  preSelectedHouseholdId?: string;
}

function CreateTaskModal({
  visible,
  onClose,
  onSubmit,
  households,
  isLoadingHouseholds = false,
  preSelectedHouseholdId,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    preSelectedHouseholdId || null
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start from below screen

  // Update selected household when preSelectedHouseholdId changes
  useEffect(() => {
    setSelectedHouseholdId(preSelectedHouseholdId || null);
  }, [preSelectedHouseholdId]);

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
    if (title.trim() && selectedHouseholdId) {
      onSubmit(title.trim(), selectedHouseholdId, selectedTagIds);
      setTitle('');
      setSelectedHouseholdId(preSelectedHouseholdId || null);
      setSelectedTagIds([]);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedHouseholdId(preSelectedHouseholdId || null);
    setSelectedTagIds([]);
    onClose();
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const isFormValid = title.trim() && selectedHouseholdId;

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
          onPress={handleClose}
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
          <View style={styles.header}>
            <Text style={styles.title}>Create New Task</Text>
          </View>

          <View style={styles.content}>
            <TextInput
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
              icon="format-title"
              style={styles.input}
            />

            {!preSelectedHouseholdId && (
              <HouseholdSelector
                households={households}
                selectedHouseholdId={selectedHouseholdId}
                onSelectHousehold={setSelectedHouseholdId}
                isLoading={isLoadingHouseholds}
              />
            )}

            <TagSelector
              householdId={selectedHouseholdId || undefined}
              selectedTagIds={selectedTagIds}
              onTagToggle={handleTagToggle}
              maxHeight={100}
            />

            <Button
              onPress={isFormValid ? handleSubmit : () => {}}
              style={[
                styles.submitButton,
                !isFormValid && styles.disabledButton,
              ]}
            >
              {'Create Task'}
            </Button>
          </View>
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
    backgroundColor: configs.colors.foreground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
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
});

export default CreateTaskModal;
