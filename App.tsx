import { AuthProvider } from "./app/context/AuthContext";
import { GlobalStateProvider } from "./app/context/GlobalStateContext";
import Navigation from "./app/screens/Navigation";

export default function App() {
  return (
    <GlobalStateProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </GlobalStateProvider>
  );
}
