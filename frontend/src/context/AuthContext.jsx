import React from "react";

import {
  registerUser,
  loginUser,
  verifyAccountOTP,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Check whether the user is logged in or not
  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication when app starts
  React.useEffect(() => {
    checkAuth();
  }, []);

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  // Verify account OTP
  const verifyAccount = async (otpData) => {
    const data = await verifyAccountOTP(otpData);
    return data;
  };

  // Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setUser(data.user);

    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        register,
        verifyAccount,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return React.useContext(AuthContext);
};

