import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useParams, Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    const fetchOrder = async () => {
      const data = {
        id: orderId,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "01701123456",
        customerAddress: "Dhaka, Bangladesh",
        totalAmount: 500,
        orderDate: "2025-02-14",
        status: "Completed",
        items: [
          { id: 1, name: "Product 1", quantity: 2, price: 100 },
          { id: 2, name: "Product 2", quantity: 1, price: 300 },
          { id: 3, name: "Product 3", quantity: 3, price: 50 },
          { id: 4, name: "Product 4", quantity: 4, price: 75 },
          { id: 5, name: "Product 5", quantity: 1, price: 200 },
          { id: 6, name: "Product 6", quantity: 5, price: 120 },
        ],
      };
      setOrder(data);
      setOrderDetails(data.items);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  // Get the current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orderDetails.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orderDetails.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white relative rounded-xl shadow-lg mt-2">
      <Link to="/orders/consumer">
        <IoMdArrowBack width={50} className="w-6 h-6 text-gray-500" />
      </Link>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Order Details - {order.id}
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="flex flex-col items-start md:w-1/3 gap-y-3">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://t4.ftcdn.net/jpg/06/08/55/73/360_F_608557356_ELcD2pwQO9pduTRL30umabzgJoQn5fnd.jpg" // Replace with actual customer image
              alt="Customer"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
          </div>
          <p className="text-gray-600 text-xl font-bold">Customer Name</p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> {order.customerEmail}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaPhone className="text-green-500" /> {order.customerPhone}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> {order.customerAddress}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaShoppingCart className="text-yellow-500" /> Total Amount:
            {order.totalAmount} &#2547;
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-500" /> Order Date:
            {order.orderDate}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" /> Status: {order.status}
          </p>
        </div>

        <div className="md:w-2/3 rounded-lg bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Order Items
          </h3>
          <table className="w-full">
            <thead className="bg-gray-200 rounded-xl">
              <tr className="bg-gray-200 rounded-xl">
                <th className="p-3 text-left">Sn.</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-200 border cursor-pointer border-gray-400 border-x-0 transition-all"
                >
                  <td className="text-center p-3">{index + 1}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.price} &#2547;</td>
                  <td className="p-3">{item.quantity * item.price} &#2547;</td>
                  <td className="mx-auto mt-5 flex items-center justify-center">
                    <BsThreeDotsVertical />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-2 mt-4">
            {pageNumbers?.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === number
                    ? "bg-green-500 text-gray-900"
                    : "bg-gray-100 text-gray-500"
                } cursor-pointer`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
