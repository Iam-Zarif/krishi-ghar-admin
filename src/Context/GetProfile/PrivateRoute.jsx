import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./GetProfile";

const logo = "/photos/auth/brandLogo.svg";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { loading } = useContext(AuthContext);
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
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <img src={logo} className="w-20 mb-4" alt="Brand Logo" />
        <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-4">
          You need to login to access this page.
        </p>
        <Link
          to="/auth/login"
          className="text-white bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Login
        </Link>
      </div>
    );
  }
  

//  if (!profile) {
//    return (
//      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
//        <img src={logo} className="w-20 mb-4" alt="Brand Logo" />
//        <h2 className="text-2xl font-semibold mb-2">Profile Not Found</h2>
//        <p className="text-gray-600 mb-4">
//          You may have been logged out or your session expired.
//        </p>
//        <Link
//          to="/auth/login"
//          className="text-white bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
//        >
//          Login Again
//        </Link>
//      </div>
//    );
//  }

  return children;
};

export default PrivateRoute;
