import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/context/AuthContext';
import LoginScreen from '../auth/screens/LoginScreen';
import RegisterScreen from '../auth/screens/RegisterScreen';
import HamburgerMenu from '../../common/components/HamburgerMenu';
import Sidebar from '../sidebar/Sidebar';
import { ActivityIndicator, View } from 'react-native';
import configs from '../../common/config';
import TodayScreen from '../today/screens/TodayScreen';
import ProfileScreen from '../profile/screens/ProfileScreen';
import HouseholdTasksScreen from '../households/screens/HouseholdTasksScreen';

// Wrapper component that can access navigation
function NavigationContent() {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigation = useNavigation();

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  const handleHamburgerPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const handleSidebarProfilePress = () => {
    setIsSidebarVisible(false); // Close sidebar
    navigation.navigate('Profile' as never); // Navigate to profile
  };

  const handleSidebarTodayPress = () => {
    setIsSidebarVisible(false); // Close sidebar
    navigation.navigate('Today' as never); // Navigate to today
  };

  const handleSidebarHouseholdPress = (householdId: string) => {
    setIsSidebarVisible(false); // Close sidebar
    (navigation as any).navigate('HouseholdTasks', { householdId }); // Navigate to household tasks
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Today' : 'Login'}
        screenOptions={{
          headerShown: isAuthenticated, // Only show header for authenticated screens
          headerLeft: () => <HamburgerMenu onPress={handleHamburgerPress} />,
          headerStyle: {
            backgroundColor: configs.colors.background,
          },
          headerTransparent: false, // This ensures header takes up space
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: configs.colors.textPrimary,
          },
          headerBackVisible: false, // Hide back button for cleaner look
          headerShadowVisible: false, // Remove the horizontal line/shadow
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Today"
          component={TodayScreen}
          options={{
            title: 'Today',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="HouseholdTasks"
          component={HouseholdTasksScreen}
          options={{
            title: 'Household Tasks',
          }}
        />
      </Stack.Navigator>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={handleSidebarClose}
        onProfilePress={handleSidebarProfilePress}
        onTodayPress={handleSidebarTodayPress}
        onHouseholdPress={handleSidebarHouseholdPress}
      />
    </View>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <NavigationContent />
    </NavigationContainer>
  );
}

export default Navigation;
