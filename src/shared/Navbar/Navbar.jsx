import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../public/photos/auth/brandLogo.svg";
import search from "../../../public/photos/navbar/search.png";
import downarrow from "../../../public/photos/auth/down-arrow.png";
import blankUser from "../../../public/photos/common/user.png";
import { IoMenu, IoClose } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { TbLogin2 } from "react-icons/tb";



import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaCogs,
  FaFileAlt,
  FaUserAlt,
  FaMedal,
  FaBox,
  FaSeedling,
  FaRegSmile,
  FaBoxes,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { AuthContext } from "../../Context/GetProfile/GetProfile";

const Navbar = () => {
  const location = useLocation();
  const [logOutDropdown, setlogOutDropdown] = useState(false);
  const {profile,logout}  = useContext(AuthContext);
  const toogleDropdown =() =>{
    setlogOutDropdown(!logOutDropdown);
  }
  const isAuthRoute = location.pathname.includes("/auth");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (isAuthRoute) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt className="text-blue-500" /> },
    { name: "Consumers", path: "/consumers", icon: <FaUserAlt className="text-green-500" /> },
    { name: "Super-Sellers", path: "/super-sellers", icon: <FaMedal className="text-yellow-500" /> },
    { name: "Wholesalers", path: "/wholesalers", icon: <FaBox className="text-purple-500" /> },
    { name: "Producers", path: "/producers", icon: <FaSeedling className="text-green-700" /> },
    {
      name: "Orders",
      icon: <FaShoppingCart className="text-yellow-500" />,
      subItems: [
        {
          name: "Consumer Orders",
          icon: <FaRegSmile className="text-green-500" />,
          link: "/orders/consumer",
        },
        {
          name: "Super Seller Orders",
          icon: <FaMedal className="text-yellow-500" />,
          link: "/orders/superseller",
        },
        {
          name: "Wholesaler Orders",
          icon: <FaBoxes className="text-purple-500" />,
          link: "/orders/wholesaler",
        },
      ],
    },
    { name: "Earnings", path: "/earnings", icon: <FaDollarSign className="text-yellow-500" /> },
    { name: "Spends", path: "/spends", icon: <FaDollarSign className="text-red-500" /> },
    { name: "Partners", path: "/partners", icon: <FaUsers className="text-blue-500" /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt className="text-gray-500" /> },
    { name: "Settings", path: "/settings", icon: <FaCogs className="text-gray-700" /> },
  ];

  return (
    <>
      <div className="fixed top-0 py-3 shadow-sm shadow-gray-300 z-[50] bg-white w-full">
        <div className="flex max-w-[1440px] 2xl:max-w-[1600px] mx-auto items-center justify-between w-full px-4 lg:px-0">
          <div className="flex items-center gap-4 lg:gap-16">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                className="w-12"
                alt="Brand Logo"
                loading="lazy"
              />
              <p className="uppercase text-2xl font-semibold">
                <span className="text-green-600">Krishi</span>
                <span className="text-yellow-500">Ghar</span>
              </p>
            </div>

            <div className="relative hidden lg:block">
              <img
                src={search}
                className="w-5 absolute top-3 opacity-60 left-3"
                alt=""
              />
              <input
                type="text"
                className="w-[25rem] pl-10 pr-6 focus:outline-green-500 rounded-2xl border border-gray-400 py-2"
                placeholder="Search Here..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 lg:gap-6">
            <div className="relative">
              <div
                onClick={toogleDropdown}
                className="border cursor-pointer relative items-center gap-2 rounded-full border-gray-400 px-3 py-1 hidden lg:flex"
              >
                <img src={blankUser} className="w-8" loading="lazy" alt="" />
                <p className="font-bold uppercase">Owner</p>
                <img src={downarrow} className="w-5" alt="" />
              </div>
              {logOutDropdown && (
                <>
                  {profile ? (
                    <>
                      <button
                        onClick={logout}
                        className="block absolute border border-gray-300  top-12 right-0 w-[10rem] bg-white rounded-full shadow-lg py-2 px-4  text-sm hover:bg-red-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-red-600">
                          <CiLogout className="text-lg" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="block absolute border border-gray-300  top-12 right-0 w-[10rem] bg-white rounded-full shadow-lg py-2 px-4  text-sm hover:bg-green-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-green-600">
                          <TbLogin2 className="text-lg" />
                          <span>Login</span>
                        </div>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            <button
              className="lg:hidden cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9999] cursor-pointer"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9999] transition-opacity duration-300 cursor-pointer"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <div
        ref={menuRef}
        className={`lg:hidden z-[99999] fixed top-0 left-0 w-64 h-full bg-white shadow-md transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col lg:gap-3">
          <img
            src={logo}
            className="w-12 mt-3 ml-3"
            alt="Brand Logo"
            loading="lazy"
          />

          <div className="border-t lg:mt-0 mt-5 border-gray-300">
            {navItems?.map((item, index) => (
              <div
                onClick={() => setMenuOpen(false)}
                key={index}
                className="w-full  cursor-pointer"
              >
                {item.subItems ? (
                  <div>
                    <div
                      onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                      className={`flex items-center w-full px-6 py-4 text-gray-700 hover:bg-green-200 hover:text-green-800 rounded-md cursor-pointer transition-all duration-200 ${
                        location.pathname.includes("orders")
                          ? "bg-green-200 font-bold"
                          : ""
                      }`}
                    >
                      <span className="mr-3 lg:text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                      <span className="ml-auto">
                        {isOrdersOpen ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </span>
                    </div>
                    {isOrdersOpen && (
                      <ul className="pl-8">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              className={`flex items-center w-full px-2 py-4 text-gray-700 hover:bg-green-200 hover:text-green-800 rounded-md cursor-pointer transition-all duration-200 ${
                                location.pathname === subItem.link
                                  ? "bg-green-200 font-bold"
                                  : ""
                              }`}
                              to={subItem.link}
                            >
                              <span className="mr-3 text-xl">
                                {subItem.icon}
                              </span>
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    className={`flex items-center w-full px-6 py-4 text-gray-700 hover:bg-green-200 hover:text-green-800 rounded-md cursor-pointer transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-green-200 font-bold"
                        : ""
                    }`}
                    to={item.path}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
