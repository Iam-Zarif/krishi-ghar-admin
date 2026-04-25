import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import blankUser from "../../../public/photos/common/user.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { Api } from "../../Api/Api";
import { FaArrowDown, FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSort, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Consumers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [consumers, setConsumers] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("Sort By"); const [sort, setSort] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const [DeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [consumersLoading, setConsumersLoading] = useState(true);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [consumerToDelete, setConsumerToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const customersPerPage = 10;
  const token = localStorage.getItem("token");
  const actionToogle = (id) => {
    setActionDropdown((prevId) => (prevId === id ? null : id));
  };


  useEffect(() => {
    axios
      .get(`${Api}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const consumers = response.data.users.filter(
          (user) => user.role === "consumer"
        );
        console.log(consumers);
        setConsumers(consumers);
        setConsumersLoading(false);
      })
      .catch((err) => {
        setError("Error fetching users", err);
        setConsumersLoading(false);
      });
  }, [token]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredCustomers = consumers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleAction = (action, consumer) => {
    if (!consumer) return;

    if (action === "Send Email") {
      window.location.href = `mailto:${consumer.email}`;
    } else if (action === "Phone Call") {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `tel:${consumer.phone}`;
      } else {
        alert("Use mobile for call");
      }
    } else if (action === "Send Message") {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `sms:${consumer.phone}`;
      } else {
        alert("Use phone to send message");
      }
    } else {
      console.log(`Action triggered: ${action}`);
    }
  };

  const deleteConfirmationToogle = (event, consumer) => {
    event.stopPropagation();
    setConsumerToDelete(consumer?._id);
    setDeleteConfirmation(true);
  };

  const removeConsumer = (consumerId) => {
    setConsumers((prevConsumers) =>
      prevConsumers?.filter((consumer) => consumer?._id !== consumerId)
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      const response = await axios.delete(
        `${Api}/api/v1/admin/users/${consumerToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Delete response", response);
      if (response.status === 200) {
        setDeleteConfirmation(false);
        removeConsumer(consumerToDelete);
        toast.success(
          response.data.message || "consumer deleted successfully!",
          {
            position: "top-right",
          }
        );
      } else {
        toast.error("Unexpected response status. Please try again.", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error occurred: ", err);
      toast.error("Failed to delete consumer.", {
        position: "top-right",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  const toogleSort = () => {
    setSort((prev) => !prev);
  };
 
  
  const handleSort = (type) => {
    let sortedData = [...consumers]; 
    setSelectedSortOption(type);

    switch (type) {
      case "A-Z":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Newest-Older":
        sortedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "Older-Newer":
        sortedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        return;
    }

    setConsumers(sortedData); 
    setSort(false);
  };


  return (
    <div className="w-full p-6 rounded-lg">
      <ToastContainer />
      <div className="w-full flex items-center lg:mt-0 mt-5 px-4 lg:px-0 justify-between">
        <h1 className="lg:text-3xl text-xl font-bold text-green-700">
          Consumers
        </h1>
        <div className="border flex items-center gap-2 lg:text-md text-sm bg-white rounded-2xl border-gray-300 px-3 py-1">
          Total :
          {consumersLoading ? (
            <p className="text-xs">Counting..</p>
          ) : (
            consumers?.length
          )}
        </div>
      </div>{" "}
      <div className="w-full h-[1px] bg-gray-300 mt-5 border-dashed"></div>
      <div className="grid grid-cols-12 items-center justify-between w-full gap-5">
        {" "}
        <div className="mb-4 col-span-10 relative px-4 lg:px-0 mt-5 w-full flex items-center">
          <input
            type="text"
            placeholder="Search consumers..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full lg:py-3 lg:pl-12 py-2   border-gray-300 border bg-white rounded-lg shadow-sm focus:outline-none focus:outline-green"
          />
          <BsSearch className="absolute text-gray-500 left-5 top-1/2 transform text-lg -translate-y-1/2" />
          <RxCross1
            onClick={() => setSearchQuery("")}
            className="absolute text-red-700 hover:scale-110 hover:font-semibold right-5 top-1/2 transform text-xl cursor-pointer -translate-y-1/2"
          />
        </div>{" "}
        <div
          onClick={toogleSort}
          className="border w-full col-span-2 relative text-sm rounded-lg shadow-sm flex items-center gap-1.5 border-gray-300 cursor-pointer bg-white px-3 py-3.5"
        >
          <div className="flex items-center w-full justify-between">
            {" "}
            <p>{selectedSortOption}</p>
            <FaSort />
          </div>
          {sort && (
            <div className="relative">
              <div className="absolute top-7 right-0 z-[9999] bg-white shadow-lg rounded-md p-2 flex flex-col w-44">
                <div className="absolute -top-1.5 right-5">
                  <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>

                  <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                </div>

                <p
                  onClick={() => {
                    handleSort("A-Z");
                    toogleSort();
                  }}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaSortAlphaDown className="text-lg" />
                  A-Z
                </p>
                <p
                  onClick={() => {
                    handleSort("Z-A");
                    toogleSort();
                  }}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaSortAlphaUp className="text-lg" />
                  Z-A
                </p>
                <p
                  onClick={() => {
                    handleSort("Newest-Older");
                    toogleSort();
                  }}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaArrowUp className="text-lg" />
                  Newest-Older
                </p>
                <p
                  onClick={() => {
                    handleSort("Older-Newer");
                    toogleSort();
                  }}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaArrowDown className="text-lg" />
                  Older-Newer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-lg bg-white ">
        <table className="w-full">
          <thead className="rounded-lg">
            <tr className="bg-gray-200 rounded-xl">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    filteredCustomers.length > 0 &&
                    selectedCustomers.length === filteredCustomers.length
                  }
                  onChange={() => {
                    if (selectedCustomers.length === filteredCustomers.length) {
                      setSelectedCustomers([]); 
                    } else {
                      setSelectedCustomers(filteredCustomers.map((c) => c._id)); 
                    }
                  }}
                  className="w-4 h-4"
                />
              </th>
              <th className="p-3 text-left">Sn.</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3  hidden lg:table-cell">Email</th>
              <th className="p-3 text-left hidden lg:table-cell">Last Login</th>
              <th className="p-3 text-left hidden lg:table-cell">Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers?.map((customer, index) => (
              <tr
                key={customer?._id}
                className={`hover:bg-gray-200 border cursor-pointer border-gray-400 border-x-0 transition-all`}
              >
                {" "}
                {DeleteConfirmation && (
                  <>
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
                      <div className="bg-green-950 p-6 rounded-xl shadow-lg w-96 relative">
                        <button
                          onClick={(e) => deleteConfirmationToogle(e, customer)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer"
                        >
                          <RxCross1 className="w-5 h-5 cursor-pointer" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Confirm Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                          Are you sure you want to delete this item? This action
                          cannot be undone.
                        </p>
                        <div className="flex justify-end mt-6 gap-3">
                          <button
                            onClick={(e) =>
                              deleteConfirmationToogle(e, customer)
                            }
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(customer?._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                          >
                            {deleteloading ? "Deleteing..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer?._id)}
                    onChange={() => {
                      if (selectedCustomers.includes(customer?._id)) {
                        setSelectedCustomers(
                          selectedCustomers.filter((id) => id !== customer?._id)
                        );
                      } else {
                        setSelectedCustomers([
                          ...selectedCustomers,
                          customer?._id,
                        ]);
                      }
                    }}
                    className="w-4 h-4"
                  />
                </td>
                <td className="text-center">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={customer?.image || blankUser}
                    alt={customer.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                </td>
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="text-center hidden lg:table-cell">
                  {customer?.email || "Not Set"}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  {customer?.lastLogin &&
                  customer.lastLogin !== "Never logged in"
                    ? new Date(customer.lastLogin).toLocaleDateString("en-GB")
                    : "Never Logged In"}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  {customer?.address || "Not Set"}
                </td>
                <div className="relative ">
                  <td
                    onClick={() => actionToogle(customer?._id)}
                    className="mx-auto mt-7 hover:scale-125 duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <BsThreeDotsVertical />
                  </td>

                  {actionDropdown === customer?._id && (
                    <div className="absolute top-7 text-sm right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[99999]">
                      <div className="absolute -top-1.5  right-9">
                        <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>

                        <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                      </div>
                      <ul className="list-none p-2">
                        <li
                          onClick={() => handleAction("Send Email", customer)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <FaEnvelope className="inline mr-2" />
                          Send Email
                        </li>
                        <li
                          onClick={() => handleAction("Send Message", customer)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <MdOutlineMessage className="inline mr-2" />
                          Send Message
                        </li>
                        <li
                          onClick={() => handleAction("Phone Call", customer)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <FaPhone className="inline mr-2" />
                          Phone Call
                        </li>
                        <li
                          onClick={(e) => deleteConfirmationToogle(e, customer)}
                          className="cursor-pointer text-red-600 hover:bg-white p-2 rounded-md"
                        >
                          <FaMapMarkerAlt className="inline mr-2" />
                          Delete User
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </tr>
            ))}
          </tbody>
        </table>

        {consumersLoading && (
          <>
            {" "}
            <div className="w-full">
              <div className=" bg-white py-5 px-8 rounded-lg border border-gray-100 justify-center  grid grid-cols-12 w-full items-center ">
                <div className="w-8 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="w-14 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="flex col-span-2 items-center gap-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-28 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
                <div className="w-24 col-span-2 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-36 h-8 col-span-2 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-48 h-8 col-span-2 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 col-span-1 bg-gray-600 rounded-full animate-pulse ml-auto"></div>
              </div>
              <div className=" bg-white py-5 px-8 rounded-lg border border-gray-100 justify-center  grid grid-cols-12 w-full items-center ">
                <div className="w-8 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="w-14 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="flex col-span-2 items-center gap-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-28 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
                <div className="w-24 col-span-2 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-36 h-8 col-span-2 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-48 h-8 col-span-2 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 col-span-1 bg-gray-600 rounded-full animate-pulse ml-auto"></div>
              </div>
            </div>
          </>
        )}
      </div>
      {filteredCustomers?.length === 0 && !consumersLoading && !error && (
        <p className="text-center mt-6 text-red-500">No Consumer Found</p>
      )}
      {error && (
        <p className="text-center mt-6 text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
      <div
        className={`flex justify-center mt-12 items-center gap-5 ${
          filteredCustomers?.length === 0 && "hidden"
        }`}
      >
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

export default Consumers;
