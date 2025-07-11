import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import blankUser from "../../../public/photos/common/user.png";
import { Api } from "../../Api/Api";
import {
  FaArrowDown,
  FaArrowUp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";

const WholeSalers = () => {
  const token = localStorage.getItem("token");
  const [selectedSortOption, setSelectedSortOption] = useState("Sort By");
  const [approving, setApproving] = useState(false);
  const [sort, setSort] = useState(false);
  const [existingWholesalers, setExistingWholesalers] = useState([]);
  const [accountRequests, setAccountRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Existing WholeSaler");
  const [selectedWholesalers, setSelectedWholesalers] = useState([]);
  const [actions, setActions] = useState({});

  const wholesalersPerPage = 10;

  const toggleActions = (id) => {
    setActions((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
      [id]: !prev[id],
    }));
  };

  const toogleSort = () => {
    setSort((prev) => !prev);
  };

  const handleSort = (type) => {
    let sortedData;
    setSelectedSortOption(type);
    if (activeTab === "Existing WholeSaler") {
      sortedData = [...existingWholesalers];
    } else {
      sortedData = [...accountRequests];
    }
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
    }
    if (activeTab === "Existing WholeSaler") {
      setExistingWholesalers(sortedData);
    } else {
      setAccountRequests(sortedData);
    }
    setSort(false);
  };

  useEffect(() => {
    const getWholesalers = async () => {
      try {
        const response = await axios.get(`${Api}/api/v1/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const filtered = response.data.users.filter(
          (user) => user.role === "wholesaler"
        );
        const existing = filtered.filter((w) => w.status === "approved");
        const pending = filtered.filter((w) => w.status === "pending");
        setExistingWholesalers(existing);
        setAccountRequests(pending);
      } catch (error) {
        toast.error(error)
      }
    };
    getWholesalers();
  }, [token]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedWholesalers((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  const handleAcceptUser = async (id) => {
    setApproving(true);
    try {
      const res = await axios.put(
        `${Api}/api/v1/admin/approve-wholesaler/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success("User accepted successfully!");
        const accepted = accountRequests.find((p) => p._id === id);
        setAccountRequests((prev) => prev.filter((p) => p._id !== id));
        setExistingWholesalers((prev) => [...prev, accepted]);
      } else {
        toast.error("Failed to accept user");
      }
    } catch (error) {
      toast.error(error);
    }
    setApproving(false);
  };

  const handleAction = (action, user) => {
    if (action === "Accept User") {
      handleAcceptUser(user._id);
    } else if (action === "Send Email") {
      window.location.href = `mailto:${user.email}`;
    } else if (action === "Send Message") {
      window.location.href = `sms:${user.phone}`;
    } else if (action === "Phone Call") {
      window.location.href = `tel:${user.phone}`;
    }
  };

  const deleteConfirmationToogle = () => {
    toast.warning("Delete confirmation modal not implemented.");
  };

  const filteredList =
    activeTab === "Existing WholeSaler" ? existingWholesalers : accountRequests;

  const filteredWholesalers = filteredList.filter((wholesaler) =>
    wholesaler.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * wholesalersPerPage;
  const indexOfFirst = indexOfLast - wholesalersPerPage;
  const currentWholesalers = filteredWholesalers.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredWholesalers.length / wholesalersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActions({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="w-full p-6 rounded-lg">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Wholesalers</h1>
        <p className="bg-white text-sm rounded-2xl px-3 py-1 border border-gray-300">
          Total: {filteredWholesalers.length}
        </p>
      </div>

      <div className="w-full h-[1px] bg-gray-300 mt-4 border-dashed"></div>

      <div className="relative mt-5">
        <input
          type="text"
          placeholder="Search wholesalers..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full lg:py-3 focus:outline-none lg:pl-12 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-green"
        />
        <BsSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <RxCross1
          onClick={() => setSearchQuery("")}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-red-700 cursor-pointer hover:scale-110"
        />
      </div>

      <div className="w-full flex items-center justify-between mt-5">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 cursor-pointer rounded-md ${
              activeTab === "Existing WholeSaler"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => {
              setActiveTab("Existing WholeSaler");
              setCurrentPage(1);
            }}
          >
            Existing WholeSaler
          </button>
          <button
            className={`px-4 py-2 cursor-pointer rounded-md ${
              activeTab === "Account Request"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => {
              setActiveTab("Account Request");
              setCurrentPage(1);
            }}
          >
            Account Request
          </button>
        </div>
        <div
          onClick={toogleSort}
          className="border relative text-sm rounded-2xl flex items-center gap-1.5 border-gray-300 cursor-pointer bg-white px-3 py-1"
        >
          <p>{selectedSortOption}</p>
          <FaSort />
          {sort && (
            <div className="relative">
              <div className="absolute top-7 right-0 z-[9999] bg-white shadow-lg rounded-md p-2 flex flex-col w-44">
                <p
                  onClick={() => handleSort("A-Z")}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaSortAlphaDown className="text-lg" />
                  A-Z
                </p>
                <p
                  onClick={() => handleSort("Z-A")}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaSortAlphaUp className="text-lg" />
                  Z-A
                </p>
                <p
                  onClick={() => handleSort("Newest-Older")}
                  className="flex items-center gap-2 px-2 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <FaArrowUp className="text-lg" />
                  Newest-Older
                </p>
                <p
                  onClick={() => handleSort("Older-Newer")}
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

      <div className="bg-white h-full rounded-lg mt-4 relative z-0">
        <table className="w-full table-auto  text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedWholesalers.length === filteredWholesalers.length
                  }
                  onChange={() => {
                    if (
                      selectedWholesalers.length === filteredWholesalers.length
                    ) {
                      setSelectedWholesalers([]);
                    } else {
                      setSelectedWholesalers(
                        filteredWholesalers.map((w) => w.id)
                      );
                    }
                  }}
                />
              </th>
              <th className="p-3">Sn.</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 hidden text-left lg:table-cell">Email</th>
              {activeTab === "Existing WholeSaler" && (
                <>
                  <th className="p-3 hidden lg:table-cell">Last Login</th>
                  <th className="p-3 hidden lg:table-cell">Trade Licence</th>
                </>
              )}
              {activeTab === "Account Request" && (
                <th className="p-3 hidden lg:table-cell text-left">Address</th>
              )}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {currentWholesalers?.map((w, index) => (
              <tr key={w._id} className="border border-x-0">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedWholesalers.includes(w.id)}
                    onChange={() => handleCheckboxChange(w.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td className="p-3">
                  <img
                    src={w.image || blankUser}
                    alt={w.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                </td>
                <td className="p-3">{w.name}</td>
                <td className="p-3">{w.phone}</td>
                <td className="p-3 hidden lg:table-cell">{w.email}</td>
                {activeTab === "Existing WholeSaler" && (
                  <>
                    <td className="p-3 hidden lg:table-cell">
                      {w.lastLogin || "Never Logged In"}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {w.tradelicense}
                    </td>
                  </>
                )}
                {activeTab === "Account Request" && (
                  <td className="p-3 hidden lg:table-cell">{w.address}</td>
                )}
                <td className="p-3 mx-auto h-full relative ">
                  <BsThreeDotsVertical
                    className="cursor-pointer"
                    onClick={() => toggleActions(w._id)}
                  />
                  {actions[w?._id] && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-12 text-sm right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[9999999]"
                    >
                      <ul className="p-2 space-y-2 text-sm">
                        <li
                          onClick={() => handleAction("Send Email", w)}
                          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded flex items-center"
                        >
                          <FaEnvelope className="mr-2" /> Send Email
                        </li>
                        <li
                          onClick={() => handleAction("Send Message", w)}
                          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded flex items-center"
                        >
                          <MdOutlineMessage className="mr-2" /> Send Message
                        </li>
                        <li
                          onClick={() => handleAction("Phone Call", w)}
                          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded flex items-center"
                        >
                          <FaPhone className="mr-2" /> Phone Call
                        </li>
                        {w.status === "pending" && (
                          <li
                            onClick={() => handleAction("Accept User", w)}
                            className="cursor-pointer text-green-700 hover:bg-gray-100 px-3 py-1 rounded flex items-center"
                          >
                            <IoCheckmarkDoneCircle className="mr-2" />{" "}
                            {approving ? "Accepting..." : "Accept User"}
                          </li>
                        )}
                        <li
                          onClick={deleteConfirmationToogle}
                          className="cursor-pointer text-red-700 hover:bg-gray-100 px-3 py-1 rounded flex items-center"
                        >
                          <FaMapMarkerAlt className="mr-2" /> Delete User
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8 items-center gap-5">
        <p
          className={`font-bold cursor-pointer ${
            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
          }`}
          onClick={handlePreviousPage}
        >
          Previous
        </p>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <p
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md cursor-pointer text-sm ${
                currentPage === index + 1 ? "bg-green-500 text-white" : ""
              }`}
            >
              {index + 1}
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

export default WholeSalers;
