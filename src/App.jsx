import { useContext, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./Context/GetProfile/GetProfile";
import Navbar from "./shared/Navbar/Navbar";
import { ChatProvider } from "./Context/ChatContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const logo = "/photos/auth/brandLogo.svg";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const isAuthRoute = location.pathname.startsWith("/auth");

  useEffect(() => {
    if (loading) return;

    if (token && profile && isAuthRoute) {
      navigate("/", { replace: true });
      return;
    }

    if (!token && !isAuthRoute) {
      navigate("/auth/login", { replace: true });
    }
  }, [isAuthRoute, loading, navigate, profile, token]);

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
      <ChatProvider>
        <Outlet />
      </ChatProvider>
    </>
  );
}

export default App;
