import { useContext, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./Context/GetProfile/GetProfile";
import Navbar from "./shared/Navbar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../public/photos/auth/brandLogo.svg";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const isAuthRoute = location.pathname.startsWith("/auth");

  useEffect(() => {
    if (loading) return;

    if (!token && !isAuthRoute) {
      navigate("/auth/login");
    }
  }, [isAuthRoute, loading, navigate, token]);

  if (loading && token && !isAuthRoute) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <img src={logo} className="w-24 animate-pulse" alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
