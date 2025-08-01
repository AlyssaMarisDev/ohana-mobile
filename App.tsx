import { AuthProvider } from './app/features/auth/context/AuthContext';
import { GlobalStateProvider } from './app/common/context/GlobalStateContext';
import Navigation from './app/features/navigation/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './app/common/components/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          </GlobalStateProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
