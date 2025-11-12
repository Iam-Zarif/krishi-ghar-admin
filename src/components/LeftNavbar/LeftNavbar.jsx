import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaCogs,
  FaBell,
  FaFileAlt,
  FaUserAlt,
  FaMedal,
  FaBox,
  FaSeedling,
  FaRegSmile,
  FaBoxes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { useState } from "react";

const LeftNavbar = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const location = useLocation(); 

const navItems = [
  { name: "Dashboard", icon: <FaTachometerAlt className="text-blue-500" /> },
  { name: "Consumers", icon: <FaUserAlt className="text-green-500" /> },
  { name: "Super-Sellers", icon: <FaMedal className="text-yellow-500" /> },
  { name: "Wholesalers", icon: <FaBox className="text-purple-500" /> },
  { name: "Producers", icon: <FaSeedling className="text-green-700" /> },
  {
    name: "Orders",
    icon: <FaShoppingCart className="text-yellow-500" />,
    subItems: [
      {
        name: "Consumer Orders",
        icon: <FaRegSmile className="text-green-500" />,
        link: "/dashboard/orders/consumer",
      },
      {
        name: "Super Seller Orders",
        icon: <FaMedal className="text-yellow-500" />,
        link: "/dashboard/orders/superseller",
      },
      {
        name: "Wholesaler Orders",
        icon: <FaBoxes className="text-purple-500" />,
        link: "/dashboard/orders/wholesaler",
      },
    ],
  },
  { name: "Earnings", icon: <FaDollarSign className="text-yellow-500" /> },
  { name: "Spends", icon: <FaDollarSign className="text-red-500" /> },
  {name: "Products" , icon :<MdOutlineProductionQuantityLimits className="text-yellow-700"/>},
  { name: "Partners", icon: <FaUsers className="text-blue-500" /> },
  { name: "Reports", icon: <FaFileAlt className="text-gray-500" /> },
  { name: "Notifications", icon: <FaBell className="text-orange-500" /> },
  { name: "Settings", icon: <FaCogs className="text-gray-700" /> },
];

  return (
    <div className="w-full hidden  lg:block lg:max-w-[16rem]">
      <div className="fixed overflow-y-auto h-screen max-h-[93vh] bg-white  shadow-sm pt-7 shadow-gray-300 lg:max-w-[16rem] w-full">
        <nav className="w-full">
          <ul className="w-full">
            {navItems?.map((item, index) => (
              <li key={index} className="w-full">
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
                      <span className="mr-3 text-xl">{item.icon}</span>
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
                      location.pathname ===
                      `/dashboard/${item.name.toLowerCase().replace(" ", "")}`
                        ? "bg-green-200 font-bold"
                        : ""
                    }`}
                    to={`/dashboard/${item.name
                      .toLowerCase()
                      .replace(" ", "")}`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LeftNavbar;
