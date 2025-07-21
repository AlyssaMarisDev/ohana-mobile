import { AuthProvider } from "./app/context/AuthContext";
import { GlobalStateProvider } from "./app/context/GlobalStateContext";
import Navigation from "./app/screens/Navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStateProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </GlobalStateProvider>
    </QueryClientProvider>
  );
}
