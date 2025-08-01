import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';
import Form from '../../../common/components/Form';
import FormField from '../../../common/components/FormField';
import FormSubmit from '../../../common/components/FormSubmit';
import * as Yup from 'yup';

interface CreateTagModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (tagData: { name: string; color: string }) => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tag name is required')
    .min(1, 'Tag name cannot be empty'),
});

const tagColors = [
  '#FF6B6B', // Bright red
  '#4ECDC4', // Bright teal
  '#45B7D1', // Bright blue
  '#96CEB4', // Bright mint green
  '#FFEAA7', // Bright yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E9', // Light blue
];

function CreateTagModal({ isVisible, onClose, onSubmit }: CreateTagModalProps) {
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);

  const handleSubmit = (values: { name: string }) => {
    onSubmit({
      name: values.name,
      color: selectedColor,
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Tag</Text>
          </View>

          <Form
            initialValues={{ name: '' }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              name="name"
              placeholder="Tag name"
              icon="tag"
              style={styles.nameInput}
            />

            <View style={styles.colorSection}>
              <Text style={styles.colorTitle}>Choose a color:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorList}
              >
                {tagColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <FormSubmit
                title="Create Tag"
                style={styles.createButton}
                textStyle={styles.createButtonText}
              />
            </View>
          </Form>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: configs.colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: configs.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  nameInput: {
    marginBottom: 20,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: configs.colors.textPrimary,
    marginBottom: 12,
  },
  colorList: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: configs.colors.white,
  },
  selectedColor: {
    borderColor: configs.colors.primary,
    borderWidth: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configs.colors.gray3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 20,
    color: configs.colors.textSecondary,
  },
  createButton: {
    flex: 1,
  },
  createButtonText: {
    color: configs.colors.textPrimary,
  },
});

export default CreateTagModal;
