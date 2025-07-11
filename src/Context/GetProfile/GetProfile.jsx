import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Api } from "../../Api/Api";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${Api}/api/v1/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("Admin Profile:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]); 

  const logout = async () => {
    try {
      await axios.post(`${Api}/api/v1/logout`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.removeItem("token");
      Cookies.remove("token");
      Cookies.remove("session");
      window.location.href = "/auth/login";
      setProfile(null);
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ profile, loading, error, logout, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
