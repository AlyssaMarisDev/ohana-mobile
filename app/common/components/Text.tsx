import { Text as RNText, StyleSheet, StyleProp, TextStyle } from 'react-native';
import configs from '../config';

type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
};

function Text({ children, style, numberOfLines, ellipsizeMode }: TextProps) {
  return (
    <RNText
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: configs.text.ios.fontSize,
    fontFamily: configs.text.ios.regular,
    color: configs.colors.black,
  },
});

export default Text;
