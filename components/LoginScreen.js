import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, globalStyles } from "../constants/GlobalStyles";
import { useAuth } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

function LoginScreen() {
  const router = useRouter();
  const {
    login,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    error,
    setError,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputFocused, setInputFocused] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userJSON = await AsyncStorage.getItem("user");
        if (userJSON) {
          router.replace("/task-list");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      await AsyncStorage.setItem("user", JSON.stringify({ email }));
      router.replace("/task-list");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Check if running on web platform
      const isWeb = typeof document !== "undefined";

      // Show a more specific error message for web users if needed
      if (isWeb) {
        console.log("Using Firebase web authentication for Google Sign-In");
      } else {
        console.log("Using native Google Sign-In");
      }

      const result = await signInWithGoogle();
      console.log(
        "Sign-in successful:",
        result.user ? "User exists" : "No user data"
      );

      if (result && result.user) {
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        console.log("Saving user data to AsyncStorage");
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        console.log("Navigating to task list");
        router.replace("/task-list");
      } else {
        console.error("Sign-in succeeded but no user data returned");
        Alert.alert(
          "Login Error",
          "Failed to get user information. Please try again."
        );
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);

      // Handle different types of errors with specific messages
      if (
        error.message &&
        error.message.includes("not-implemented method on web platform")
      ) {
        Alert.alert(
          "Google Sign-In Not Available",
          "Google Sign-In is not available on web platform in this version. Please use email/password login instead."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        Alert.alert(
          "Sign-In Cancelled",
          "You closed the sign-in window before completing authentication."
        );
      } else if (error.code === "auth/network-request-failed") {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else if (error.code === "auth/popup-blocked") {
        Alert.alert(
          "Popup Blocked",
          "The sign-in popup was blocked by your browser. Please allow popups for this site."
        );
      } else {
        Alert.alert(
          "Google Sign-In Failed",
          error.message || "An unknown error occurred"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const navigateToSignUp = () => {
    router.push("/sign-up");
  };

  // Handle login response - Commented out for now to fix dependency issues
  // Simplified version that just redirects to task list
  const handleLoginResponse = (response) => {
    setIsLoading(false);
    console.log("Login response received, redirecting to task list");
    router.replace("/task-list");
  };

  /* Original implementation - kept for reference
  const handleLoginResponseOriginal = async (response) => {
    setIsLoading(false);
    console.log('Handling login response:', JSON.stringify(response, null, 2));
    
    if (response?.type === 'success') {
      try {
        // Get the access token
        const accessToken = response.authentication?.accessToken || response.params?.access_token;
        
        if (!accessToken) {
          console.error('No access token found in response', response);
          Alert.alert('Login Error', 'Could not retrieve access token');
          return;
        }
        
        console.log('Successfully obtained access token');
        
        // Fetch user info using the access token
        try {
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/userinfo/v2/me',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          if (!userInfoResponse.ok) {
            throw new Error(`Failed to fetch user info: ${userInfoResponse.status}`);
          }
          
          const userInfo = await userInfoResponse.json();
          console.log('User info retrieved:', userInfo);
        
          // Show user info in an alert
          Alert.alert(
            'Login Successful',
            `Welcome ${userInfo.name}!\nEmail: ${userInfo.email}`,
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Navigate to task-list screen on success
                  router.replace('/task-list');
                },
              },
            ]
          );
        } catch (fetchError) {
          console.error('Error fetching user info:', fetchError);
          Alert.alert(
            'Login Successful',
            'Could not retrieve your profile information, but you are logged in.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Navigate to task-list screen on success despite fetch error
                  router.replace('/task-list');
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error in login process:', error);
        Alert.alert('Login Error', 'There was a problem with the login process. Please try again.');
      }
    } else if (response?.type === 'cancel') {
      // User cancelled the login flow
      Alert.alert('Login Cancelled', 'You cancelled the login process.');
    } else {
      // Show error message
      Alert.alert('Login Failed', response?.error?.message || 'Could not complete login');
    }
  };
  */

  // Login handlers - Simplified for now to bypass authentication
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Bypassing Google login for now");

      // Simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/task-list");
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
      Alert.alert(
        "Login Error",
        "There was a problem connecting to Google. Please try again later."
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      // The original code used AppleAuthProvider and signInWithPopup, but these are not imported.
      // Assuming a placeholder for Apple Sign-In or that it's handled differently.
      // For now, we'll just simulate a successful login for Apple.
      const userData = {
        email: "apple@example.com", // Placeholder email
        displayName: "Apple User", // Placeholder name
        photoURL: "https://via.placeholder.com/50", // Placeholder photo
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      router.replace("/task-list");
    } catch (error) {
      console.error("Apple login error:", error);
      Alert.alert(
        "Login Error",
        error.message || "An error occurred during Apple sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithFacebook();
      if (result && result.user) {
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        router.replace("/task-list");
      } else {
        Alert.alert(
          "Login Error",
          "Failed to get user information. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Facebook Sign-In Failed",
        error.message || "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithTwitter();
      if (result && result.user) {
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        router.replace("/task-list");
      } else {
        Alert.alert(
          "Login Error",
          "Failed to get user information. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Twitter Sign-In Failed",
        error.message || "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual sign in
  const handleManualSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email/username and password");
      return;
    }

    // Simulate login - just show the entered credentials
    Alert.alert(
      "Sign In Attempt",
      `Attempting to sign in with:\nEmail/Username: ${email}\nPassword: ${password}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Simulate successful login
            router.replace("/task-list");
          },
        },
      ]
    );
  };

  return (
    <View style={globalStyles.authContainer}>
      <View style={globalStyles.authCard}>
        <View style={globalStyles.authHeader}>
          {/* <Image
            source={require("../assets/images/icon.png")}
            style={{
              width: 48,
              height: 48,
              alignSelf: "center",
              marginBottom: 16,
            }} */}

          <Text style={globalStyles.authTitle}>Welcome back</Text>
          <Text style={globalStyles.authSubtitle}>
            Sign in to continue to your workspace
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <View>
            <TouchableOpacity
              style={[
                globalStyles.socialButton,
                { backgroundColor: colors.button.google },
              ]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={20} color="white" />
              <Text style={[globalStyles.buttonText, { color: "white" }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[
                globalStyles.socialButton,
                { backgroundColor: colors.button.apple },
              ]}
              onPress={handleAppleLogin}
            >
              <Ionicons name="logo-apple" size={20} color="white" />
              <Text style={[globalStyles.buttonText, { color: "white" }]}>
                Continue with Apple
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[
                globalStyles.socialButton,
                { backgroundColor: colors.button.facebook },
              ]}
              onPress={handleFacebookLogin}
              disabled={isLoading}
            >
              <Ionicons name="logo-facebook" size={20} color="white" />
              <Text style={[globalStyles.buttonText, { color: "white" }]}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.socialButton,
                { backgroundColor: colors.button.twitter },
              ]}
              onPress={handleTwitterLogin}
              disabled={isLoading}
            >
              <Ionicons name="logo-twitter" size={20} color="white" />
              <Text style={[globalStyles.buttonText, { color: "white" }]}>
                Continue with X
              </Text>
            </TouchableOpacity>

            <View style={globalStyles.dividerWithText}>
              <View style={globalStyles.dividerLine} />
              <Text style={globalStyles.dividerText}>
                or continue with email
              </Text>
              <View style={globalStyles.dividerLine} />
            </View>

            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

            <TextInput
              style={[
                globalStyles.input,
                inputFocused === "email" && globalStyles.inputFocused,
              ]}
              placeholder="Email or Username"
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

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonPrimary]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  globalStyles.buttonTextPrimary,
                ]}
              >
                Sign in
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
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/sign-up")}>
                <Text style={globalStyles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default LoginScreen;
