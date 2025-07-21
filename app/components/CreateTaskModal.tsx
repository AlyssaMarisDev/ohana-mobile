import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Text from "./Text";
import TextInput from "./TextInput";
import Button from "./Button";
import HouseholdSelector from "./HouseholdSelector";
import { Household } from "../services/householdService";
import configs from "../config";

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, householdId: string) => void;
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
  const [title, setTitle] = useState("");
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    preSelectedHouseholdId || null
  );

  // Update selected household when preSelectedHouseholdId changes
  React.useEffect(() => {
    setSelectedHouseholdId(preSelectedHouseholdId || null);
  }, [preSelectedHouseholdId]);

  const handleSubmit = () => {
    if (title.trim() && selectedHouseholdId) {
      onSubmit(title.trim(), selectedHouseholdId);
      setTitle("");
      setSelectedHouseholdId(preSelectedHouseholdId || null);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setSelectedHouseholdId(preSelectedHouseholdId || null);
    onClose();
  };

  const isFormValid = title.trim() && selectedHouseholdId;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Create New Task</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={configs.colors.gray3}
                  />
                </TouchableOpacity>
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

                <Button
                  onPress={isFormValid ? handleSubmit : () => {}}
                  style={[
                    styles.submitButton,
                    !isFormValid && styles.disabledButton,
                  ]}
                >
                  {"Create Task"}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: configs.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: configs.colors.black,
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
