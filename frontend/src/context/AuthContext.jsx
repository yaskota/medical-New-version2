import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, registerUser, verifyOTP } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("healthcare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("healthcare_user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    const res = await registerUser(data);
    return res;
  };

  const verify = async (data) => {
    const res = await verifyOTP(data);
    return res;
  };

  const login = async (data) => {
    const res = await loginUser(data);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem("healthcare_user", JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    localStorage.removeItem("healthcare_user");
  };

  const value = {
    user,
    setUser,
    loading,
    register,
    verify,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
