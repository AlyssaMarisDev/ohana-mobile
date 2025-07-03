import { AuthProvider } from "./app/context/AuthContext";
import Navigation from "./app/screens/Navigation";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
