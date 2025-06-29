import Screen from "../components/Screen";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import OForm from "../components/forms/OForm";
import OFormField from "../components/forms/OFormField";
import * as Yup from "yup";
import configs from "../config";
import OFormSubmit from "../components/forms/OFormSubmit";
import OText from "../components/OText.ios";
import { useNavigation } from "@react-navigation/native";
import { login, register } from "../api/auth";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

function RegisterScreen() {
  const navigation = useNavigation();
  const { token, setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log(values);
    try {
      const response = await register(
        values.name,
        values.email,
        values.password
      );
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
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <OFormField name="name" placeholder="Name" icon="account" />
        <OFormField
          name="email"
          placeholder="Email"
          icon="email"
          style={styles.emailInput}
        />
        <OFormField
          name="password"
          placeholder="Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <OFormField
          name="confirmPassword"
          placeholder="Confirm Password"
          icon="lock"
          secureTextEntry={true}
          style={styles.passwordInput}
          includeShowIcon={true}
        />
        <OFormSubmit
          title="Register"
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </OForm>
      {error && <OText>{error}</OText>}
      {token && <OText>{token}</OText>}
      <View style={styles.registerContainer}>
        <OText style={styles.registerText}>Already have an account?</OText>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login" as never)}
          style={styles.registerLink}
        >
          <OText style={styles.link}>Login</OText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    alignSelf: "center",
    marginTop: "15%",
    marginBottom: "5%",
  },
  buttonText: {
    color: configs.colors.white,
  },
  button: {
    marginTop: 15,
    backgroundColor: configs.colors.primary,
  },
  registerContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  registerText: {
    textAlign: "center",
    fontSize: 16,
  },
  registerLink: {
    marginLeft: 5,
  },
  link: {
    color: configs.colors.secondary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegisterScreen;
