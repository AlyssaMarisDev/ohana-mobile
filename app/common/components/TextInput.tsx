import {
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import configs from "../config";
import { useState } from "react";

interface TextInputProps {
  secureTextEntry?: boolean;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  includeShowIcon?: boolean;
}

function TextInput({
  secureTextEntry = false,
  placeholder,
  value,
  onChangeText,
  icon,
  style,
  includeShowIcon = false,
}: TextInputProps) {
  const [showSecureTextEntry, setShowSecureTextEntry] =
    useState(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialCommunityIcons name={icon} size={24} style={styles.icon} />
      )}
      <RNTextInput
        secureTextEntry={showSecureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={configs.colors.gray2}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
      />
      {includeShowIcon && (
        <MaterialCommunityIcons
          name={showSecureTextEntry ? "eye" : "eye-off"}
          size={24}
          style={[styles.icon, styles.showIcon]}
          onPress={() => {
            setShowSecureTextEntry(!showSecureTextEntry);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: configs.colors.gray0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: configs.colors.gray0,
    padding: 5,
    width: "100%",
  },
  textInput: {
    flex: 1,
    fontSize: configs.text.android.fontSize,
    fontFamily: configs.text.android.regular,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
    color: configs.colors.gray4,
  },
  showIcon: {
    marginRight: 10,
  },
});

export default TextInput;
