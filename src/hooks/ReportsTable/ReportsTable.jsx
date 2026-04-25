import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReportsTable = ({ data }) => {
  const [reports, setReports] = useState(data || []);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);
  const [activeTab, setActiveTab] = useState("consumer");
  const [currentPages, setCurrentPages] = useState({
    consumer: 1,
    superSeller: 1,
    producer: 1,
    wholesaler: 1,
  }); // State for current page of each tab
  const reportsPerPage = 10;

  useEffect(() => {}, [data]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Reset current page when search is applied
    setCurrentPages({
      consumer: 1,
      superSeller: 1,
      producer: 1,
      wholesaler: 1,
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reportId) => reportId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextPage = (tab) => {
    if (currentPages[tab] < totalPages(tab)) {
      setCurrentPages((prevPages) => ({
        ...prevPages,
        [tab]: prevPages[tab] + 1,
      }));
    }
  };

  const handlePreviousPage = (tab) => {
    if (currentPages[tab] > 1) {
      setCurrentPages((prevPages) => ({
        ...prevPages,
        [tab]: prevPages[tab] - 1,
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-700 text-white";
      case "Canceled":
        return "bg-red-600 text-white";
      case "Completed":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const totalPages = (tab) => {
    const reportsForTab = filteredReports.filter(
      (report) => report.userType === tab
    );
    return Math.ceil(reportsForTab.length / reportsPerPage);
  };

  const currentReports = (tab) => {
    const reportsForTab = filteredReports.filter(
      (report) => report.userType === tab
    );
    const indexOfLastReport = currentPages[tab] * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    return reportsForTab.slice(indexOfFirstReport, indexOfLastReport);
  };

  return (
    <div className="w-full px-6 rounded-lg">
      <div className="w-full h-[1px] bg-gray-300 mt-5 border-dashed"></div>

      <div className="mb-4 mt-5 w-full flex items-center">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border-gray-300 border bg-white rounded-lg shadow-sm focus:outline-none focus:outline-blue"
        />
      </div>

      <div className="mt-5 flex gap-2 ">
        <button
          className={`cursor-pointer ${
            activeTab === "consumer"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          } py-2 px-4 rounded-md`}
          onClick={() => setActiveTab("consumer")}
        >
          Consumer
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "superSeller"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          } py-2 px-4 rounded-md`}
          onClick={() => setActiveTab("superSeller")}
        >
          Super Seller
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "producer"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          } py-2 px-4 rounded-md`}
          onClick={() => setActiveTab("producer")}
        >
          Producer
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "wholesaler"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          } py-2 px-4 rounded-md`}
          onClick={() => setActiveTab("wholesaler")}
        >
          Wholesaler
        </button>
      </div>

      <div className="rounded-lg bg-white mt-6">
        <table className="w-full">
          <thead className="rounded-lg">
            <tr className="bg-gray-200 rounded-xl">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedReports.length === reports.length}
                  onChange={() => {
                    if (selectedReports.length === reports.length) {
                      setSelectedReports([]);
                    } else {
                      setSelectedReports(
                        currentReports(activeTab).map((report) => report.sn)
                      );
                    }
                  }}
                  className="w-4 h-4"
                />
              </th>
              <th className="text-left">Sn.</th>
              <th className="p-3 text-left">Report ID</th>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Reporter Name</th>
              <th className="p-3 text-left">Issue</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports(activeTab).map((report, index) => (
              <tr
                onClick={() => navigate(`/dashboard/Reports/${report.sn}`)}
                key={report.sn}
                className="hover:bg-gray-200 cursor-pointer border border-gray-400 border-x-0 transition-all"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.sn)}
                    onChange={() => handleCheckboxChange(report.sn)}
                    className="w-4 h-4"
                  />
                </td>
                <td>{index + 1}</td>
                <td className="p-3">{report.reportID}</td>
                <td className="p-3">
                  <img
                    src={report.profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 object-cover object-top rounded-full"
                  />
                </td>
                <td className="p-3">{report.reportName}</td>
                <td className="p-3">{report.issue}</td>
                <td className="p-3">{report.date}</td>
                <td className="p-3 text-center mx-auto">
                  <button
                    className={`px-4 py-2 text-center mx-auto rounded-full ${getStatusColor(
                      report.status
                    )} cursor-pointer`}
                  >
                    {report.status}
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
            currentPages[activeTab] === 1
              ? "text-gray-400 cursor-not-allowed"
              : ""
          }`}
          onClick={() => handlePreviousPage(activeTab)}
        >
          Previous
        </p>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages(activeTab) }, (_, index) => (
            <p
              key={index + 1}
              onClick={() =>
                setCurrentPages({ ...currentPages, [activeTab]: index + 1 })
              }
              className={`rounded-md px-2 py-1.5 text-xs cursor-pointer ${
                currentPages[activeTab] === index + 1
                  ? "bg-green-600 text-white"
                  : ""
              }`}
            >
              {index + 1}
            </p>
          ))}
        </div>

        <p
          className={`font-bold cursor-pointer ${
            currentPages[activeTab] === totalPages(activeTab)
              ? "text-gray-400 cursor-not-allowed"
              : ""
          }`}
          onClick={() => handleNextPage(activeTab)}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default ReportsTable;
