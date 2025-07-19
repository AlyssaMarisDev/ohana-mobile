import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ProfileHeader from "../components/ProfileHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { ActivityIndicator, View } from "react-native";
import configs from "../config";
import TodayScreen from "./TodayScreen";

function Navigation() {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  const handleProfilePress = () => {
    // Navigate to profile screen or open profile modal
    console.log("Profile pressed");
  };

  const handleHamburgerPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "Today" : "Login"}
          screenOptions={{
            headerShown: isAuthenticated, // Only show header for authenticated screens
            headerLeft: () => <HamburgerMenu onPress={handleHamburgerPress} />,
            headerRight: () => (
              <ProfileHeader
                onProfilePress={handleProfilePress}
                // profileImageUrl="https://example.com/user-avatar.jpg" // Add user's profile image URL here
              />
            ),
            headerStyle: {
              backgroundColor: configs.colors.white,
            },
            headerTransparent: false, // This ensures header takes up space
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "600",
              color: "#000",
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
              title: "Today",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Sidebar */}
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />
    </View>
  );
}

export default Navigation;
