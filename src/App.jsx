import { useContext, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./Context/GetProfile/GetProfile";
import Navbar from "./shared/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    if (profile === null) {
      navigate("/auth/login");
    }
  }, [profile, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
