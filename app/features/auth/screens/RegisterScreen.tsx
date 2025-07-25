import Screen from '../../../common/components/Screen';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Form from '../../../common/components/Form';
import FormField from '../../../common/components/FormField';
import * as Yup from 'yup';
import configs from '../../../common/config';
import FormSubmit from '../../../common/components/FormSubmit';
import Text from '../../../common/components/Text';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await register(values.name, values.email, values.password);
      setError(null);
      navigation.navigate('Today' as never);
    } catch (error: any) {
      setError(
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <Image
        source={require('../../../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Form
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField name="name" placeholder="Name" icon="account" />
        <FormField
          name="email"
          placeholder="Email"
          icon="email"
          style={styles.emailInput}
        />
        <FormField
          name="password"
          placeholder="Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <FormField
          name="confirmPassword"
          placeholder="Confirm Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <FormSubmit title="Register" style={styles.button} />
      </Form>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login' as never)}
          style={styles.registerLink}
        >
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '30%',
  },
  emailInput: {
    marginTop: 15,
  },
  passwordInput: {
    marginTop: 15,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: '15%',
    marginBottom: '5%',
  },
  button: {
    marginTop: 15,
    backgroundColor: configs.colors.primary,
  },
  registerContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 16,
    color: configs.colors.textSecondary,
  },
  registerLink: {
    marginLeft: 5,
  },
  link: {
    color: configs.colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: configs.colors.danger,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RegisterScreen;
