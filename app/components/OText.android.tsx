import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import configs from "../config";

type AppTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

function OText({ children, style, ...otherProps }: AppTextProps) {
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: configs.text.android.fontSize,
    fontFamily: configs.text.android.regular,
    color: configs.colors.black,
  },
});

export default OText;
