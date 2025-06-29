import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import configs from "../config";

interface OButtonProps {
  onPress: (arg0: any) => void;
  children?: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

function OButton({
  children,
  color,
  style,
  onPress,
  activeOpacity = 0.7,
  ...otherProps
}: OButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      {...otherProps}
    >
      {children}
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
});

export default OButton;
