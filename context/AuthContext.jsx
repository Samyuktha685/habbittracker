import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  isFirebaseConfigured
} from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [demoUser, setDemoUser] = useState(() => {
    try {
      const saved = localStorage.getItem("habbit_tracker_demo_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            isDemo: false
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo mode session handler
      if (demoUser) {
        setCurrentUser(demoUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    }
  }, [demoUser]);

  // Format Firebase Error messages to human-readable text
  const formatFirebaseError = (error) => {
    const code = error?.code || error?.message || "";
    if (code.includes("auth/email-already-in-use")) return "This email is already registered. Please login instead.";
    if (code.includes("auth/invalid-email")) return "Please enter a valid email address.";
    if (code.includes("auth/weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("auth/wrong-password") || code.includes("auth/invalid-credential")) return "Invalid email or password. Please try again.";
    if (code.includes("auth/user-not-found")) return "No account found with this email.";
    if (code.includes("auth/too-many-requests")) return "Too many failed attempts. Please try again later.";
    if (code.includes("auth/network-request-failed")) return "Network error. Please check your internet connection.";
    return error.message || "An authentication error occurred.";
  };

  const signup = async (email, password) => {
    setAuthError("");
    if (isFirebaseConfigured) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        return res.user;
      } catch (err) {
        const msg = formatFirebaseError(err);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo Mode Registration
      const mockUser = {
        uid: "demo-user-" + btoa(email).substring(0, 10),
        email: email,
        isDemo: true
      };
      localStorage.setItem("habbit_tracker_demo_user", JSON.stringify(mockUser));
      setDemoUser(mockUser);
      setCurrentUser(mockUser);
      return mockUser;
    }
  };

  const login = async (email, password) => {
    setAuthError("");
    if (isFirebaseConfigured) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      } catch (err) {
        const msg = formatFirebaseError(err);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo Mode Login
      const mockUser = {
        uid: "demo-user-" + btoa(email).substring(0, 10),
        email: email,
        isDemo: true
      };
      localStorage.setItem("habbit_tracker_demo_user", JSON.stringify(mockUser));
      setDemoUser(mockUser);
      setCurrentUser(mockUser);
      return mockUser;
    }
  };

  const logout = async () => {
    setAuthError("");
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Logout error", err);
      }
    }
    localStorage.removeItem("habbit_tracker_demo_user");
    setDemoUser(null);
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    setAuthError("");
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (err) {
        const msg = formatFirebaseError(err);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo mode reset email simulation
      return true;
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    setAuthError,
    signup,
    login,
    logout,
    resetPassword,
    isFirebaseConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
