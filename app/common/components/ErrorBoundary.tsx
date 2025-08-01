import { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logger } from '@/app/common/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    if (this.state.error) {
      // In a real app, you might want to send this to your error reporting service
      logger.error('User reported error', this.state.error, {
        componentStack: this.state.errorInfo?.componentStack,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.reportButton]}
              onPress={this.handleReportError}
            >
              <Text style={styles.buttonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>

          {__DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <Text style={styles.debugText}>
                {this.state.error.toString()}
              </Text>
              {this.state.errorInfo?.componentStack && (
                <Text style={styles.debugText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  reportButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
});
