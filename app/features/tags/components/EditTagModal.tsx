import { useState, useEffect } from 'react';
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
import { Tag } from '../services/TagService';

interface EditTagModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (tagData: { name: string; color: string }) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  tag?: Tag;
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

function EditTagModal({
  isVisible,
  onClose,
  onSubmit,
  onDelete,
  isDeleting = false,
  tag,
}: EditTagModalProps) {
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Update selected color when tag changes
  useEffect(() => {
    if (tag) {
      setSelectedColor(tag.color);
    }
  }, [tag]);

  const handleSubmit = (values: { name: string }) => {
    onSubmit({
      name: values.name,
      color: selectedColor,
    });
  };

  const handleDeletePress = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    onDelete?.();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
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
              <Text style={styles.title}>Edit Tag</Text>
              {onDelete && (
                <TouchableOpacity
                  style={styles.headerDeleteButton}
                  onPress={handleDeletePress}
                  disabled={isDeleting}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={configs.colors.danger}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Form
              initialValues={{ name: tag?.name || '' }}
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
                  title="Update Tag"
                  style={styles.updateButton}
                  textStyle={styles.updateButtonText}
                />
              </View>
            </Form>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent
        animationType="none"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={handleCancelDelete}
            activeOpacity={1}
          />
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationHeader}>
              <Ionicons
                name="warning"
                size={32}
                color={configs.colors.danger}
              />
              <Text style={styles.confirmationTitle}>Delete Tag</Text>
            </View>

            <Text style={styles.confirmationMessage}>
              Are you sure you want to delete "{tag?.name}"? This tag will be
              removed from all tasks it's attached to.
            </Text>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.cancelConfirmButton}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={configs.colors.white}
                />
                <Text style={styles.confirmDeleteText}>
                  {isDeleting ? 'Deleting...' : 'Delete Tag'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerDeleteButton: {
    padding: 4,
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
  },
  cancelText: {
    fontSize: 16,
    color: configs.colors.textSecondary,
  },
  updateButton: {
    flex: 1,
  },
  updateButtonText: {
    color: configs.colors.textPrimary,
  },
  deleteSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: configs.colors.gray4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${configs.colors.danger}10`,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: configs.colors.danger,
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: configs.colors.danger,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: configs.colors.danger,
    fontWeight: '600',
  },
  confirmationContainer: {
    backgroundColor: configs.colors.background,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginTop: 8,
  },
  confirmationMessage: {
    fontSize: 16,
    color: configs.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configs.colors.gray3,
    alignItems: 'center',
  },
  cancelConfirmText: {
    fontSize: 16,
    color: configs.colors.textSecondary,
  },
  confirmDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: configs.colors.danger,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmDeleteText: {
    fontSize: 16,
    color: configs.colors.white,
    fontWeight: '600',
  },
});

export default EditTagModal;
