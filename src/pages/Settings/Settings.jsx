import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaCamera,
  FaUserLock,
  FaLaptop,
  FaMobileAlt,
  FaDesktop,
  FaPhone,
  FaChrome,
  FaFirefoxBrowser,
  FaSafari,
} from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const CustomDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div
        className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-200"
        onClick={handleToggle}
      >
        <span className="w-full">{value}</span>
        <span className="ml-2 text-gray-500">&#9660;</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 bg-white shadow-lg rounded-lg w-full mt-1 border border-gray-300">
          {options?.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const[otpVerified, setOtpVerified] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Super Admin",
    phone: "+1234567890",
    email: "superadmin@example.com",
    role: "Super Admin",
    username: "superadmin123",
    password: "",
    confirmPassword: "",
    photo:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    notifications: true,
    accountStatus: "Active",
    sessionTimeout: 30,
    apiKeys: "Your-API-Key-Here",
    loginHistory: [
      {
        date: "2025-02-21",
        device: "Laptop",
        ip: "192.168.1.1",
        location: "Dhaka, Bangladesh",
      },
      {
        date: "2025-02-20",
        device: "Mobile",
        ip: "192.168.1.2",
        location: "Dhaka, Bangladesh",
      },
      {
        date: "2025-02-18",
        device: "Desktop",
        ip: "192.168.1.3",
        location: "Chittagong, Bangladesh",
      },
    ],
  });

 const handleOtpSubmit = () => {
   setOtpVerified(true); // Change this based on the actual OTP logic
 };


  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleToggle = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData({ ...adminData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Profile updated successfully!");
  };



  return (
    <div className="grid grid-cols-12 items-start gap-6">
      <div className="p-8 col-span-6 shadow-xl rounded-xl   mt-2 bg-white border-t-4 border-green-500">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Super Admin Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="photo" className="cursor-pointer relative">
              <img
                src={adminData.photo}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              <FaCamera className="absolute bottom-0 right-0 text-white bg-black p-2 rounded-full shadow-md text-3xl" />
            </label>
            <input
              type="file"
              id="photo"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-6 border-b-2 border-gray-200 pb-6">
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaUser className="text-gray-600 mr-3" />
              <input
                type="text"
                name="name"
                value={adminData.name}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="Admin Name"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaUser className="text-gray-600 mr-3" />
              <input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="Admin Email"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaUserLock className="text-gray-600 mr-3" />
              <input
                type="text"
                name="role"
                value={adminData.role}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="Admin Role"
                disabled
              />
            </div>
          </div>

          <div className="space-y-6 border-b-2 border-gray-200 pb-6">
            <p className="font-bold text-yellow-600">Change Password?</p>

            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaPhone className="text-gray-600 mr-3" />
              <input
                type="text"
                name="phoneNumber"
                value={adminData.phoneNumber}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="Phone Number"
                required
              />
            </div>

            {otpVerified ? (
              <>
                <div className="flex items-center border border-gray-300 rounded-lg p-3">
                  <FaLock className="text-gray-600 mr-3" />
                  <input
                    type="password"
                    name="password"
                    value={adminData.password}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    placeholder="New Password"
                  />
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg p-3">
                  <FaLock className="text-gray-600 mr-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={adminData.confirmPassword}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    placeholder="Confirm Password"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-centerr space-x-4">
                <input
                  type="text"
                  name="otp"
                  value={adminData.otp}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full"
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  className="bg-green-600 text-sm text-white w-32  rounded-lg"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 border-b-2 border-gray-200 pb-6">
            <div className="flex items-center space-x-6">
              <CustomDropdown
                label="Account Status"
                options={["Active", "Suspended"]}
                value={adminData.accountStatus}
                onChange={(value) =>
                  setAdminData({ ...adminData, accountStatus: value })
                }
              />

              <CustomDropdown
                label="Session Timeout (minutes)"
                options={[15, 30, 45, 60, 90]}
                value={adminData.sessionTimeout}
                onChange={(value) =>
                  setAdminData({ ...adminData, sessionTimeout: value })
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="notifications" className="font-semibold text-lg">
              Enable Notifications
            </label>
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={adminData.notifications}
              onChange={handleToggle}
              className="h-5 w-5"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
     

        <div className="p-8 col-span-6 shadow-lg rounded-xl mt-2 bg-white">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Logged-in Devices
          </h2>

          <div className="space-y-6">
       
            <div className="grid grid-cols-12 items-center w-full justify-between border-b border-gray-300 py-4">
              <div className="flex col-span-4 items-center">
                <FaMobileAlt className="text-2xl text-gray-700" />
                <span className="ml-4 font-semibold text-lg">iPhone 13</span>
                <FaSafari className="text-xl text-gray-500 ml-2" />
              </div>
              <div className="text-sm col-span-5 mx-auto text-center text-gray-600">
                <div>192.168.1.1</div>
                <div>Dhaka, Bangladesh</div>
                <div>Feb 26, 2025</div>
              </div>
              <div className="col-span-3 text-right">
                <button className="px-4 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                  Log Out
                </button>
              </div>
            </div>

            {/* Device 2 */}
            <div className="grid grid-cols-12 items-center w-full justify-between border-b border-gray-300 py-4">
              <div className="flex col-span-4 items-center">
                <FaLaptop className="text-2xl text-gray-700" />
                <span className="ml-4 font-semibold text-lg">MacBook Pro</span>
                <FaChrome className="text-xl text-gray-500 ml-2" />
              </div>
              <div className="text-sm col-span-5 mx-auto text-center text-gray-600">
                <div>203.112.94.102</div>
                <div>Chattogram, Bangladesh</div>
                <div>Feb 25, 2025</div>
              </div>
              <div className="col-span-3 text-right">
                <button className="px-4 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                  Log Out
                </button>
              </div>
            </div>

            {/* Device 3 */}
            <div className="grid grid-cols-12 items-center w-full justify-between border-b border-gray-300 py-4">
              <div className="flex col-span-4 items-center">
                <FaDesktop className="text-2xl text-gray-700" />
                <span className="ml-4 font-semibold text-lg">Windows PC</span>
                <FaFirefoxBrowser className="text-xl text-gray-500 ml-2" />
              </div>
              <div className="text-sm col-span-5 mx-auto text-center text-gray-600">
                <div>45.58.67.90</div>
                <div>New York, USA</div>
                <div>Feb 24, 2025</div>
              </div>
              <div className="col-span-3 text-right">
                <button className="px-4 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
     
    </div>
  );
};

export default Settings;
