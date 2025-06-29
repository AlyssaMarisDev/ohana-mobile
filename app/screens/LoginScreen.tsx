import Screen from "../components/Screen";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import OForm from "../components/forms/OForm";
import OFormField from "../components/forms/OFormField";
import * as Yup from "yup";
import configs from "../config";
import OFormSubmit from "../components/forms/OFormSubmit";
import OText from "../components/OText.ios";
import { useNavigation } from "@react-navigation/native";
import { login } from "../api/auth";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginScreen() {
  const navigation = useNavigation();
  const { token, setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    console.log(values);
    try {
      const response = await login(values.email, values.password);
      setToken(response);
      setError(null);
    } catch (error: any) {
      setError(error.response.data);
      setToken(null);
    }
  };

  return (
    <Screen style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <OForm
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <OFormField name="email" placeholder="Email" icon="email" />
        <OFormField
          name="password"
          placeholder="Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <OFormSubmit
          title="Login"
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </OForm>
      {error && <OText>{error}</OText>}
      {token && <OText>{token}</OText>}
      <View style={styles.registerContainer}>
        <OText style={styles.registerText}>Don't have an account?</OText>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register" as never)}
          style={styles.registerLink}
        >
          <OText style={styles.link}>Register</OText>
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
});

export default LoginScreen;
