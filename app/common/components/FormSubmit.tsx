import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Button from './Button';
import Text from './Text';
import { useFormikContext } from 'formik';
import configs from '../config';

interface FormSubmitProps {
  title: string;
  variant?: 'default' | 'auth' | 'modal' | 'inline';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function FormSubmit({
  title,
  variant = 'default',
  style,
  textStyle,
}: FormSubmitProps) {
  const { handleSubmit } = useFormikContext();

  const getVariantStyle = () => {
    switch (variant) {
      case 'auth':
        return styles.authButton;
      case 'modal':
        return styles.modalButton;
      case 'inline':
        return styles.inlineButton;
      default:
        return styles.defaultButton;
    }
  };

  const getTextVariantStyle = () => {
    switch (variant) {
      case 'auth':
        return styles.authButtonText;
      case 'modal':
        return styles.modalButtonText;
      case 'inline':
        return styles.inlineButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  return (
    <Button onPress={handleSubmit} style={[getVariantStyle(), style]}>
      <Text style={[getTextVariantStyle(), textStyle]}>{title}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  defaultButton: {
    // Default button styling
  },
  authButton: {
    // Authentication button styling (large, prominent)
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  modalButton: {
    // Modal button styling (compact, clean)
    height: 44,
    borderRadius: 8,
    marginTop: 8,
  },
  inlineButton: {
    // Inline button styling (very compact)
    height: 36,
    borderRadius: 6,
    marginTop: 4,
  },
  defaultButtonText: {
    color: configs.colors.white,
  },
  authButtonText: {
    color: configs.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonText: {
    color: configs.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  inlineButtonText: {
    color: configs.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FormSubmit;
