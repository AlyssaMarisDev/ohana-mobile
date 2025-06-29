import OErrorMessage from "../OErrorMessage";
import OTextInput from "../OTextInput";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

interface OFormFieldProps<T> {
  name: keyof T;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  [key: string]: unknown;
}

function OFormField<T>({
  name,
  placeholder,
  icon,
  ...otherProps
}: OFormFieldProps<T>) {
  const { handleChange, values, errors, touched } = useFormikContext<T>();

  return (
    <>
      <OTextInput
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

export default OFormField;
