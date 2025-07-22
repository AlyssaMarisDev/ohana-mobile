import { Formik, FormikHelpers, FormikValues } from 'formik';
import React from 'react';
import { Schema } from 'yup';

interface FormProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<void>;
  validationSchema?: Schema<T>;
  children: React.ReactNode;
}

function Form<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: FormProps<T>) {
  return (
    <Formik<T>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
}

export default Form;
