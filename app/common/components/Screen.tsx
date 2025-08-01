import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
  const refreshableScrollView = (
    <ScrollView
      style={styles.scrollView}
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
  );

  const staticView = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        {refreshable && onRefresh ? refreshableScrollView : staticView}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configs.colors.background,
  },
  gestureContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default Screen;
