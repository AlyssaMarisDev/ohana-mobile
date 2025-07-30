import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
// import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import configs from '../config';

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  refreshable?: boolean;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
};

function Screen({
  children,
  style,
  refreshable = false,
  onRefresh,
  refreshing = false,
}: ScreenProps) {
  if (refreshable && onRefresh) {
    return (
      <GestureHandlerRootView>
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[configs.colors.primary]}
              tintColor={configs.colors.primary}
            />
          }
        >
          {children}
        </ScrollView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, style]}>{children}</View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default Screen;
