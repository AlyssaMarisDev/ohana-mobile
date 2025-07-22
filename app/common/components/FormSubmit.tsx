import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { ViewStyle } from 'react-native';
import Button from './Button';
import Text from './Text';
import { useFormikContext } from 'formik';
import configs from '../config';

interface FormSubmitProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function FormSubmit({ title, style, textStyle }: FormSubmitProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button onPress={handleSubmit} style={style}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: configs.colors.white,
  },
});

export default FormSubmit;
