import { Formik, FormikHelpers, FormikValues } from 'formik';
import React from 'react';
import { Schema } from 'yup';
import { StyleSheet, View, ViewStyle } from 'react-native';

type FormVariant = 'default' | 'auth' | 'modal' | 'inline';

interface FormProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<void>;
  validationSchema?: Schema<T>;
  children: React.ReactNode;
  variant?: FormVariant;
  style?: ViewStyle;
}

function Form<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  variant = 'default',
  style,
}: FormProps<T>) {
  return (
    <Formik<T>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => (
        <View style={[styles.container, styles[variant], style]}>
          {children}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  default: {
    // Default form styling
  },
  auth: {
    // Authentication form styling (login/register)
    padding: 20,
    gap: 15,
  },
  modal: {
    // Modal form styling (task updates, etc.)
    padding: 16,
    gap: 12,
  },
  inline: {
    // Inline form styling (compact)
    gap: 8,
  },
});

export default Form;
