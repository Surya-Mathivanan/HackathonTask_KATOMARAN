import React, { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { app, initCrashlytics } from "../firebase/config";

const AppWrapper = ({ children }) => {
  useEffect(() => {
    // Initialize Firebase and Crashlytics when the app starts
    if (app) {
      console.log("Firebase initialized successfully");
      initCrashlytics();
    }
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
};

export default AppWrapper;
