import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
// import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import configs from '../config';

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Screen({ children, style }: ScreenProps) {
  return (
    <GestureHandlerRootView>
      <View style={[styles.container, style]}>{children}</View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.white,
  },
});

export default Screen;
