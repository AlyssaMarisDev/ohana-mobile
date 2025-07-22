import OErrorMessage from './ErrorMessage';
import TextInput from './TextInput';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface FormFieldProps<T> {
  name: keyof T;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'default' | 'auth' | 'modal' | 'inline';
  style?: ViewStyle;
  [key: string]: unknown;
}

function FormField<T>({
  name,
  placeholder,
  icon,
  variant = 'default',
  style,
  ...otherProps
}: FormFieldProps<T>) {
  const { handleChange, values, errors, touched } = useFormikContext<T>();

  const getVariantStyle = () => {
    switch (variant) {
      case 'auth':
        return styles.authField;
      case 'modal':
        return styles.modalField;
      case 'inline':
        return styles.inlineField;
      default:
        return styles.defaultField;
    }
  };

  return (
    <>
      <TextInput
        placeholder={placeholder}
        icon={icon}
        value={values[name] as string}
        onChangeText={handleChange(name as string)}
        style={[getVariantStyle(), style]}
        {...otherProps}
      />
      <OErrorMessage
        error={errors[name] as string}
        visible={touched[name] as boolean}
      />
    </>
  );
}

const styles = StyleSheet.create({
  defaultField: {
    // Default field styling
  },
  authField: {
    // Authentication field styling (larger, more prominent)
    height: 50,
    fontSize: 16,
    marginBottom: 10,
  },
  modalField: {
    // Modal field styling (compact, clean)
    height: 44,
    fontSize: 14,
    marginBottom: 8,
  },
  inlineField: {
    // Inline field styling (very compact)
    height: 36,
    fontSize: 12,
    marginBottom: 4,
  },
});

export default FormField;
