import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, globalStyles } from "../constants/GlobalStyles";
import { useAuth } from "../context/AuthContext";

function SignUpScreen() {
  const router = useRouter();
  const { signup, error, setError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputFocused, setInputFocused] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password);
      router.replace("/task-list");
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.authContainer}>
      <View style={globalStyles.authCard}>
        <View style={globalStyles.authHeader}>
          <Image
            source={require("../assets/images/icon.png")}
            style={{
              width: 48,
              height: 48,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />
          <Text style={globalStyles.authTitle}>Create your account</Text>
          <Text style={globalStyles.authSubtitle}>
            Start organizing your tasks today
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

            <TextInput
              style={[
                globalStyles.input,
                inputFocused === "email" && globalStyles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor={colors.text.tertiary}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setInputFocused("email")}
              onBlur={() => setInputFocused("")}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={[
                globalStyles.input,
                inputFocused === "password" && globalStyles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor={colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setInputFocused("password")}
              onBlur={() => setInputFocused("")}
              secureTextEntry
            />

            <TextInput
              style={[
                globalStyles.input,
                inputFocused === "confirmPassword" && globalStyles.inputFocused,
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text.tertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setInputFocused("confirmPassword")}
              onBlur={() => setInputFocused("")}
              secureTextEntry
            />

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonPrimary]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  globalStyles.buttonTextPrimary,
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              <Text style={{ color: colors.text.secondary }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={globalStyles.link}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default SignUpScreen;
