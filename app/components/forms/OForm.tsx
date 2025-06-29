import { Formik, FormikHelpers, FormikValues } from "formik";
import React from "react";
import { Schema } from "yup";

interface OFormProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<void>;
  validationSchema?: Schema<T>;
  children: React.ReactNode;
}

function OForm<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: OFormProps<T>) {
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

export default OForm;
