import { useState, useEffect } from "react";
import axios from "axios";
import { Api } from "../../Api/Api";
import { toast, ToastContainer } from "react-toastify";
import AllProducersTable from "../AllProducersTable/AllProducersTable";
import { BsSearch } from "react-icons/bs";
import Pagination from "../../hooks/Pagination/Pagination";
import { RxCross1 } from "react-icons/rx";
import { FaArrowDown, FaArrowUp, FaSort, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";


const Producers = () => {
  const [producers, setProducers] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("Sort By");
  const [actions, setActions] = useState(false);  
  const [producersLoading, setProducersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [existedProducers, setExistedProducers] = useState([]);
  const [sort, setSort] = useState(false);
  const [accountRequest, setAccountRequest] = useState([]);
  const [approving, setApproving] = useState(false);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [existedProducerCurrentPage, setExistedProducerCurrentPage] =
    useState(1);
  const [accountRequestedCurrentPage, setAccountRequestedCurrentPage] =
    useState(1);
  const itemsPerPage = 10;
  const existedProducerTotalPages =
    Math.ceil(existedProducers.length / itemsPerPage) || 1;
  const accountRequestTotalPages =
    Math.ceil(accountRequest.length / itemsPerPage) || 1;

  const getPaginatedProducers = (producers, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return producers.slice(startIndex, startIndex + itemsPerPage);
  };

const toogleSort = () => {
  setSort((prev) => !prev);
};


const paginatedExistedProducers = getPaginatedProducers(
  existedProducers,
  existedProducerCurrentPage
);
const paginatedAccountRequestProducers = getPaginatedProducers(
  accountRequest,
  accountRequestedCurrentPage
);


  const [activeTab, setActiveTab] = useState("Existing Producers");

const handleAction = (action, producer) => {
  if (!producer) return;

  if (action === "Send Email") {
    window.location.href = `mailto:${producer.email}`;
  } else if (action === "Phone Call") {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${producer.phone}`;
    } else {
      alert("Use mobile for call");
    }
  } else if (action === "Accept User") {
    handleAcceptUser(producer._id);
  } else if (action === "Send Message") {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = `sms:${producer.phone}`;
    } else {
      alert("Use phone to send message");
    }
  } else {
    console.log(`Action triggered: ${action}`);
  }
};

  const actionsToogle = (id) => {
    setActions((prevActions) => ({
      ...prevActions,
      [id]: prevActions[id] ? null : true,
    }));
  };


  const token = localStorage.getItem("token");

 useEffect(() => {
   setProducersLoading(true);
   const fetchProducers = async () => {
     try {
       const response = await axios.get(`${Api}/api/v1/admin/users`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
         withCredentials: true,
       });
       console.log(response); 
       const producersData = response.data.users.filter(
         (user) => user.role === "producer"
       );
       const existingProducers = producersData.filter(
         (producer) => producer.status === "approved"
       );
       const accountRequests = producersData.filter(
         (producer) => producer.status === "pending"
       );
       setExistedProducers(existingProducers);
       setAccountRequest(accountRequests);
       setProducers(producersData);
     } catch (error) {
       setProducersLoading(false);
       console.error("Error fetching producers:", error);
     } finally {
       setProducersLoading(false);
     }
   };

   fetchProducers();
 }, [token]);




  const handleCheckboxChange = (id) => {
    setSelectedProducers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((producerId) => producerId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredProducers = producers.filter((producer) => {
    return (
      producer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


useEffect(() => {
  const savedTab = localStorage.getItem("selectedTab");
  if (savedTab) {
    setActiveTab(savedTab);
  }
}, []);

const handleTabChange = (tab) => {
  setActiveTab(tab);
  localStorage.setItem("selectedTab", tab);
};
 

const handleSort = (type) => {
  let sortedData;
  setSelectedSortOption(type); 

  if (activeTab === "Existing Producers") {
    sortedData = [...existedProducers];
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

  if (activeTab === "Existing Producers") {
    setExistedProducers(sortedData);
  } else {
    setAccountRequest(sortedData);
  }

  setSort(false); 
};



   const handleSearch = (e) => {
     setSearchQuery(e.target.value);
   };

const handleAcceptUser = async (producerId) => {
  setApproving(true);
  try {
    const response = await axios.put(
      `${Api}/api/v1/admin/approve-producer/${producerId}`,
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
        prevAccountRequest.filter((producer) => producer._id !== producerId)
      );
      const acceptedProducer = producers.find(
        (producer) => producer._id === producerId
      );
      setExistedProducers((prevExistedProducers) => [
        ...prevExistedProducers,
        acceptedProducer,
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
  }
  finally {
    setApproving(false);
  }
};

 const removeProducer = (producerId) => {
   setProducers((prevProducers) =>
     prevProducers?.filter((producer) => producer?._id !== producerId)
   );
 };


  return (
    <div className="w-full lg:p-6 rounded-lg">
      <ToastContainer />

      <div className="w-full flex items-center lg:mt-0 mt-5 px-4 lg:px-0 justify-between">
        <h1 className="lg:text-3xl text-xl font-bold text-green-700">
          Producers
        </h1>
        <p className="border flex items-center gap-1 lg:text-md text-sm bg-white rounded-2xl border-gray-300 px-3 py-1">
          Total :{" "}
          {producersLoading ? (
            <span className="text-xs">Counting</span>
          ) : (
            <>
              {activeTab === "Existing Producers"
                ? existedProducers.length
                : accountRequest.length}
             </>
          )}
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-300 mt-3 lg:mt-5 border-dashed"></div>

      <div className="mb-4 relative px-4 lg:px-0 mt-5 w-full flex items-center">
        <input
          type="text"
          placeholder="Search producers..."
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
      <div className="mt-5 flex items-center px-4 lg:px-0 justify-between w-full">
        <div className=" flex gap-2 ">
          <button
            className={`cursor-pointer ${
              activeTab === "Existing Producers"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            } py-2 px-3 lg:px-4 text-sm lg:text-[16px] rounded-md`}
            onClick={() => handleTabChange("Existing Producers")}
          >
            Existing Producers
          </button>
          <button
            className={`cursor-pointer ${
              activeTab === "Account Request"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            } py-2 px-3 lg:px-4 text-sm lg:text-[16px] rounded-md`}
            onClick={() => handleTabChange("Account Request")}
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
      <div className="rounded-lg w-full text-sm lg:text-[16px] bg-white mt-4">
        <table className="w-full table-auto">
          <thead className="rounded-lg ">
            <tr className="bg-gray-200 rounded-xl">
              {activeTab === "Existing Producers" ? (
                <>
                  <th className="lg:p-3 p-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducers?.length === producers?.length}
                      onChange={() => {
                        if (selectedProducers?.length === producers?.length) {
                          setSelectedProducers([]);
                        } else {
                          setSelectedProducers(
                            filteredProducers?.map((p) => p?.id)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="lg:p-3 p-2  text-left">Sn.</th>
                  <th className="lg:p-3 p-2  text-left">Image</th>
                  <th className="lg:p-3 p-2  text-left">Name</th>
                  <th className="lg:p-3 p-2  text-left">Phone</th>
                  <th className="lg:p-3 p-2  text-left hidden lg:table-cell">
                    Email
                  </th>
                  <th className="lg:p-3 p-2  text-left hidden lg:table-cell">
                    Last Login
                  </th>
                  <th className="lg:p-3 p-2  text-left hidden lg:table-cell">
                    Trade Licence
                  </th>
                  <th className="lg:p-3 p-2  text-left">Actions</th>
                </>
              ) : (
                <>
                  <th className="lg:p-3 p-2  text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducers.length === producers.length}
                      onChange={() => {
                        if (selectedProducers.length === producers.length) {
                          setSelectedProducers([]);
                        } else {
                          setSelectedProducers(
                            filteredProducers.map((p) => p.id)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="lg:p-3 p-0  text-left">Sn.</th>
                  <th className="lg:p-3 p-2 text-left">Image</th>
                  <th className="lg:p-3 p-2  text-left">Name</th>
                  <th className="lg:p-3 p-2  text-left">Phone</th>
                  <th className="lg:p-3  text-left hidden lg:block">Email</th>
                  <th className="lg:p-3  text-left hidden lg:table-cell">
                    Division
                  </th>
                  <th className="lg:p-3  text-left hidden lg:table-cell">
                    District
                  </th>
                  <th className="lg:p-3  text-left hidden lg:table-cell">
                    Thana
                  </th>
                  <th className="lg:p-3 p-2 text-left">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === "Existing Producers"
              ? paginatedExistedProducers
              : paginatedAccountRequestProducers
            )
              .filter((producer) => filteredProducers.includes(producer))
              .map((producer, index) => (
                <AllProducersTable
                  producer={producer}
                  key={producer?._id}
                  activeTab={activeTab}
                  handleCheckboxChange={handleCheckboxChange}
                  actionsToogle={actionsToogle}
                  handleAction={handleAction}
                  actions={actions}
                  removeProducer={removeProducer}
                  selectedProducers={selectedProducers}
                  index={index}
                  existedProducers={paginatedExistedProducers}
                  accountRequest={paginatedAccountRequestProducers}
                  approving={
                    activeTab === "Account Request" ? approving : undefined
                  } 
                />
              ))}
          </tbody>
        </table>
        {producersLoading && (
          <div className="">
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
        )}
      </div>

      <div>
        {activeTab === "Existing Producers" ? (
          <>
            {paginatedExistedProducers?.length < 1 && (
              <>
                {producersLoading ? (
                  <>
                    {" "}
                    <div className="flex mt-8 items-center justify-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-center mt-6 text-red-500">
                      No producer found
                    </p>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {activeTab === "Existing Producers" ? (
        <>
          {paginatedExistedProducers?.length < 1 ? (
            <></>
          ) : (
            <Pagination
              totalPages={existedProducerTotalPages}
              currentPage={existedProducerCurrentPage}
              setCurrentPage={setExistedProducerCurrentPage}
            />
          )}
        </>
      ) : (
        <>
          {paginatedAccountRequestProducers?.length < 1 ? (
            <>
              {producersLoading ? (
                <>
                  {" "}
                  <div className="flex mt-8 items-center justify-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center mt-6 text-red-500">
                    No producer found
                  </p>
                </>
              )}
            </>
          ) : (
            <Pagination
              totalPages={accountRequestTotalPages}
              currentPage={accountRequestedCurrentPage}
              setCurrentPage={setAccountRequestedCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Producers;
