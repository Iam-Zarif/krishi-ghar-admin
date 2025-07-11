import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { Api } from "../../../Api/Api";

const ProducerPage = () => {
  const navigate = useNavigate();
  const { producer } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [approving, setApproving] = useState(false);
  const [DeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const token = localStorage.getItem("token");
  console.log(producer)

  useEffect(() => {
    if (!producer || !producer._id) {
      toast.error("Producer data not found or invalid.");
      navigate("/dashboard/Producers");
    } else {
      setLoading(false);
      document.title = `${producer?.name || "Producer"} | Krishi Ghar`;
    }
  }, [producer, navigate]);

  const handleAction = (action, user) => {
    if (!user) return;
    setShowActions(false);

    if (action === "Send Email") {
      window.location.href = `mailto:${user.email}`;
    } else if (action === "Phone Call") {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `tel:${user.phone}`;
      } else {
        alert("Use mobile for call");
      }
    } else if (action === "Send Message") {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `sms:${user.phone}`;
      } else {
        alert("Use phone to send message");
      }
    } else if (action === "Accept User") {
      setApproving(true);
      setTimeout(() => {
        toast.success("User accepted!");
        setApproving(false);
      }, 1500);
    } else {
      toast.info(`${action} triggered`);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
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
        toast.success(
          response.data.message || "Producer deleted successfully!",
          {
            position: "top-right",
          }
        );
        setDeleteConfirmation(false);
        navigate("/dashboard/Producers");
      } else {
        toast.error("Unexpected response status. Please try again.");
      }
    } catch (err) {
      console.error("Error occurred: ", err);
      toast.error("Failed to delete producer.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse mb-4" />
        <div className="w-3/4 h-4 bg-gray-300 animate-pulse mb-2" />
        <div className="w-1/2 h-4 bg-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 mt-6 relative bg-white rounded-xl shadow-md">
      {/* Status and role */}
      <div className="absolute top-5 left-5">
        <p
          className={`px-3 py-1 text-white text-sm font-semibold rounded ${
            producer?.status === "approved" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {producer?.status}
        </p>
        <p className="px-3 py-1 mt-1.5 text-white text-sm bg-yellow-600 font-semibold rounded">
          {producer?.role}
        </p>
      </div>

      {/* 3-dot with actions */}
      <div className="absolute top-5 right-5">
        <BsThreeDotsVertical
          className="cursor-pointer"
          onClick={() => setShowActions(!showActions)}
        />
        {showActions && (
          <div className="absolute top-6 right-0 bg-white border border-gray-300 rounded shadow-md w-44 z-50">
            <ul className="p-2 text-sm text-gray-800 space-y-1">
              <li
                onClick={() => handleAction("Send Email", producer)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <FaEnvelope className="inline mr-2" />
                Send Email
              </li>
              <li
                onClick={() => handleAction("Send Message", producer)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <MdOutlineMessage className="inline mr-2" />
                Send Message
              </li>
              <li
                onClick={() => handleAction("Phone Call", producer)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <FaPhone className="inline mr-2" />
                Phone Call
              </li>
              {producer.status === "pending" && (
                <li
                  onClick={() => handleAction("Accept User", producer)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded text-green-700"
                >
                  <IoCheckmarkDoneCircle className="inline mr-2" />
                  {approving ? "Accepting..." : "Accept User"}
                </li>
              )}
              <li
                onClick={() => setDeleteConfirmation(true)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600"
              >
                <FaMapMarkerAlt className="inline mr-2" />
                Delete User
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {DeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this producer? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                {deleteloading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <img
          src={
            producer?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt={producer?.name}
          className="w-40 h-40 rounded-full border-4 border-green-600 shadow-lg object-cover"
        />
        <h2 className="mt-4 text-3xl font-bold text-green-700 text-center">
          {producer?.name || "Unknown Producer"}
        </h2>
      </div>

      <div className="w-full h-[1px] shadow-sm shadow-gray-300 mt-3"></div>

      <div className="mt-8 flex flex-wrap gap-x-20 gap-y-4 text-gray-800 justify-center text-base">
        <div className="flex flex-col gap-3">
          <p>
            <span className="font-bold">Phone:</span> {producer?.phone}
          </p>
          <p>
            <span className="font-bold">Email:</span> {producer?.email}
          </p>
          <p>
            <span className="font-bold">Trade Licence:</span>{" "}
            {producer?.tradelicense}
          </p>
          <p>
            <span className="font-bold">Last Login:</span>{" "}
            {producer?.lastLogin
              ? new Date(producer.lastLogin).toLocaleDateString("en-GB")
              : "Never Logged In"}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p>
            <span className="font-bold">Division:</span> {producer?.division}
          </p>
          <p>
            <span className="font-bold">District:</span> {producer?.district}
          </p>
          <p>
            <span className="font-bold">Thana:</span> {producer?.thana}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] shadow-sm shadow-gray-300 mt-6"></div>

      <div className="mt-6">
        <p className="text-2xl font-semibold">Products</p>
        <div className="mt-4">
          <p className="text-center text-red-600">No Products available</p>
        </div>
      </div>
    </div>
  );
};

export default ProducerPage;
