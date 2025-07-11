import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect } from "react";
import { FaArrowDown, FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSort, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import blankUser from "../../../public/photos/common/user.png";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { Api } from "../../Api/Api";
import { toast, ToastContainer } from "react-toastify";

const SupperSellers = () => {
  const token = localStorage.getItem("token");
  const [selectedSortOption, setSelectedSortOption] = useState("Sort By");
  const [sellers, setSellers] = useState([]);
   const [sort, setSort] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [error, setError] = useState(null); 
   const [deleteloading, setDeleteLoading] = useState(false);
   const [approving, setApproving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [existedSellers, setExistedSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [accountRequest, setAccountRequest] = useState([]);
  const [actions, setActions] = useState(false);
  const [DeleteConfirmation, setDeleteConfirmation] = useState(false);
  
const actionsToogle = (id) => {
  setActions((prevActions) => ({
    ...prevActions,
    [id]: prevActions[id] ? null : true,
  }));
};

  const [activeTab, setActiveTab] = useState("Existing Supper-Sellers");
  const [selectedSellers, setSelectedSellers] = useState([]);
  const sellersPerPage = 7;
const handleAction = (action, seller) => {
  if (!seller) return;

  if (action === "Send Email") {
    window.location.href = `mailto:${seller.email}`;
  } else if (action === "Phone Call") {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${seller.phone}`;
    } else {
      alert("Use mobile for call");
    }
  } else if (action === "Accept User") {
    handleAcceptUser(seller._id);
  } else if (action === "Send Message") {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = `sms:${seller.phone}`;
    } else {
      alert("Use phone to send message");
    }
  } 
};

 useEffect(() => {
   setSellersLoading(true);
   const fetchSellers = async () => {
     try {
       const response = await axios.get(`${Api}/api/v1/admin/users`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
         withCredentials: true,
       });
       const sellersData = response.data.users.filter(
         (user) => user.role === "supersaler"
       );
       const existingSellers = sellersData.filter(
         (seller) => seller.status === "approved"
       );
       const accountRequests = sellersData.filter(
         (seller) => seller.status === "pending"
       );
       setExistedSellers(existingSellers);
       setAccountRequest(accountRequests);
       setSellers(sellersData);
     } catch (error) {
       setSellersLoading(false);
       console.error("Error fetching sellers:", error);
       setError(error.response?.data?.message || "Failed to fetch sellers");
     } finally {
       setSellersLoading(false);
     }
   };

   fetchSellers();
 }, [token]);




  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedSellers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sellerId) => sellerId !== id)
        : [...prevSelected, id]
    );
  };

 const filteredSellers = (
   activeTab === "Existing Supper-Sellers" ? existedSellers : accountRequest
 ).filter(
   (seller) =>
     seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     seller.phone.includes(searchQuery)
 );

 const indexOfLastSeller = currentPage * sellersPerPage;
 const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
 const currentSellers = filteredSellers.slice(
   indexOfFirstSeller,
   indexOfLastSeller
 );


  const totalPages = Math.ceil(filteredSellers.length / sellersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
const toogleSort = () => {
  setSort((prev) => !prev);
};

const handleSort = (type) => {
  let sortedData;
  setSelectedSortOption(type);

  if (activeTab === "Existing sellers") {
    sortedData = [...existedSellers];
  } else {
    sortedData = [...accountRequest];
  }

  switch (type) {
    case "A-Z":
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Z-A":
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "Newest-Older":
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "Older-Newer":
      sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      return;
  }

  if (activeTab === "Existing Supper-Sellers") {
    setExistedSellers(sortedData);
  } else {
    setAccountRequest(sortedData);
  }

  setSort(false);
};
  const deleteConfirmationToogle = (event, seller) => {
    console.log("DeleteConfiumation Toogle seller:", seller);
    setDeleteConfirmation(!DeleteConfirmation);

    event.stopPropagation();
    setSellerToDelete(seller);
    setActions(false)
  };
const handleAcceptUser = async (sellerId) => {
  setApproving(true);
  try {
    const response = await axios.put(
      `${Api}/api/v1/admin/all-supersaler/approve/${sellerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      toast.success("User accepted successfully!");

      setAccountRequest((prevAccountRequest) =>
        prevAccountRequest.filter((seller) => seller._id !== sellerId)
      );
      const acceptedseller = sellers.find(
        (seller) => seller._id === sellerId
      );
      setExistedSellers((prevExistedsellers) => [
        ...prevExistedsellers,
        acceptedseller,
      ]);
    } else {
      toast.error("Failed to accept user. Server responded with error.");
    }
  } catch (error) {
    setApproving(false);
    if (error.response) {
      toast.error(
        `Error: ${error.response.data.message || "Something went wrong"}`
      );
    } else if (error.request) {
      setApproving(false);
      toast.error("No response received from server");
    } else {
      setApproving(false);
      toast.error(`Error: ${error.message || "An unexpected error occurred"}`);
    }
  } finally {
    setApproving(false);
  }
};

const removeSeller = (sellerId) => {
  setSellers((prev) => prev.filter((s) => s._id !== sellerId));
  setExistedSellers((prev) => prev.filter((s) => s._id !== sellerId));
  setAccountRequest((prev) => prev.filter((s) => s._id !== sellerId));
};

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      const response = await axios.delete(
        `${Api}/api/v1/admin/all-supersaler/${sellerToDelete?._id}`,
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
        removeSeller(sellerToDelete?._id);
        toast.success(
          response.data.message || "seller deleted successfully!",
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
      toast.error("Failed to delete seller.", {
        position: "top-right",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="w-full p-6 rounded-lg">
      <ToastContainer />
      <div className="w-full flex items-center lg:mt-0 mt-5 px-4 lg:px-0 justify-between">
        <h1 className="lg:text-3xl text-xl font-bold text-green-700">
          SuperSalers
        </h1>
        <p className="border flex items-center gap-1 lg:text-md text-sm bg-white rounded-2xl border-gray-300 px-3 py-1">
          Total :{" "}
          {sellersLoading ? (
            <span className="text-xs">Counting</span>
          ) : (
            <>
              {activeTab === "Existing Supper-Sellers"
                ? existedSellers?.length
                : accountRequest?.length}
            </>
          )}
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-300 mt-5 border-dashed"></div>

      <div className="mb-4 relative px-4 lg:px-0 mt-5 w-full flex items-center">
        <input
          type="text"
          placeholder="Search sellers..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full lg:py-3 lg:pl-12 py-2   border-gray-300 border bg-white rounded-lg shadow-sm focus:outline-none focus:outline-green"
        />
        <BsSearch className="absolute text-gray-500 left-5 top-1/2 transform text-lg -translate-y-1/2" />
        <RxCross1
          onClick={() => setSearchQuery("")}
          className="absolute text-red-700 hover:scale-110 hover:font-semibold right-5 top-1/2 transform text-xl cursor-pointer -translate-y-1/2"
        />
      </div>

      <div className="w-full flex items-center justify-between mt-5">
        {" "}
        <div className="flex gap-2 ">
          <button
            className={`cursor-pointer ${
              activeTab === "Existing Supper-Sellers"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            } py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("Existing Supper-Sellers")}
          >
            Existing Supper-Sellers
          </button>
          <button
            className={`cursor-pointer ${
              activeTab === "Account Request"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            } py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("Account Request")}
          >
            Account Request
          </button>
        </div>{" "}
        <div
          onClick={toogleSort}
          className="border relative text-sm rounded-2xl flex items-center gap-1.5 border-gray-300 cursor-pointer bg-white px-3 py-1"
        >
          <p>{selectedSortOption}</p>
          <FaSort />
          {sort && (
            <div className="relative">
              <div className="absolute top-7 right-0 z-[99990] bg-white shadow-lg rounded-md p-2 flex flex-col w-44">
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

      <div className="rounded-lg mt-5 bg-white">
        <table className="w-full">
          <thead className="rounded-lg">
            <tr className="bg-gray-200 rounded-xl">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedSellers.length === sellers.length}
                  onChange={() =>
                    setSelectedSellers(
                      selectedSellers.length === sellers.length
                        ? []
                        : filteredSellers.map((s) => s._id)
                    )
                  }
                  className="w-4 h-4"
                />
              </th>
              <th className="p-3 text-left">Sn.</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left hidden lg:table-cell">Email</th>
              <th className="p-3 text-left hidden lg:table-cell">
                {activeTab === "Existing Supper-Sellers"
                  ? "Last Login"
                  : "Location"}
              </th>
              {activeTab === "Existing Supper-Sellers" && (
                <th className="p-3 text-left hidden lg:table-cell">
                  Trade Licence
                </th>
              )}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSellers?.map((seller, index) => (
              <tr
                key={seller._id}
                className="hover:bg-gray-200 cursor-pointer border border-gray-400 border-x-0 transition-all"
              >
                {console.log("Seller", seller)}

                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedSellers.includes(seller._id)}
                    onChange={() => handleCheckboxChange(seller._id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={seller?.image || blankUser}
                    alt={seller?.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                </td>
                <td className="p-3">{seller?.name}</td>
                <td className="p-3">{seller?.phone}</td>
                <td className="p-3 hidden lg:table-cell">{seller.email}</td>
                <td className="p-3 hidden lg:table-cell">
                  {activeTab === "Existing Supper-Sellers"
                    ? seller?.lastLogin !== "Never logged in"
                      ? new Date(seller.lastLogin).toLocaleDateString("en-GB")
                      : "Never Logged In"
                    : seller?.address || "Not Set"}
                </td>
                {activeTab === "Existing Supper-Sellers" && (
                  <td className="p-3 hidden lg:table-cell">
                    {seller?.tradeLicence || "Not Set"}
                  </td>
                )}
                <td className="mx-auto mt-7 relative flex items-center justify-center">
                  <BsThreeDotsVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      actionsToogle(seller._id);
                    }}
                    className="hover:scale-125 duration-200 transition-all"
                  />
                  {actions[seller._id] && (
                    <div className="absolute top-6 text-sm right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[99999]">
                      <div className="absolute -top-1.5  right-5">
                        <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>

                        <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                      </div>
                      <ul className="list-none p-2">
                        <li
                          onClick={() => handleAction("Send Email", seller)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <FaEnvelope className="inline mr-2" />
                          Send Email
                        </li>
                        <li
                          onClick={() => handleAction("Send Message", seller)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <MdOutlineMessage className="inline mr-2" />
                          Send Message
                        </li>
                        <li
                          onClick={() => handleAction("Phone Call", seller)}
                          className="cursor-pointer hover:bg-white p-2 rounded-md"
                        >
                          <FaPhone className="inline mr-2" />
                          Phone Call
                        </li>
                        {seller.status === "pending" && (
                          <li
                            onClick={() => handleAction("Accept User", seller)}
                            className="cursor-pointer hover:bg-white p-2 text-green-600 rounded-md"
                          >
                            <IoCheckmarkDoneCircle className="inline mr-2" />
                            {approving ? "Accepting..." : "Accept User"}
                          </li>
                        )}
                        <li
                          onClick={(e) => deleteConfirmationToogle(e, seller)}
                          className="cursor-pointer text-red-600 hover:bg-white p-2 rounded-md"
                        >
                          <FaMapMarkerAlt className="inline mr-2" />
                          Delete User
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
      {DeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-green-950 p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={() => setDeleteConfirmation(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <RxCross1 className="w-5 h-5 cursor-pointer" />
            </button>
            <h2 className="text-lg font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mt-4 text-sm">
              Are you sure you want to delete{" "}
              <strong>{sellerToDelete?.name || "no name"}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-200 border rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {deleteloading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sellersLoading && (
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

      {filteredSellers?.length === 0 && !sellersLoading && !error && (
        <p className="text-center mt-6 text-red-500">No SuperSaler Found</p>
      )}
      {error && (
        <p className="text-center mt-6 text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
      <div
        className={`flex justify-center mt-12 items-center gap-5 ${
          filteredSellers?.length === 0 && "hidden"
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

export default SupperSellers;
