import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../public/photos/auth/brandLogo.svg";
import "react-phone-input-2/lib/style.css";
import Cookies from "js-cookie";
import { Api } from "../../../Api/Api";
import { AuthContext } from "../../../Context/GetProfile/GetProfile";

const Login = () => {
  const [phone, setPhone] = useState("");
const { profile, setProfile } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const navigate = useNavigate();


 useEffect(() => {
   if (profile) {
     navigate("/dashboard/dashboard");
   }
 }, [profile, navigate]);

  const handleLogin = async () => {
    if (!phone || !otp || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (otp !== "12345") {
      toast.error("Invalid OTP!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${Api}/api/v1/login`, {
        phone,
        password,
      });

      if (data.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        Cookies.set("token", data.token, { expires: 7 });
        setProfile(data.admin); 
        navigate("/dashboard/dashboard");
     
      } else {
        toast.error("Login failed. Please check your credentials.");
              setLoading(false);

      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
            setLoading(false);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen pb-16 adminLoginGradient items-center justify-center">
      <ToastContainer />

      <div className="w-full mx-auto">
        <img src={logo} className="w-24 mx-auto" alt="Brand Logo" />
        <p className="text-center text-4xl opacity-80 font-semibold mt-5">
          Admin Login
        </p>
        <div className="mt-12 px-4 max-w-sm text-sm lg:px-0 w-full mx-auto flex flex-col items-center gap-y-4">
          <div className="flex w-full flex-col text-sm items-center gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 items-end w-full lg:gap-x-4 gap-y-4">
              <div className="col-span-3">
                <input
                  type="text"
                  placeholder="Enter Your Phone"
                  className="py-2.5 text-md block w-full focus:outline-green-500 px-4 bg-[#eeeeec] rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="col-span-2 w-full">
                <button
                  className={`font-semibold text-sm bg-yellow-500 py-3 w-full rounded-xl ${
                    otpDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={otpDisabled}
                  onClick={() => {
                    toast.success("OTP Sent: 12345");
                    setOtpDisabled(true);
                  }}
                >
                  Get OTP
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter The OTP"
              className="py-2.5 text-md block w-full focus:outline-green-500 px-4 bg-[#eeeeec] rounded-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter The Password"
              className="py-2.5 text-md block w-full focus:outline-green-500 px-4 bg-[#eeeeec] rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className={`py-2.5 w-full cursor-pointer text-center mt-2 text-md block bg-green-700 text-white rounded-xl ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
