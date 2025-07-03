import OErrorMessage from "../ErrorMessage";
import TextInput from "../TextInput";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

interface FormFieldProps<T> {
  name: keyof T;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  [key: string]: unknown;
}

function FormField<T>({
  name,
  placeholder,
  icon,
  ...otherProps
}: FormFieldProps<T>) {
  const { handleChange, values, errors, touched } = useFormikContext<T>();

  return (
    <>
      <TextInput
        placeholder={placeholder}
        icon={icon}
        value={values[name] as string}
        onChangeText={handleChange(name as string)}
        {...otherProps}
      />
      <OErrorMessage
        error={errors[name] as string}
        visible={touched[name] as boolean}
      />
    </>
  );
}

export default FormField;
