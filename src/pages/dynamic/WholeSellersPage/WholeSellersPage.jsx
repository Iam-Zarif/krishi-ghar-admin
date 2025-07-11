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

const WholeSellerPage = () => {
  const [wholeSellers, setWholeSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const wholeSellersPerPage = 7;

  useEffect(() => {
    const fetchWholeSellers = async () => {
      const data = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "01701123456",
          address: "Dhaka, Bangladesh",
          totalPurchases: 150,
          lastLogin: "2025-02-14",
          image: "https://i.pravatar.cc/150?img=1",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "01702234567",
          address: "Chittagong, Bangladesh",
          totalPurchases: 200,
          lastLogin: "2025-02-10",
          image: "https://i.pravatar.cc/150?img=2",
        },
        {
          id: 3,
          name: "Alice Johnson",
          email: "alice@example.com",
          phone: "01703345678",
          address: "Sylhet, Bangladesh",
          totalPurchases: 300,
          lastLogin: "2025-02-08",
          image: "https://i.pravatar.cc/150?img=3",
        },
        {
          id: 4,
          name: "Bob Brown",
          email: "bob@example.com",
          phone: "01704456789",
          address: "Khulna, Bangladesh",
          totalPurchases: 250,
          lastLogin: "2025-02-12",
          image: "https://i.pravatar.cc/150?img=4",
        },
        {
          id: 5,
          name: "Charlie Davis",
          email: "charlie@example.com",
          phone: "01705567890",
          address: "Rajshahi, Bangladesh",
          totalPurchases: 100,
          lastLogin: "2025-02-05",
          image: "https://i.pravatar.cc/150?img=5",
        },
        {
          id: 6,
          name: "Diana Evans",
          email: "diana@example.com",
          phone: "01706678901",
          address: "Barisal, Bangladesh",
          totalPurchases: 350,
          lastLogin: "2025-02-13",
          image: "https://i.pravatar.cc/150?img=6",
        },
        {
          id: 7,
          name: "Frank Green",
          email: "frank@example.com",
          phone: "01707789012",
          address: "Rangpur, Bangladesh",
          totalPurchases: 400,
          lastLogin: "2025-02-06",
          image: "https://i.pravatar.cc/150?img=7",
        },
        {
          id: 8,
          name: "Grace Harris",
          email: "grace@example.com",
          phone: "01708890123",
          address: "Mymensingh, Bangladesh",
          totalPurchases: 450,
          lastLogin: "2025-02-07",
          image: "https://i.pravatar.cc/150?img=8",
        },
        {
          id: 9,
          name: "Henry Clark",
          email: "henry@example.com",
          phone: "01709901234",
          address: "Jessore, Bangladesh",
          totalPurchases: 500,
          lastLogin: "2025-02-04",
          image: "https://i.pravatar.cc/150?img=9",
        },
        {
          id: 10,
          name: "Irene Lewis",
          email: "irene@example.com",
          phone: "01701012345",
          address: "Comilla, Bangladesh",
          totalPurchases: 550,
          lastLogin: "2025-02-14",
          image: "https://i.pravatar.cc/150?img=10",
        },
        {
          id: 11,
          name: "Noah Carter",
          email: "noah@example.com",
          phone: "01701156789",
          address: "Bogura, Bangladesh",
          totalPurchases: 600,
          lastLogin: "2025-02-09",
          image: "https://i.pravatar.cc/150?img=11",
        },
        {
          id: 12,
          name: "Sophia White",
          email: "sophia@example.com",
          phone: "01702267890",
          address: "Jamalpur, Bangladesh",
          totalPurchases: 700,
          lastLogin: "2025-02-01",
          image: "https://i.pravatar.cc/150?img=12",
        },
      ];
      setWholeSellers(data);
    };
    fetchWholeSellers();
  }, []);

  const filteredWholeSellers = wholeSellers.filter((wholeSeller) =>
    wholeSeller.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWholeSellers.length / wholeSellersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const { id } = useParams();
  const [WholeSeller, setWholeSeller] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchWholeSeller = async () => {
      const data = {
        id,
        name: `WholeSeller ${id}`,
        email: `wholeSeller${id}@example.com`,
        phone: `0170${id}123456`,
        address: "Dhaka, Bangladesh",
        totalPurchases: Math.floor(Math.random() * 500) + 50,
        lastLogin: `2025-02-${String(15 - (id % 14)).padStart(2, "0")}`,
        image: `https://i.pravatar.cc/150?img=${id}`,
      };
      setWholeSeller(data);

      const purchases = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        item: `Product ${i + 1}`,
        amount: Math.floor(Math.random() * 10) + 1,
        price: (Math.random() * 100 + 5001).toFixed(0),
        date: `2025-02-${String(10 + i).padStart(2, "0")}`,
      }));
      setPurchaseHistory(purchases);
    };
    fetchWholeSeller();
  }, [id]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleAction = (action) => {
    console.log(`${action} action triggered`);
    setDropdownVisible(false);
  };

  if (!WholeSeller) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white relative rounded-xl shadow-lg mt-2">
      <BsThreeDotsVertical
        onClick={toggleDropdown}
        className="absolute top-8 w-6 h-5 right-5 text-gray-500 cursor-pointer"
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
          <Link to="/dashboard/WholeSellers">
            <IoMdArrowBack width={50} className="w-6 h-6" />
          </Link>
          <img
            src={WholeSeller.image}
            alt={WholeSeller.name}
            className="w-48 h-48 object-cover object-top rounded-full border-4 border-blue-500"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {WholeSeller.name}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> {WholeSeller.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaPhone className="text-green-500" />
            <span className="font-bold">Phone:</span> {WholeSeller.phone}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="font-bold">Address:</span> {WholeSeller.address}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaShoppingCart className="text-yellow-500" />
            <span className="font-bold">Total Purchases:</span>
            {WholeSeller.totalPurchases} kg
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-500" />
            <span className="font-bold">Account Created:</span> 12th July, 2023
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="font-bold">Last Login:</span> {WholeSeller.lastLogin}
          </p>
        </div>
        <div className="md:w-2/3 mt-6 lg:mt-[2.5rem]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            WholeSeller Purchase History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-500 text-white text-left">
                  <th className="p-3 border text-center">#</th>
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border text-center">Amount(KG)</th>
                  <th className="p-3 border text-right">Price (BDT)</th>
                  <th className="p-3 border text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory?.map((purchase, index) => (
                  <tr
                    key={purchase.id}
                    className={`border text-gray-700 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 transition-all`}
                  >
                    <td className="p-3 border text-center">{purchase.id}</td>
                    <td className="p-3 border">{purchase.item}</td>
                    <td className="p-3 border text-center">
                      {purchase.amount}
                    </td>
                    <td className="p-3 border text-right font-semibold text-yellow-700">
                      {purchase.price}
                      <span className="text-black">&#2547;</span>
                    </td>
                    <td className="p-3 border text-center">{purchase.date}</td>
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

export default WholeSellerPage;
