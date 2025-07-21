import React, { useState, useEffect } from "react";
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
import { Task } from "../services/taskService";
import configs from "../config";

interface UpdateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    taskId: string,
    data: Omit<Task, "id" | "createdBy" | "householdId">
  ) => void;
  task: Task | null;
}

function UpdateTaskModal({
  visible,
  onClose,
  onSubmit,
  task,
}: UpdateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split("T")[0]); // Extract date part only
    }
  }, [task]);

  const handleSubmit = () => {
    if (title.trim() && task) {
      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        status: task.status,
      });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isFormValid = title.trim() && dueDate;

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
                <Text style={styles.title}>Update Task</Text>
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

                <Button
                  onPress={isFormValid ? handleSubmit : () => {}}
                  style={[
                    styles.submitButton,
                    !isFormValid && styles.disabledButton,
                  ]}
                >
                  {"Update Task"}
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

export default UpdateTaskModal;
