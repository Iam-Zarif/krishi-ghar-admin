/* eslint-disable react/prop-types */
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUserCheck,
} from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import blankUser from "../../../public/photos/common/user.png";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { Api } from "../../Api/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AllProducersTable = ({
  producer,
  activeTab,
  handleCheckboxChange,
  actionsToogle,
  approving,
  handleAction,
  actions,
  selectedProducers,
  index,
  removeProducer,
}) => {
  const [DeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const deleteConfirmationToogle = (event) => {
    setDeleteConfirmation(!DeleteConfirmation);
    event.stopPropagation();
    actionsToogle(producer?._id);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    console.log("Current activeTab: ", activeTab);

    try {
      const response = await axios.delete(
        `${Api}/api/v1/admin/users/${producer?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setDeleteConfirmation(false);
        removeProducer(producer?._id);
        toast.success(
          response.data.message || "Producer deleted successfully!",
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
      console.error("Error occurred: ", err); // Add this line to catch error logs
      toast.error("Failed to delete producer.", {
        position: "top-right",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {DeleteConfirmation && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
            <div className="bg-green-950 p-6 rounded-xl shadow-lg w-96 relative">
              <button
                onClick={deleteConfirmationToogle}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <RxCross1 className="w-5 h-5 cursor-pointer" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={deleteConfirmationToogle}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  {deleteloading ? "Deleteing..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "Existing Producer" && producer.status === "approved" ? (
        <>
          <tr
            key={producer?._id}
            className={`hover:bg-gray-200 cursor-pointer border border-gray-400 border-x-0 transition-all`}
          >
            <td className="lg:p-3 p-2">
              <input
                type="checkbox"
                checked={selectedProducers.includes(producer.id)}
                onChange={() => handleCheckboxChange(producer.id)}
                className="w-4 h-4"
              />
            </td>
            <td className="text-center">{index + 1}</td>
            <td className="lg:lg:p-3 p-2">
              <img
                src={producer.image || blankUser}
                alt={producer.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
            </td>
            <td className="lg:p-3 p-2">{producer.name}</td>
            <td className="lg:p-3 p-2">{producer.phone}</td>

            {activeTab === "Existing Producers" ? (
              <>
                <td className="text-center hidden lg:table-cell">
                  {producer?.email}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer?.lastLogin &&
                  producer.lastLogin !== "Never logged in"
                    ? new Date(producer.lastLogin).toLocaleDateString("en-GB") // Format as dd/mm/yyyy
                    : "Never Logged In"}
                </td>

                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer?.tradelicense}
                </td>
                <td className="lg:p-3 p-2">
                  <span className="text-green-500">Approved</span>
                </td>
              </>
            ) : (
              <>
                <td className="lg:p-3 p-2 hidden lg:block">
                  {producer?.email}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.division}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.district}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.thana}
                </td>
              </>
            )}

            <td className="mx-auto mt-6  relative flex items-center justify-center">
              <BsThreeDotsVertical
                className="hover:scale-125 duration-300 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  actionsToogle(producer?._id);
                }}
              />

              {actions[producer?._id] && (
                <div className="absolute top-5 text-sm right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[99999]">
                  <div className="absolute -top-1.5  right-9">
                    <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>

                    <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                  </div>
                  <ul className="list-none p-2">
                    <li
                      onClick={() =>
                        navigate(`/dashboard/producers/${producer._id}`)
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-md flex items-center"
                    >
                      <FaUserCheck className="inline mr-2" />
                      View User
                    </li>

                    <li
                      onClick={() => handleAction("Send Email", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <FaEnvelope className="inline mr-2" />
                      Send Email
                    </li>
                    <li
                      onClick={() => handleAction("Send Message", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <MdOutlineMessage className="inline mr-2" />
                      Send Message
                    </li>
                    <li
                      onClick={() => handleAction("Phone Call", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <FaPhone className="inline mr-2" />
                      Phone Call
                    </li>
                    {producer.status === "pending" && (
                      <li
                        onClick={() => handleAction("Accept User", producer)}
                        className="cursor-pointer hover:bg-white p-2 text-green-600 rounded-md"
                      >
                        <IoCheckmarkDoneCircle className="inline mr-2" />
                        {approving ? "Accepting..." : "Accept User"}
                      </li>
                    )}
                    <li
                      onClick={deleteConfirmationToogle}
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
        </>
      ) : (
        <>
          {" "}
          <tr
            key={producer?._id}
            className={`hover:bg-gray-200   cursor-pointer border border-gray-400 border-x-0 transition-all`}
          >
            <td className="lg:p-3 pl-2">
              <input
                type="checkbox"
                checked={selectedProducers.includes(producer.id)}
                onChange={() => handleCheckboxChange(producer.id)}
                className="w-4 h-4"
              />
            </td>
            <td className="lg:text-center">{index + 1}</td>
            <td className="lg:p-3 py-1.5">
              <img
                src={producer.image || blankUser}
                alt={producer.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
            </td>
            <td className="lg:p-3 p-2">{producer.name}</td>
            <td className="lg:p-3 p-2">{producer.phone}</td>

            {activeTab === "Existing Producers" ? (
              <>
                <td className="hidden lg:table-cell relative group">
                  <span>
                    {producer?.email?.length > 12
                      ? producer.email.slice(0, 12) + "..."
                      : producer?.email}
                  </span>
                  {producer?.email?.length > 12 && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {producer?.email}
                    </span>
                  )}
                </td>

                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer?.lastLogin &&
                  producer.lastLogin !== "Never logged in"
                    ? new Date(producer.lastLogin).toLocaleDateString("en-GB") // Format as dd/mm/yyyy
                    : "Never Logged In"}
                </td>

                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer?.tradelicense}
                </td>
              </>
            ) : (
              <>
                <td className="hidden lg:table-cell relative group">
                  <span>
                    {producer?.email?.length > 12
                      ? producer.email.slice(0, 12) + "..."
                      : producer?.email}
                  </span>
                  {producer?.email?.length > 12 && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {producer?.email}
                    </span>
                  )}
                </td>

                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.division}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.district}
                </td>
                <td className="lg:p-3 p-2 hidden lg:table-cell">
                  {producer.thana}
                </td>
              </>
            )}

            <td className="mx-auto mt-6  relative flex items-center justify-center">
              <BsThreeDotsVertical
                className="hover:scale-125 duration-300 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  actionsToogle(producer?._id);
                }}
              />

              {actions[producer?._id] && (
                <div className="absolute top-7 text-sm right-5 bg-gray-100 border border-gray-300 shadow-lg rounded-md w-48 z-[99999]">
                  <div className="absolute -top-1.5  right-9">
                    <div className="absolute -top-[2px] right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>

                    <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                  </div>
                  <ul className="list-none p-2">
                    <li
                      onClick={() =>
                        navigate(`/dashboard/producers/${producer._id}`)
                      }
                      className="cursor-pointer hover:bg-white p-2 rounded-md flex items-center"
                    >
                      <FaUserCheck className="inline mr-2" />
                      View User
                    </li>

                    <li
                      onClick={() => handleAction("Send Email", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <FaEnvelope className="inline mr-2" />
                      Send Email
                    </li>
                    <li
                      onClick={() => handleAction("Send Message", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <MdOutlineMessage className="inline mr-2" />
                      Send Message
                    </li>
                    <li
                      onClick={() => handleAction("Phone Call", producer)}
                      className="cursor-pointer hover:bg-white p-2 rounded-md"
                    >
                      <FaPhone className="inline mr-2" />
                      Phone Call
                    </li>
                    {producer.status === "pending" && (
                      <li
                        onClick={() => handleAction("Accept User", producer)}
                        className="cursor-pointer hover:bg-white p-2 text-green-600 rounded-md"
                      >
                        <IoCheckmarkDoneCircle className="inline mr-2" />
                        {approving ? "Accepting..." : "Accept User"}
                      </li>
                    )}
                    <li
                      onClick={deleteConfirmationToogle}
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
        </>
      )}
    </>
  );
};

export default AllProducersTable;
