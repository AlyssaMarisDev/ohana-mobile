import Screen from "../components/Screen";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import * as Yup from "yup";
import configs from "../config";
import FormSubmit from "../components/forms/FormSubmit";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    console.log(values);
    try {
      await login(values.email, values.password);
      setError(null);
      navigation.navigate("Home" as never);
    } catch (error: any) {
      setError(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField name="email" placeholder="Email" icon="email" />
        <FormField
          name="password"
          placeholder="Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <FormSubmit
          title="Login"
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </Form>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register" as never)}
          style={styles.registerLink}
        >
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  passwordInput: {
    marginTop: 15,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: "15%",
    marginBottom: "5%",
  },
  buttonText: {
    color: configs.colors.white,
  },
  button: {
    marginTop: 15,
  },
  link: {
    color: configs.colors.secondary,
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    textAlign: "center",
    fontSize: 16,
  },
  registerLink: {
    marginLeft: 5,
  },
  registerContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
