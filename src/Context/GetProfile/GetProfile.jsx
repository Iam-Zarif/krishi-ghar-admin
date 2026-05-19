import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Api } from "../../Api/Api";

export const AuthContext = createContext();

const clearStoredSession = () => {
  localStorage.removeItem("token");
  Cookies.remove("token");
  Cookies.remove("session");
  delete axios.defaults.headers.common["Authorization"];
};

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
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${Api}/api/v1/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const adminProfile = response.data?.admin || response.data;
        if (!adminProfile?._id && !adminProfile?.id) {
          clearStoredSession();
          setProfile(null);
          setError("Profile not found");
          return;
        }
        setProfile(adminProfile);
        setError(null);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
        if ([401, 403, 404].includes(err.response?.status)) {
          clearStoredSession();
        }
        setProfile(null);
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
      await axios.post(
        `${Api}/api/v1/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      clearStoredSession();
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
