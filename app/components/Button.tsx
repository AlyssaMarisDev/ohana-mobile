import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import configs from "../config";
import Text from "./Text";

interface ButtonProps {
  onPress: (arg0: any) => void;
  children?: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

function Button({
  children,
  color,
  style,
  onPress,
  activeOpacity = 0.7,
  ...otherProps
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      {...otherProps}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: configs.colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
  },
  buttonText: {
    color: configs.colors.white,
  },
});

export default Button;
