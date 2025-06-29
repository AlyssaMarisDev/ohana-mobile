import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import configs from "../config";

type OTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

function OText({ children, style, ...otherProps }: OTextProps) {
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: configs.text.ios.fontSize,
    fontFamily: configs.text.ios.regular,
    color: configs.colors.black,
  },
});

export default OText;
