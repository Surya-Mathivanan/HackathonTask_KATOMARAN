import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      if (user) {
        console.log("User ID:", user.uid);
        // Store user info in AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        // Clear user info from AsyncStorage
        await AsyncStorage.removeItem("user");
      }
      setCurrentUser(user);
      setLoading(false);
    });

    // Check for stored user on mount
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser && !currentUser) {
          console.log("Found stored user:", JSON.parse(storedUser));
          // If we have a stored user but no current user, sign out to force re-auth
          await signOut(auth);
        }
      } catch (error) {
        console.error("Error checking stored user:", error);
      }
    };
    checkStoredUser();

    return unsubscribe;
  }, []);

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError("");
      console.log("Attempting login for:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, user:", result.user.uid);
      return result;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError("");
      console.log("Attempting signup for:", email);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Signup successful, user:", result.user.uid);
      return result;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError("");
      console.log("Attempting Google sign in");

      const isWeb = typeof document !== "undefined";
      let result;

      if (isWeb) {
        const provider = new GoogleAuthProvider();
        result = await signInWithPopup(auth, provider);
      } else {
        // TODO: Implement Expo Google sign-in using expo-auth-session/providers/google
        // See: https://docs.expo.dev/guides/authentication/
        throw new Error(
          "Expo Google sign-in not yet implemented. Please use expo-auth-session/providers/google."
        );
      }

      console.log("Google sign in successful, user:", result.user.uid);
      return result;
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setError("");
      console.log("Attempting Facebook sign in");
      const isWeb = typeof document !== "undefined";
      let result;
      if (isWeb) {
        const provider = new FacebookAuthProvider();
        result = await signInWithPopup(auth, provider);
      } else {
        throw new Error("Native Facebook sign-in not implemented");
      }
      console.log("Facebook sign in successful, user:", result.user.uid);
      return result;
    } catch (err) {
      console.error("Facebook sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Twitter
  const signInWithTwitter = async () => {
    try {
      setError("");
      console.log("Attempting Twitter sign in");
      const isWeb = typeof document !== "undefined";
      let result;
      if (isWeb) {
        const provider = new TwitterAuthProvider();
        result = await signInWithPopup(auth, provider);
      } else {
        throw new Error("Native Twitter sign-in not implemented");
      }
      console.log("Twitter sign in successful, user:", result.user.uid);
      return result;
    } catch (err) {
      console.error("Twitter sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      console.log("Attempting logout");
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    logout,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
