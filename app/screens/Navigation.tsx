import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeScreen from "./HomeScreen";
import { ActivityIndicator } from "react-native";

function Navigation() {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
