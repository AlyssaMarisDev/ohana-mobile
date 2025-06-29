import { StyleProp, TextStyle } from "react-native";
import { ViewStyle } from "react-native";
import OButton from "../OButton";
import OText from "../OText.ios";
import { useFormikContext } from "formik";

interface OFormSubmitProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function OFormSubmit({ title, style, textStyle }: OFormSubmitProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <OButton onPress={handleSubmit} style={style}>
      <OText style={textStyle}>{title}</OText>
    </OButton>
  );
}

export default OFormSubmit;
