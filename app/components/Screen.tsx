import { useState } from "react";
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Screen({ children, style }: ScreenProps) {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Screen;
