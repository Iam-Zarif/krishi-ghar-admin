import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrdersTable = ({ data }) => {
  const [orders, setOrders] = useState(data || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const ordersPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {

  }, [data]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-700 text-white";
      case "Canceled":
        return "bg-red-600 text-white";
      case "Done":
        return "bg-green-600 text-center mx-auto ml-1.5 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="w-full px-6 rounded-lg">
      <div className="w-full h-[1px] bg-gray-300 mt-5 border-dashed"></div>

      <div className="mb-4 mt-5 w-full flex items-center">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border-gray-300 border bg-white rounded-lg shadow-sm focus:outline-none focus:outline-green"
        />
      </div>

      <div className="rounded-lg bg-white">
        <table className="w-full">
          <thead className="rounded-lg">
            <tr className="bg-gray-200 rounded-xl">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={() => {
                    if (selectedOrders.length === orders.length) {
                      setSelectedOrders([]);
                    } else {
                      setSelectedOrders(
                        filteredOrders.map((order) => order.sn)
                      );
                    }
                  }}
                  className="w-4 h-4"
                />
              </th>
              <th className="text-left">Sn.</th>
              <th className="p-3 text-left">Tracking No.</th>
              <th className="p-3 text-left">Product Name & Image</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Total Earning</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders?.map((order, index) => (
              <tr
                onClick={() => navigate(`/dashboard/orders/consumer/${order.sn}`)}
                key={order.sn}
                className="hover:bg-gray-200 cursor-pointer border border-gray-400 border-x-0 transition-all"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.sn)}
                    onChange={() => handleCheckboxChange(order.sn)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="text-">{index + 1}</td>
                <td className="p-3">{order.trackingNo}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <img
                      src="https://images.healthshots.com/healthshots/en/uploads/2023/09/01130101/red-rice-2.jpg"
                      alt={order.productName}
                      className="w-12 h-12 rounded-full border-2 border-blue-500 mr-2"
                    />
                    {order.productName}
                  </div>
                </td>
                <p className="p-3 ml-3 teext-center">{order.quantity}</p>
                <td className="text-center">{order.totalEarning}</td>
                <td className="p-3">{order.orderDate}</td>
                <td className="p-3 mx-auto">
                  <button
                    className={`px-4 py-2 text-center mx-auto rounded-full ${getStatusColor(
                      order.status
                    )} cursor-pointer`}
                  >
                    {order.status}
                  </button>
                </td>
                <td className="mx-auto mt-5 flex items-center justify-center">
                  <BsThreeDotsVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""
          }`}
          onClick={handleNextPage}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default OrdersTable;
