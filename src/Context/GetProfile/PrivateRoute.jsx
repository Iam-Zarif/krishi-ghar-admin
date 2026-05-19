import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./GetProfile";

const logo = "/photos/auth/brandLogo.svg";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { loading, profile } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={logo} className="animate-pulse" alt="Loading..." />
      </div>
    );
  }
  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  

  if (!profile) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
