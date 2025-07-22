import Text from './Text';
import configs from '../config';
import { StyleSheet } from 'react-native';

interface OErrorMessageProps {
  error: string;
  visible: boolean;
}

function OErrorMessage({ error, visible }: OErrorMessageProps) {
  if (!visible || !error) return null;
  return <Text style={styles.error}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: configs.colors.danger,
  },
});

export default OErrorMessage;
