import { Link, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

const SuperSellerPage = () => {
  
const [customers, setCustomers] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const customersPerPage = 10;
const filteredCustomers = customers.filter((customer) =>
  customer.name.toLowerCase().includes(searchQuery.toLowerCase())
);
const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const handlePreviousPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
}; 
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState({
    purchaseHistory: [],
    sellingHistory: [],
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("purchase"); // Track active tab

  useEffect(() => {
    const fetchSeller = async () => {
      const data = {
        id,
        name: `SuperSeller ${id}`,
        email: `superseller${id}@example.com`,
        phone: `0170${id}654321`,
        address: "Dhaka, Bangladesh",
        totalSales: Math.floor(Math.random() * 500) + 50,
        totalPurchases: Math.floor(Math.random() * 500) + 50,
        lastLogin: `2025-02-${String(15 - (id % 14)).padStart(2, "0")}`,
        image: `https://i.pravatar.cc/150?img=${id}`,
      };
      setSeller(data);

      const transactions = {
        purchaseHistory: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          item: `Product ${i + 1}`,
          amount: Math.floor(Math.random() * 10) + 1,
          price: (Math.random() * 100 + 5001).toFixed(0),
          type: "Purchase",
          date: `2025-02-${String(10 + i).padStart(2, "0")}`,
        })),
        sellingHistory: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          item: `Product ${i + 6}`,
          amount: Math.floor(Math.random() * 10) + 1,
          price: (Math.random() * 100 + 5001).toFixed(0),
          type: "Sale",
          date: `2025-02-${String(10 + i).padStart(2, "0")}`,
        })),
      };
      setTransactionHistory(transactions);
    };
    fetchSeller();
  }, [id]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleAction = (action) => {
    console.log(`${action} action triggered`);
    setDropdownVisible(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  if (!seller) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white relative rounded-xl shadow-lg mt-2">
      <BsThreeDotsVertical
        onClick={toggleDropdown}
        className="absolute top-6 right-5 text-gray-500 cursor-pointer"
      />

      {dropdownVisible && (
        <div className="absolute top-12 text-sm right-5 bg-white border border-gray-300 shadow-lg rounded-md w-48 z-10">
          <ul className="list-none p-2">
            <li
              onClick={() => handleAction("Send Email")}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <FaEnvelope className="inline mr-2" />
              Send Email
            </li>
            <li
              onClick={() => handleAction("In-App Message")}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <MdOutlineMessage className="inline mr-2" />
              In-App Message
            </li>
            <li
              onClick={() => handleAction("Phone Call")}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <FaPhone className="inline mr-2" />
              Phone Call
            </li>
            <li
              onClick={() => handleAction("Delete User")}
              className="cursor-pointer text-red-600 hover:bg-gray-100 p-2 rounded-md"
            >
              <FaMapMarkerAlt className="inline mr-2" />
              Delete User
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-start md:w-1/3 gap-y-3">
          <Link to="/super-sellers">
            <IoMdArrowBack width={50} className="w-6 h-6" />
          </Link>
          <img
            src={seller.image}
            alt={seller.name}
            className="w-48 h-48 object-cover object-top rounded-full border-4 border-blue-500"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {seller.name}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> {seller.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaPhone className="text-green-500" />
            <span className="font-bold">Phone:</span> {seller.phone}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="font-bold">Address:</span> {seller.address}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaShoppingCart className="text-yellow-500" />
            <span className="font-bold">Total Sales:</span> {seller.totalSales}
            items
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaShoppingCart className="text-yellow-500" />
            <span className="font-bold">Total Purchases:</span>
            {seller.totalPurchases} items
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-500" />
            <span className="font-bold">Account Created:</span> 12th July, 2023
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="font-bold">Last Login:</span> {seller.lastLogin}
          </p>
        </div>
        <div className="md:w-2/3 mt-6 lg:mt-[3rem]">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleTabSwitch("purchase")}
              className={`px-4 py-2 font-semibold cursor-pointer ${
                activeTab === "purchase"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Purchase History
            </button>
            <button
              onClick={() => handleTabSwitch("selling")}
              className={`px-4 py-2 font-semibold cursor-pointer ${
                activeTab === "selling"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Selling History
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {activeTab === "purchase"
              ? "Supper-Seller Purchase History"
              : "Supper-Seller Selling History"}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-500 text-white text-left">
                  <th className="p-3 border text-center">#</th>
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border text-center">Amount</th>
                  <th className="p-3 border text-right">Price (BDT)</th>
                  <th className="p-3 border text-center">Type</th>
                  <th className="p-3 border text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "purchase"
                  ? transactionHistory.purchaseHistory
                  : transactionHistory.sellingHistory
                )
                  .slice(
                    (currentPage - 1) * customersPerPage,
                    currentPage * customersPerPage
                  ) // Slice based on current page
                  .map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`border text-gray-700 ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-200 transition-all`}
                    >
                      <td className="p-3 border text-center">
                        {transaction.id}
                      </td>
                      <td className="p-3 border">{transaction.item}</td>
                      <td className="p-3 border text-center">
                        {transaction.amount}
                      </td>
                      <td className="p-3 border text-right font-semibold text-yellow-700">
                        {transaction.price}
                        <span className="text-black">&#2547;</span>
                      </td>
                      <td className="p-3 border text-center">
                        {transaction.type}
                      </td>
                      <td className="p-3 border text-center">
                        {transaction.date}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-12 items-center gap-5">
              <p
                className={`font-bold cursor-pointer ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                onClick={handlePreviousPage}
              >
                Previous
              </p>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <p
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`rounded-md px-2 py-1.5 text-xs cursor-pointer ${
                      currentPage === index + 1 ? "bg-green-600 text-white" : ""
                    }`}
                  >
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </p>
                ))}
              </div>

              <p
                className={`font-bold cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
              >
                Next
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperSellerPage;
